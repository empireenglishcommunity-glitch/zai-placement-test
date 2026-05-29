import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface AnswerInput {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
}

interface UpdateData {
  currentModule: string;
  voBand1?: number;
  voBand2?: number;
  voBand3?: number;
  voBand4?: number;
  voBand5?: number;
  voEstimatedSize?: number;
  voOverall?: number;
  voLevel?: number;
  grPercentage?: number;
  grLevel?: number;
  spPronunciation?: number;
  spFluency?: number;
  spWordsPerMinute?: number;
  spPhonemeAcc?: number;
  spGrammarAcc?: number;
  spVocabRange?: number;
  spConfidence?: number;
  spRhythmMatch?: number;
  spOverall?: number;
  spLevel?: number;
  liLiteral?: number;
  liInference?: number;
  liDetail?: number;
  liOverall?: number;
  liLevel?: number;
  status?: string;
  completedAt?: Date;
}

export async function POST(req: NextRequest) {
  try {
    const { assessmentId, module, answers, scores } = await req.json();

    if (!assessmentId || !module) {
      return NextResponse.json({ error: 'Assessment ID and module required' }, { status: 400 });
    }

    // Save individual answers
    if (answers && answers.length > 0) {
      await db.answer.createMany({
        data: (answers as AnswerInput[]).map((a) => ({
          assessmentId,
          module,
          questionId: a.questionId,
          selectedAnswer: a.selectedAnswer,
          isCorrect: a.isCorrect,
          timeTaken: a.timeTaken,
        })),
      });
    }

    // Update assessment scores based on module
    const updateData: UpdateData = { currentModule: module };

    if (module === 'vocabulary' && scores) {
      updateData.voBand1 = scores.band1;
      updateData.voBand2 = scores.band2;
      updateData.voBand3 = scores.band3;
      updateData.voBand4 = scores.band4;
      updateData.voBand5 = scores.band5;
      updateData.voEstimatedSize = scores.estimatedSize;
      updateData.voOverall = scores.overall;
      updateData.voLevel = scores.level;
    }

    if (module === 'grammar' && scores) {
      updateData.grPercentage = scores.percentage;
      updateData.grLevel = scores.level;
    }

    if (module === 'speaking' && scores) {
      updateData.spPronunciation = scores.pronunciation;
      updateData.spFluency = scores.fluency;
      updateData.spWordsPerMinute = scores.wordsPerMinute;
      updateData.spPhonemeAcc = scores.phonemeAccuracy;
      updateData.spGrammarAcc = scores.grammarAccuracy;
      updateData.spVocabRange = scores.vocabularyRange;
      updateData.spConfidence = scores.confidence;
      updateData.spRhythmMatch = scores.rhythmMatch;
      updateData.spOverall = scores.overall;
      updateData.spLevel = scores.level;
    }

    if (module === 'listening' && scores) {
      updateData.liLiteral = scores.literalComprehension;
      updateData.liInference = scores.inference;
      updateData.liDetail = scores.detailRecognition;
      updateData.liOverall = scores.overall;
      updateData.liLevel = scores.level;
    }

    // Check if all modules completed
    const assessment = await db.assessment.findUnique({ where: { id: assessmentId } });
    if (assessment) {
      const allCompleted = assessment.voLevel !== null && assessment.grLevel !== null;
      if (allCompleted) {
        updateData.status = 'completed';
        updateData.completedAt = new Date();
      }
    }

    await db.assessment.update({
      where: { id: assessmentId },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
