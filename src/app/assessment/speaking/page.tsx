'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Mic, MicOff, Play, Square, RotateCcw, ChevronRight, Volume2, VolumeX,
  Clock, Award, ArrowLeft, CheckCircle2, AlertCircle, Loader2,
} from 'lucide-react';
import {
  ParticleBackground, Navbar, Footer, ImperialButton, MetallicCard,
  GlowingBorder, ProgressBar, SectionDivider, ImperialRankBadge,
} from '@/components/empire';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useRetakeCooldown } from '@/hooks/useRetakeCooldown';
import { useUserId } from '@/hooks/useUserId';
import { IMPERIAL_RANKS } from '@/lib/types';
import type { ImperialLevel } from '@/lib/types';
import { SPEAKING_LEVELS, SPEAKING_CONFIG, MODULE_INFO } from '@/lib/constants';

// ─── Sample Data ───────────────────────────────────────────

const readAloudPassages = [
  "The empire's legacy stretches across centuries, built upon the foundations of discipline and knowledge. Every citizen who walks these halls carries the weight of tradition and the spark of innovation.",
  'In the depths of the ancient library, scholars discovered texts that would reshape their understanding of the world. The words, though centuries old, spoke truths that resonated with the present.',
  'The warrior stood at the crossroads, weighing the path of conquest against the road of wisdom. In the empire, strength was measured not just in battles won, but in knowledge earned.',
];

const speakingPrompts = [
  'Describe your daily routine and explain which part of your day you enjoy the most.',
  'Talk about a goal you have set for yourself and what you are doing to achieve it.',
  'Describe your favorite place and explain why it is special to you.',
];

const shadowingTexts = [
  'The ancient gates opened slowly, revealing a path illuminated by golden light.',
  'Knowledge is the sharpest blade in the warrior\'s arsenal.',
  'Through discipline and perseverance, the recruit becomes the champion.',
];


// ─── Types ─────────────────────────────────────────────────

type Phase = 'intro' | 'read_aloud' | 'spontaneous' | 'shadowing' | 'evaluating' | 'results';

interface PartResult {
  part: 'read_aloud' | 'spontaneous' | 'shadowing';
  index: number;
  transcript: string;
  expectedText: string;
  duration: number;
  wordCount: number;
  evaluation: EvaluationResult | null;
}

interface EvaluationResult {
  overallScore: number;
  pronunciation: number;
  fluency: number;
  grammar: number;
  vocabulary: number;
  coherence: number;
  similarity?: number; // For read-aloud and shadowing
  feedback: string;
}

// ─── Text Similarity (for read-aloud & shadowing) ──────────

function calculateTextSimilarity(expected: string, actual: string): number {
  if (!actual || actual.trim().length === 0) return 0;
  if (!expected) return 0;

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);
  const expectedWords = normalize(expected);
  const actualWords = normalize(actual);

  if (actualWords.length === 0) return 0;

  // Count matching words (order-independent for flexibility)
  let matches = 0;
  const usedIndices = new Set<number>();

  for (const word of actualWords) {
    const idx = expectedWords.findIndex((w, i) => w === word && !usedIndices.has(i));
    if (idx !== -1) {
      matches++;
      usedIndices.add(idx);
    }
  }

  // Coverage: how much of the expected text was spoken
  const coverage = matches / expectedWords.length;
  // Precision: how much of what was said matches
  const precision = matches / actualWords.length;

  // F1-like score
  if (coverage + precision === 0) return 0;
  const f1 = (2 * coverage * precision) / (coverage + precision);

  return Math.round(f1 * 100);
}


// ─── Local Scoring (no API needed) ─────────────────────────
// Evaluates transcript locally for immediate feedback

function evaluateLocally(
  part: 'read_aloud' | 'spontaneous' | 'shadowing',
  transcript: string,
  expectedText: string,
  duration: number,
): EvaluationResult {
  // If nothing was said, score is 0
  if (!transcript || transcript.trim().length === 0) {
    return {
      overallScore: 0, pronunciation: 0, fluency: 0, grammar: 0,
      vocabulary: 0, coherence: 0, similarity: 0,
      feedback: 'No speech detected. Please speak clearly into your microphone.',
    };
  }

  const words = transcript.trim().split(/\s+/);
  const wordCount = words.length;

  // Too few words = barely spoke
  if (wordCount < 3) {
    return {
      overallScore: 5, pronunciation: 5, fluency: 5, grammar: 5,
      vocabulary: 5, coherence: 5, similarity: part !== 'spontaneous' ? calculateTextSimilarity(expectedText, transcript) : undefined,
      feedback: 'Very little speech detected. Please speak in complete sentences.',
    };
  }

  if (part === 'read_aloud' || part === 'shadowing') {
    const similarity = calculateTextSimilarity(expectedText, transcript);
    // WPM calculation
    const wpm = duration > 0 ? Math.round((wordCount / duration) * 60) : 0;
    // Fluency based on WPM (ideal: 120-160 for reading)
    const fluencyScore = wpm >= 80 && wpm <= 180 ? Math.min(100, 50 + (wpm - 80)) : Math.max(10, 50 - Math.abs(wpm - 130));

    const overallScore = Math.round(similarity * 0.6 + fluencyScore * 0.2 + Math.min(wordCount / expectedText.split(/\s+/).length, 1) * 100 * 0.2);

    return {
      overallScore: Math.min(100, overallScore),
      pronunciation: similarity, // Best proxy without AI
      fluency: Math.round(fluencyScore),
      grammar: similarity, // If they read correctly, grammar is correct
      vocabulary: similarity,
      coherence: similarity,
      similarity,
      feedback: similarity >= 80
        ? 'Excellent reading! You covered most of the text accurately.'
        : similarity >= 50
          ? 'Good effort. Some words were missed or changed. Practice reading the full text.'
          : similarity >= 20
            ? 'Partial coverage. Try to read the complete passage clearly.'
            : 'Very low similarity to the expected text. Please read the passage shown on screen.',
    };
  }

  // Spontaneous: evaluate based on quantity and apparent quality
  const wpm = duration > 0 ? Math.round((wordCount / duration) * 60) : 0;
  const fluencyScore = wpm >= 60 && wpm <= 180 ? Math.min(90, 40 + wpm / 3) : Math.max(10, 30);
  // Vocabulary diversity
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const diversityRatio = uniqueWords.size / wordCount;
  const vocabScore = Math.round(Math.min(100, diversityRatio * 150 + wordCount * 0.5));
  // Sentence length (longer = more coherent usually)
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / wordCount;
  const coherenceScore = Math.round(Math.min(100, avgWordLength * 10 + wordCount * 0.8));

  const overallScore = Math.round(fluencyScore * 0.3 + vocabScore * 0.3 + coherenceScore * 0.2 + Math.min(wordCount * 2, 100) * 0.2);

  return {
    overallScore: Math.min(100, overallScore),
    pronunciation: Math.round(fluencyScore * 0.8), // Can't truly measure without AI
    fluency: Math.round(fluencyScore),
    grammar: Math.round(coherenceScore * 0.7), // Rough proxy
    vocabulary: vocabScore,
    coherence: coherenceScore,
    feedback: wordCount >= 50
      ? `Good response with ${wordCount} words at ${wpm} WPM. ${diversityRatio > 0.6 ? 'Good vocabulary diversity.' : 'Try using more varied vocabulary.'}`
      : wordCount >= 20
        ? `Reasonable response (${wordCount} words). Try to elaborate more for a higher score.`
        : `Brief response (${wordCount} words). Aim to speak for the full time with detailed answers.`,
  };
}


// ─── Calculate Final Speaking Score ────────────────────────

function calculateFinalScore(results: PartResult[]): { overallScore: number; level: ImperialLevel; details: Record<string, number> } {
  const readAloud = results.filter(r => r.part === 'read_aloud');
  const spontaneous = results.filter(r => r.part === 'spontaneous');
  const shadowing = results.filter(r => r.part === 'shadowing');

  const avg = (arr: PartResult[]) => {
    if (arr.length === 0) return 0;
    const scores = arr.map(r => r.evaluation?.overallScore ?? 0);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const readAloudScore = avg(readAloud);
  const spontaneousScore = avg(spontaneous);
  const shadowingScore = avg(shadowing);

  // Weighted: Read Aloud 35%, Spontaneous 40%, Shadowing 25%
  const overallScore = Math.round(readAloudScore * 0.35 + spontaneousScore * 0.4 + shadowingScore * 0.25);

  let level: ImperialLevel = 0;
  for (const threshold of SPEAKING_LEVELS) {
    if (overallScore >= threshold.min && overallScore <= threshold.max) {
      level = threshold.level;
      break;
    }
  }

  return { overallScore, level, details: { readAloudScore, spontaneousScore, shadowingScore } };
}

// ─── Main Component ────────────────────────────────────────

export default function SpeakingAssessmentPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [results, setResults] = useState<PartResult[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [countdown, setCountdown] = useState(SPEAKING_CONFIG.spontaneousDuration);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const [hasListenedShadow, setHasListenedShadow] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speech = useSpeechRecognition({ maxDuration: 90 });
  const cooldown = useRetakeCooldown('speaking');
  const { userId: currentUserId, isGuest: isSpeakingGuest } = useUserId();
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Countdown Timer ───────────────────────────────────
  useEffect(() => {
    if (isCountdownRunning && countdown > 0) {
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsCountdownRunning(false);
            speech.stop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [isCountdownRunning, countdown, speech]);


  // ─── TTS for Shadowing ─────────────────────────────────
  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => { setIsSpeaking(false); setHasListenedShadow(true); };
    window.speechSynthesis.speak(utterance);
  }, []);

  // ─── Submit current part and move to next ──────────────
  const handleSubmitPart = useCallback(async () => {
    const currentTranscript = speech.transcript.trim();
    let expectedText = '';
    let part: 'read_aloud' | 'spontaneous' | 'shadowing' = 'read_aloud';

    if (phase === 'read_aloud') {
      part = 'read_aloud';
      expectedText = readAloudPassages[currentPartIndex];
    } else if (phase === 'spontaneous') {
      part = 'spontaneous';
      expectedText = speakingPrompts[currentPartIndex];
    } else if (phase === 'shadowing') {
      part = 'shadowing';
      expectedText = shadowingTexts[currentPartIndex];
    }

    speech.stop();
    setIsEvaluating(true);

    // Evaluate locally first (instant, reliable)
    const localEval = evaluateLocally(part, currentTranscript, expectedText, speech.duration);

    // Try AI evaluation if transcript is substantial
    let finalEval: EvaluationResult = localEval;
    if (currentTranscript.length > 10) {
      try {
        const res = await fetch('/api/ai/evaluate-speaking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: currentTranscript, expectedText, part }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.evaluation && typeof data.evaluation.overallScore === 'number') {
            finalEval = data.evaluation;
          }
        }
      } catch {
        // Use local evaluation
      }
    }

    const result: PartResult = {
      part,
      index: currentPartIndex,
      transcript: currentTranscript,
      expectedText,
      duration: speech.duration,
      wordCount: speech.wordCount,
      evaluation: finalEval,
    };

    setResults(prev => [...prev, result]);
    setIsEvaluating(false);
    speech.reset();

    // Move to next
    if (phase === 'read_aloud') {
      if (currentPartIndex < readAloudPassages.length - 1) {
        setCurrentPartIndex(prev => prev + 1);
      } else {
        setPhase('spontaneous');
        setCurrentPartIndex(0);
        setCountdown(SPEAKING_CONFIG.spontaneousDuration);
      }
    } else if (phase === 'spontaneous') {
      if (currentPartIndex < speakingPrompts.length - 1) {
        setCurrentPartIndex(prev => prev + 1);
        setCountdown(SPEAKING_CONFIG.spontaneousDuration);
        setIsCountdownRunning(false);
      } else {
        setPhase('shadowing');
        setCurrentPartIndex(0);
        setHasListenedShadow(false);
      }
    } else if (phase === 'shadowing') {
      if (currentPartIndex < shadowingTexts.length - 1) {
        setCurrentPartIndex(prev => prev + 1);
        setHasListenedShadow(false);
      } else {
        setPhase('results');
        cooldown.markCompleted();
      }
    }
  }, [phase, currentPartIndex, speech]);

  // ─── Start spontaneous with countdown ──────────────────
  const startSpontaneous = () => {
    speech.start();
    setCountdown(SPEAKING_CONFIG.spontaneousDuration);
    setIsCountdownRunning(true);
  };

  // ─── Score ─────────────────────────────────────────────
  const scoreResult = calculateFinalScore(results);

  // ─── Submit scores to API on results ───────────────────
  useEffect(() => {
    if (phase !== 'results') return;
    const submit = async () => {
      try {
        const currentUserId2 = typeof window !== 'undefined'
          ? (currentUserId || '')
          : '';
        await fetch('/api/assessment/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            assessmentId: `speaking-${Date.now()}`,
            module: 'speaking',
            userId: currentUserId2,
            answers: results.map(r => ({
              questionId: `${r.part}_${r.index}`,
              selectedAnswer: 0,
              isCorrect: (r.evaluation?.overallScore ?? 0) >= 50,
              timeTaken: r.duration * 1000,
            })),
            scores: {
              pronunciation: scoreResult.details.readAloudScore,
              fluency: scoreResult.details.spontaneousScore,
              rhythmMatch: scoreResult.details.shadowingScore,
              overall: scoreResult.overallScore,
              level: scoreResult.level,
            },
          }),
        });
      } catch { /* silent */ }
    };
    submit();
  }, [phase]);

  // ─── Progress ──────────────────────────────────────────
  const totalParts = readAloudPassages.length + speakingPrompts.length + shadowingTexts.length;
  const completedParts = results.length;
  const progressPercent = Math.round((completedParts / totalParts) * 100);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;


  // ─── RENDER ────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] protected-content">
      <ParticleBackground />
      <Navbar />
      <main className="flex-1 relative z-10 pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
            <a href="/assessment" className="inline-flex items-center gap-2 text-[#8b7355] hover:text-[#c9a84c] transition-colors font-[family-name:var(--font-heading)] text-sm">
              <ArrowLeft className="w-4 h-4" /> Return to Trials
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[#c9a84c] mb-2">
              🎤 {MODULE_INFO.speaking.empireTitle}
            </h1>
            <p className="text-[#8b7355] font-[family-name:var(--font-heading)]">{MODULE_INFO.speaking.description}</p>
          </motion.div>

          {phase !== 'intro' && phase !== 'results' && (
            <div className="mb-8">
              <ProgressBar value={progressPercent} max={100} label="Trial Progress" />
            </div>
          )}

          {/* Browser support warning */}
          {!speech.isSupported && (
            <div className="mb-6 p-4 rounded-lg border border-[#e74c3c] bg-[rgba(231,76,60,0.1)]">
              <div className="flex items-center gap-2 text-[#e74c3c]">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm font-[family-name:var(--font-heading)]">
                  Your browser does not support speech recognition. Please open this page in <strong>Google Chrome</strong>, Microsoft Edge, or Safari to take the Speaking Trial.
                </p>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">


            {/* ═══ INTRO ═══ */}
            {phase === 'intro' && (
              <motion.div key="intro" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-6">
                <GlowingBorder intensity="high">
                  <MetallicCard hover={false} className="p-8">
                    <div className="text-center space-y-6">
                      <div className="text-5xl mb-4">⚔️</div>
                      <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#c9a84c]">The Oratory Trial</h2>
                      <p className="text-[#c0c0c0] leading-relaxed max-w-2xl mx-auto">
                        This trial uses <strong>real speech recognition</strong> to transcribe what you say. Your actual words are evaluated — not a guess. Speak clearly into your microphone.
                      </p>
                      <SectionDivider />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <MetallicCard hover={false} className="p-4">
                          <div className="text-3xl mb-2">📜</div>
                          <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] font-semibold mb-1">Part A: Read Aloud</h3>
                          <p className="text-[#8b7355] text-sm">Read {readAloudPassages.length} passages. Your words are compared to the text.</p>
                        </MetallicCard>
                        <MetallicCard hover={false} className="p-4">
                          <div className="text-3xl mb-2">🗣️</div>
                          <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] font-semibold mb-1">Part B: Spontaneous</h3>
                          <p className="text-[#8b7355] text-sm">Speak freely for {SPEAKING_CONFIG.spontaneousDuration}s. Grammar & vocabulary evaluated.</p>
                        </MetallicCard>
                        <MetallicCard hover={false} className="p-4">
                          <div className="text-3xl mb-2">🔄</div>
                          <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] font-semibold mb-1">Part C: Shadowing</h3>
                          <p className="text-[#8b7355] text-sm">Listen then repeat. Your version compared to original.</p>
                        </MetallicCard>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-[#8b7355] text-xs sm:text-sm mt-4 px-4 text-center">
                        <Mic className="w-4 h-4 shrink-0" /><span>Microphone required • Chrome, Edge, or Safari • Allow mic when prompted</span>
                      </div>
                      {cooldown.isOnCooldown ? (
                        <div className="text-center mt-4">
                          <p className="text-[#cd7f32] text-sm font-[family-name:var(--font-heading)]">Retake available in {cooldown.remainingFormatted}</p>
                          <p className="text-[#8b7355] text-xs mt-1">Please wait before retaking this trial.</p>
                        </div>
                      ) : (
                        <ImperialButton variant="primary" size="lg" onClick={() => setPhase('read_aloud')}>
                        Begin the Trial <ChevronRight className="w-5 h-5 ml-2 inline" />
                      </ImperialButton>
                      )}
                    </div>
                  </MetallicCard>
                </GlowingBorder>
              </motion.div>
            )}


            {/* ═══ READ ALOUD ═══ */}
            {phase === 'read_aloud' && (
              <motion.div key={`read_${currentPartIndex}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-6">
                <div className="text-center mb-4">
                  <span className="font-[family-name:var(--font-heading)] text-[#8b7355] text-sm">Part A — Read Aloud</span>
                  <h2 className="font-[family-name:var(--font-heading)] text-xl text-[#c9a84c] font-bold">
                    Passage {currentPartIndex + 1} of {readAloudPassages.length}
                  </h2>
                </div>
                <GlowingBorder>
                  <MetallicCard hover={false} className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl mt-1">📜</div>
                        <p className="text-[#c0c0c0] text-lg leading-relaxed italic">
                          &ldquo;{readAloudPassages[currentPartIndex]}&rdquo;
                        </p>
                      </div>

                      {/* Live Transcript */}
                      {(speech.transcript || speech.interimTranscript) && (
                        <div className="bg-[rgba(201,168,76,0.05)] rounded-lg p-4 border border-[rgba(201,168,76,0.2)]">
                          <p className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)] mb-2">YOUR WORDS (live):</p>
                          <p className="text-[#c0c0c0] text-sm">
                            {speech.transcript}
                            <span className="text-[#8b7355] italic">{speech.interimTranscript}</span>
                          </p>
                          <p className="text-[#8b7355] text-xs mt-2">{speech.wordCount} words • {speech.duration}s</p>
                        </div>
                      )}

                      {/* Controls */}
                      <div className="flex flex-col items-center gap-4 pt-4">
                        {!speech.isListening && !speech.transcript ? (
                          <ImperialButton variant="primary" size="lg" onClick={speech.start} disabled={!speech.isSupported}>
                            <Mic className="w-5 h-5 mr-2" /> Start Reading
                          </ImperialButton>
                        ) : speech.isListening ? (
                          <div className="flex flex-col items-center gap-3">
                            <motion.div className="flex items-center gap-2 text-[#4ade80]" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                              <div className="w-3 h-3 rounded-full bg-[#4ade80]" />
                              <span className="text-sm font-[family-name:var(--font-heading)]">Listening... speak now</span>
                            </motion.div>
                            <ImperialButton variant="secondary" size="sm" onClick={speech.stop}>
                              <Square className="w-4 h-4 mr-2" /> Done Reading
                            </ImperialButton>
                          </div>
                        ) : (
                          <div className="flex gap-3">
                            <ImperialButton variant="outline" size="sm" onClick={speech.reset}>
                              <RotateCcw className="w-4 h-4 mr-1" /> Retry
                            </ImperialButton>
                            <ImperialButton variant="primary" size="sm" onClick={handleSubmitPart} disabled={isEvaluating}>
                              {isEvaluating ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Evaluating...</>
                                : <>{currentPartIndex < readAloudPassages.length - 1 ? 'Next Passage' : 'Continue to Part B'} <ChevronRight className="w-4 h-4 ml-1" /></>}
                            </ImperialButton>
                          </div>
                        )}
                        {speech.error && <div className="flex items-center gap-2 text-[#e74c3c] text-sm"><AlertCircle className="w-4 h-4" />{speech.error}</div>}
                      </div>
                    </div>
                  </MetallicCard>
                </GlowingBorder>
              </motion.div>
            )}


            {/* ═══ SPONTANEOUS ═══ */}
            {phase === 'spontaneous' && (
              <motion.div key={`spont_${currentPartIndex}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-6">
                <div className="text-center mb-4">
                  <span className="font-[family-name:var(--font-heading)] text-[#8b7355] text-sm">Part B — Spontaneous Speaking</span>
                  <h2 className="font-[family-name:var(--font-heading)] text-xl text-[#c9a84c] font-bold">
                    Prompt {currentPartIndex + 1} of {speakingPrompts.length}
                  </h2>
                </div>
                <GlowingBorder intensity="high" color="bronze">
                  <MetallicCard hover={false} className="p-6">
                    <div className="space-y-6">
                      <div className="text-center">
                        <p className="text-[#c0c0c0] text-lg leading-relaxed">{speakingPrompts[currentPartIndex]}</p>
                      </div>

                      {/* Timer */}
                      <div className="flex justify-center">
                        <div className="relative w-24 h-24 rounded-full border-2 flex items-center justify-center" style={{ borderColor: countdown <= 10 ? '#e74c3c' : countdown <= 30 ? '#cd7f32' : 'rgba(201,168,76,0.3)' }}>
                          <span className="font-[family-name:var(--font-heading)] text-2xl font-bold" style={{ color: countdown <= 10 ? '#e74c3c' : '#c9a84c' }}>
                            {formatTime(countdown)}
                          </span>
                        </div>
                      </div>

                      {/* Live Transcript */}
                      {(speech.transcript || speech.interimTranscript) && (
                        <div className="bg-[rgba(201,168,76,0.05)] rounded-lg p-4 border border-[rgba(201,168,76,0.2)]">
                          <p className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)] mb-2">YOUR WORDS (live):</p>
                          <p className="text-[#c0c0c0] text-sm">
                            {speech.transcript}
                            <span className="text-[#8b7355] italic">{speech.interimTranscript}</span>
                          </p>
                          <p className="text-[#8b7355] text-xs mt-2">{speech.wordCount} words • {speech.duration}s</p>
                        </div>
                      )}

                      {/* Controls */}
                      <div className="flex flex-col items-center gap-4">
                        {!speech.isListening && !speech.transcript ? (
                          <ImperialButton variant="primary" size="lg" onClick={startSpontaneous} disabled={!speech.isSupported}>
                            <Mic className="w-5 h-5 mr-2" /> Start Speaking
                          </ImperialButton>
                        ) : speech.isListening ? (
                          <div className="flex flex-col items-center gap-3">
                            <motion.div className="flex items-center gap-2 text-[#4ade80]" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                              <div className="w-3 h-3 rounded-full bg-[#4ade80]" />
                              <span className="text-sm font-[family-name:var(--font-heading)]">Listening... speak freely</span>
                            </motion.div>
                            <ImperialButton variant="secondary" size="sm" onClick={() => { speech.stop(); setIsCountdownRunning(false); }}>
                              <Square className="w-4 h-4 mr-2" /> Done
                            </ImperialButton>
                          </div>
                        ) : (
                          <div className="flex gap-3">
                            <ImperialButton variant="outline" size="sm" onClick={() => { speech.reset(); setCountdown(SPEAKING_CONFIG.spontaneousDuration); }}>
                              <RotateCcw className="w-4 h-4 mr-1" /> Retry
                            </ImperialButton>
                            <ImperialButton variant="primary" size="sm" onClick={handleSubmitPart} disabled={isEvaluating}>
                              {isEvaluating ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Evaluating...</>
                                : <>{currentPartIndex < speakingPrompts.length - 1 ? 'Next Prompt' : 'Continue to Part C'} <ChevronRight className="w-4 h-4 ml-1" /></>}
                            </ImperialButton>
                          </div>
                        )}
                        {speech.error && <div className="flex items-center gap-2 text-[#e74c3c] text-sm"><AlertCircle className="w-4 h-4" />{speech.error}</div>}
                      </div>
                    </div>
                  </MetallicCard>
                </GlowingBorder>
              </motion.div>
            )}


            {/* ═══ SHADOWING ═══ */}
            {phase === 'shadowing' && (
              <motion.div key={`shadow_${currentPartIndex}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-6">
                <div className="text-center mb-4">
                  <span className="font-[family-name:var(--font-heading)] text-[#8b7355] text-sm">Part C — Shadowing</span>
                  <h2 className="font-[family-name:var(--font-heading)] text-xl text-[#c9a84c] font-bold">
                    Phrase {currentPartIndex + 1} of {shadowingTexts.length}
                  </h2>
                </div>
                <GlowingBorder intensity="high" color="fire">
                  <MetallicCard hover={false} className="p-6">
                    <div className="space-y-6">
                      <div className="text-center space-y-4">
                        <p className="text-[#8b7355] text-sm font-[family-name:var(--font-heading)]">Listen to the phrase, then repeat it</p>
                        <ImperialButton variant="secondary" size="lg" onClick={() => speakText(shadowingTexts[currentPartIndex])} disabled={isSpeaking}>
                          {isSpeaking ? <><VolumeX className="w-5 h-5 mr-2" /> Playing...</> : <><Volume2 className="w-5 h-5 mr-2" /> Listen</>}
                        </ImperialButton>
                        {hasListenedShadow && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#c0c0c0] italic">
                            &ldquo;{shadowingTexts[currentPartIndex]}&rdquo;
                          </motion.p>
                        )}
                      </div>

                      {hasListenedShadow && (
                        <>
                          {/* Live Transcript */}
                          {(speech.transcript || speech.interimTranscript) && (
                            <div className="bg-[rgba(201,168,76,0.05)] rounded-lg p-4 border border-[rgba(201,168,76,0.2)]">
                              <p className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)] mb-2">YOUR WORDS:</p>
                              <p className="text-[#c0c0c0] text-sm">
                                {speech.transcript}<span className="text-[#8b7355] italic">{speech.interimTranscript}</span>
                              </p>
                            </div>
                          )}

                          <div className="flex flex-col items-center gap-4 pt-4">
                            {!speech.isListening && !speech.transcript ? (
                              <ImperialButton variant="primary" size="lg" onClick={speech.start} disabled={!speech.isSupported}>
                                <Mic className="w-5 h-5 mr-2" /> Repeat the Phrase
                              </ImperialButton>
                            ) : speech.isListening ? (
                              <div className="flex flex-col items-center gap-3">
                                <motion.div className="flex items-center gap-2 text-[#4ade80]" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                  <div className="w-3 h-3 rounded-full bg-[#4ade80]" /><span className="text-sm font-[family-name:var(--font-heading)]">Listening...</span>
                                </motion.div>
                                <ImperialButton variant="secondary" size="sm" onClick={speech.stop}><Square className="w-4 h-4 mr-2" /> Done</ImperialButton>
                              </div>
                            ) : (
                              <div className="flex gap-3">
                                <ImperialButton variant="outline" size="sm" onClick={speech.reset}><RotateCcw className="w-4 h-4 mr-1" /> Retry</ImperialButton>
                                <ImperialButton variant="primary" size="sm" onClick={handleSubmitPart} disabled={isEvaluating}>
                                  {isEvaluating ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Evaluating...</>
                                    : <>{currentPartIndex < shadowingTexts.length - 1 ? 'Next Phrase' : 'View Results'} <ChevronRight className="w-4 h-4 ml-1" /></>}
                                </ImperialButton>
                              </div>
                            )}
                            {speech.error && <div className="flex items-center gap-2 text-[#e74c3c] text-sm"><AlertCircle className="w-4 h-4" />{speech.error}</div>}
                          </div>
                        </>
                      )}
                    </div>
                  </MetallicCard>
                </GlowingBorder>
              </motion.div>
            )}


            {/* ═══ RESULTS ═══ */}
            {phase === 'results' && (
              <motion.div key="results" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-6">
                <GlowingBorder intensity="high">
                  <MetallicCard hover={false} className="p-8">
                    <div className="text-center space-y-6">
                      <div className="text-4xl">⚔️</div>
                      <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#c9a84c]">Trial of Voice — Complete</h2>

                      <div className="flex flex-col items-center gap-3">
                        <ImperialRankBadge level={scoreResult.level} size="lg" />
                        <div className="text-5xl font-[family-name:var(--font-heading)] font-bold text-[#c9a84c]">{scoreResult.overallScore}</div>
                        <p className="text-[#8b7355] font-[family-name:var(--font-heading)]">Overall Speaking Score</p>
                      </div>

                      <SectionDivider />

                      {/* Score Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <MetallicCard hover={false} className="p-4">
                          <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm mb-2">Part A: Read Aloud</h3>
                          <div className="text-3xl font-bold text-[#c0c0c0] mb-1">{scoreResult.details.readAloudScore}</div>
                          <ProgressBar value={scoreResult.details.readAloudScore} max={100} showPercentage={false} size="sm" />
                          <p className="text-[#8b7355] text-xs mt-2">35% weight • Text similarity</p>
                        </MetallicCard>
                        <MetallicCard hover={false} className="p-4">
                          <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm mb-2">Part B: Spontaneous</h3>
                          <div className="text-3xl font-bold text-[#c0c0c0] mb-1">{scoreResult.details.spontaneousScore}</div>
                          <ProgressBar value={scoreResult.details.spontaneousScore} max={100} showPercentage={false} size="sm" />
                          <p className="text-[#8b7355] text-xs mt-2">40% weight • Fluency & vocabulary</p>
                        </MetallicCard>
                        <MetallicCard hover={false} className="p-4">
                          <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm mb-2">Part C: Shadowing</h3>
                          <div className="text-3xl font-bold text-[#c0c0c0] mb-1">{scoreResult.details.shadowingScore}</div>
                          <ProgressBar value={scoreResult.details.shadowingScore} max={100} showPercentage={false} size="sm" />
                          <p className="text-[#8b7355] text-xs mt-2">25% weight • Repetition accuracy</p>
                        </MetallicCard>
                      </div>

                      <SectionDivider />

                      {/* Per-part feedback */}
                      <div className="space-y-3 text-left">
                        {results.map((r, i) => (
                          <div key={i} className="text-sm border-b border-[rgba(201,168,76,0.1)] pb-2">
                            <span className="text-[#c9a84c] font-[family-name:var(--font-heading)] capitalize">{r.part.replace('_', ' ')} {r.index + 1}:</span>{' '}
                            <span className="text-[#c0c0c0]">{r.evaluation?.feedback}</span>
                            {r.transcript && (
                              <p className="text-[#8b7355] text-xs mt-1 italic">You said: &ldquo;{r.transcript.slice(0, 100)}{r.transcript.length > 100 ? '...' : ''}&rdquo;</p>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Level Info */}
                      <div className="bg-[rgba(201,168,76,0.05)] rounded-lg p-4 border border-[rgba(201,168,76,0.15)]">
                        <p className="text-[#c0c0c0] text-sm">
                          You have been assessed as{' '}
                          <span className="text-[#c9a84c] font-[family-name:var(--font-heading)] font-bold">{IMPERIAL_RANKS[scoreResult.level]}</span>
                          {' '}in the Trial of Voice.
                          {scoreResult.overallScore === 0 && ' You did not speak during the trial. Please retry with your microphone enabled.'}
                        </p>
                      </div>

                      <div className="flex gap-4 justify-center">
                        <a href="/assessment"><ImperialButton variant="secondary"><Play className="w-4 h-4 mr-2" /> Return to Trials</ImperialButton></a>
                        <Link href="/assessment/listening"><ImperialButton variant="primary">Next Trial: Listening <ChevronRight className="w-4 h-4 ml-2" /></ImperialButton></Link>
                      </div>
                    </div>
                  </MetallicCard>
                </GlowingBorder>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
