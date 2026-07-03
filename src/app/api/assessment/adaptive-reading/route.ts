// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH — Adaptive Reading Assessment API
// Uses IRT to select optimal questions per student ability
// Each student gets a unique, personalized test
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { withApiProtection } from '@/lib/api-protection';
import {
  initAdaptiveTest,
  processResponse,
  getNextItem,
  getReadingItemDifficulty,
  thetaToScore,
  thetaToLevel,
  DEFAULT_IRT_CONFIG,
  type IRTItem,
  type IRTResponse,
  type AdaptiveReadingState,
} from '@/services/irt-engine';
import { ALL_READING_PASSAGES, type ReadingPassage, type ReadingQuestion } from '@/data/reading-passages';

// ─── In-Memory Session Store (per-user adaptive state) ──────
// In production, this would be in Redis or DB. For now, memory works for <100 concurrent users.

const adaptiveSessions = new Map<string, {
  state: AdaptiveReadingState;
  questionMap: Map<string, { passage: ReadingPassage; question: ReadingQuestion }>;
  createdAt: number;
}>();

// Clean old sessions every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, session] of adaptiveSessions) {
    if (now - session.createdAt > 60 * 60 * 1000) { // 1 hour expiry
      adaptiveSessions.delete(key);
    }
  }
}, 10 * 60 * 1000);

// ─── Build IRT Item Pool from Reading Passages ──────────────

function buildItemPool(): { items: IRTItem[]; questionMap: Map<string, { passage: ReadingPassage; question: ReadingQuestion }> } {
  const items: IRTItem[] = [];
  const questionMap = new Map<string, { passage: ReadingPassage; question: ReadingQuestion }>();

  for (const passage of ALL_READING_PASSAGES) {
    for (let qIdx = 0; qIdx < passage.questions.length; qIdx++) {
      const question = passage.questions[qIdx];
      const irtItem = getReadingItemDifficulty(passage.difficulty, qIdx);
      irtItem.id = question.id;
      items.push(irtItem);
      questionMap.set(question.id, { passage, question });
    }
  }

  return { items, questionMap };
}

// ─── Handler ────────────────────────────────────────────────

async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, sessionId, response } = body as {
      action: 'start' | 'answer' | 'status';
      userId: string;
      sessionId?: string;
      response?: { itemId: string; correct: boolean };
    };

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // ─── START: Initialize new adaptive test ────────────────

    if (action === 'start') {
      const { items, questionMap } = buildItemPool();

      // Shuffle items slightly to avoid always starting with same question
      const shuffledItems = [...items].sort(() => Math.random() - 0.5);

      const state = initAdaptiveTest(shuffledItems, {
        ...DEFAULT_IRT_CONFIG,
        minItems: 5,
        maxItems: 15,
        seThreshold: 0.45,
      });

      const sid = `adaptive-${userId}-${Date.now()}`;
      adaptiveSessions.set(sid, { state, questionMap, createdAt: Date.now() });

      // Get first item
      const nextItem = getNextItem(state);
      if (!nextItem) {
        return NextResponse.json({ error: 'No items available' }, { status: 500 });
      }

      const itemData = questionMap.get(nextItem.id);
      if (!itemData) {
        return NextResponse.json({ error: 'Item data not found' }, { status: 500 });
      }

      return NextResponse.json({
        sessionId: sid,
        currentItem: {
          id: nextItem.id,
          passage: {
            title: itemData.passage.title,
            text: itemData.passage.text,
            difficulty: itemData.passage.difficulty,
            topic: itemData.passage.topic,
            wordCount: itemData.passage.wordCount,
          },
          question: {
            id: itemData.question.id,
            type: itemData.question.type,
            questionText: itemData.question.questionText,
            options: itemData.question.options,
            correctAnswer: itemData.question.correctAnswer,
          },
        },
        progress: {
          questionsAnswered: 0,
          maxQuestions: 15,
          currentAbility: 0,
          standardError: 1.0,
          confidence: 0,
        },
        isComplete: false,
      });
    }

    // ─── ANSWER: Process response and get next item ─────────

    if (action === 'answer') {
      if (!sessionId || !response) {
        return NextResponse.json({ error: 'sessionId and response required' }, { status: 400 });
      }

      const session = adaptiveSessions.get(sessionId);
      if (!session) {
        return NextResponse.json({ error: 'Session expired or not found' }, { status: 404 });
      }

      // Process the response
      const irtResponse: IRTResponse = {
        itemId: response.itemId,
        correct: response.correct,
      };

      const newState = processResponse(session.state, irtResponse);
      session.state = newState;

      // If test is complete, return final results
      if (newState.isComplete) {
        const score = thetaToScore(newState.estimate.theta);
        const level = thetaToLevel(newState.estimate.theta);
        const totalCorrect = newState.responses.filter(r => r.correct).length;

        // Clean up session
        adaptiveSessions.delete(sessionId);

        return NextResponse.json({
          isComplete: true,
          results: {
            score, // 0-30
            level,
            theta: Math.round(newState.estimate.theta * 100) / 100,
            standardError: Math.round(newState.estimate.standardError * 100) / 100,
            confidence: Math.round(newState.estimate.confidence * 100) / 100,
            questionsAnswered: newState.responses.length,
            totalCorrect,
            accuracy: Math.round((totalCorrect / newState.responses.length) * 100),
            history: newState.estimate.history,
          },
        });
      }

      // Get next item
      const nextItem = getNextItem(newState);
      if (!nextItem) {
        // No more items — force complete
        const score = thetaToScore(newState.estimate.theta);
        const level = thetaToLevel(newState.estimate.theta);
        const totalCorrect = newState.responses.filter(r => r.correct).length;
        adaptiveSessions.delete(sessionId);

        return NextResponse.json({
          isComplete: true,
          results: {
            score,
            level,
            theta: Math.round(newState.estimate.theta * 100) / 100,
            standardError: Math.round(newState.estimate.standardError * 100) / 100,
            confidence: Math.round(newState.estimate.confidence * 100) / 100,
            questionsAnswered: newState.responses.length,
            totalCorrect,
            accuracy: Math.round((totalCorrect / newState.responses.length) * 100),
            history: newState.estimate.history,
          },
        });
      }

      const itemData = session.questionMap.get(nextItem.id);
      if (!itemData) {
        return NextResponse.json({ error: 'Next item data not found' }, { status: 500 });
      }

      return NextResponse.json({
        sessionId,
        currentItem: {
          id: nextItem.id,
          passage: {
            title: itemData.passage.title,
            text: itemData.passage.text,
            difficulty: itemData.passage.difficulty,
            topic: itemData.passage.topic,
            wordCount: itemData.passage.wordCount,
          },
          question: {
            id: itemData.question.id,
            type: itemData.question.type,
            questionText: itemData.question.questionText,
            options: itemData.question.options,
            correctAnswer: itemData.question.correctAnswer,
          },
        },
        progress: {
          questionsAnswered: newState.responses.length,
          maxQuestions: 15,
          currentAbility: Math.round(newState.estimate.theta * 100) / 100,
          standardError: Math.round(newState.estimate.standardError * 100) / 100,
          confidence: Math.round(newState.estimate.confidence * 100) / 100,
        },
        isComplete: false,
      });
    }

    // ─── STATUS: Get current test status ────────────────────

    if (action === 'status') {
      if (!sessionId) {
        return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
      }

      const session = adaptiveSessions.get(sessionId);
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      return NextResponse.json({
        progress: {
          questionsAnswered: session.state.responses.length,
          maxQuestions: 15,
          currentAbility: Math.round(session.state.estimate.theta * 100) / 100,
          standardError: Math.round(session.state.estimate.standardError * 100) / 100,
          confidence: Math.round(session.state.estimate.confidence * 100) / 100,
        },
        isComplete: session.state.isComplete,
      });
    }

    return NextResponse.json({ error: 'Invalid action. Use: start, answer, status' }, { status: 400 });
  } catch (error) {
    console.error('[adaptive-reading] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const POST = withApiProtection({ rateLimit: 'assessment' })(handler);
