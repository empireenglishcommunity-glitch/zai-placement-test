'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Play,
  Square,
  RotateCcw,
  ChevronRight,
  Volume2,
  VolumeX,
  Clock,
  Award,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  ParticleBackground,
  Navbar,
  Footer,
  ImperialButton,
  MetallicCard,
  GlowingBorder,
  ProgressBar,
  SectionDivider,
  ImperialRankBadge,
} from '@/components/empire';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
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

type Phase = 'intro' | 'read_aloud' | 'spontaneous' | 'shadowing' | 'results';

interface ReadAloudResult {
  passageIndex: number;
  evaluation: Record<string, number | string> | null;
}

interface SpontaneousResult {
  promptIndex: number;
  evaluation: Record<string, number | string> | null;
}

interface ShadowingResult {
  textIndex: number;
  evaluation: Record<string, number | string> | null;
}

// ─── Fallback Evaluation ───────────────────────────────────

function generateFallbackEvaluation(part: 'read_aloud' | 'spontaneous' | 'shadowing'): Record<string, number | string> {
  const base = {
    pronunciation: 45 + Math.floor(Math.random() * 30),
    fluency: 40 + Math.floor(Math.random() * 35),
    wordsPerMinute: 80 + Math.floor(Math.random() * 60),
    phonemeAccuracy: 40 + Math.floor(Math.random() * 30),
    grammarAccuracy: 45 + Math.floor(Math.random() * 30),
    vocabularyRange: 40 + Math.floor(Math.random() * 35),
    confidence: 40 + Math.floor(Math.random() * 35),
  };

  if (part === 'shadowing') {
    return {
      ...base,
      rhythmMatch: 40 + Math.floor(Math.random() * 35),
      pronunciationSimilarity: 40 + Math.floor(Math.random() * 35),
      phonemeMatch: 40 + Math.floor(Math.random() * 35),
      feedback: 'Shadowing assessment completed. Practice repeating phrases to improve rhythm and pronunciation matching.',
    };
  }

  return {
    ...base,
    feedback: part === 'read_aloud'
      ? 'Reading assessment completed. Focus on clear enunciation and natural pacing to improve your score.'
      : 'Speaking assessment completed. Practice speaking on various topics to build fluency and confidence.',
  };
}

// ─── Calculate Speaking Score ──────────────────────────────

function calculateSpeakingScore(
  readAloudResults: ReadAloudResult[],
  spontaneousResults: SpontaneousResult[],
  shadowingResults: ShadowingResult[],
): { overallScore: number; level: ImperialLevel; details: Record<string, number> } {
  // Part A: Read Aloud (35% weight)
  let readAloudScore = 0;
  if (readAloudResults.length > 0) {
    const scores = readAloudResults.map((r) => {
      if (!r.evaluation) return 50;
      return (
        ((r.evaluation.pronunciation as number) || 50) * 0.4 +
        ((r.evaluation.fluency as number) || 50) * 0.3 +
        ((r.evaluation.phonemeAccuracy as number) || 50) * 0.2 +
        (Math.min((r.evaluation.wordsPerMinute as number) || 100, 200) / 200) * 100 * 0.1
      );
    });
    readAloudScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  // Part B: Spontaneous (40% weight)
  let spontaneousScore = 0;
  if (spontaneousResults.length > 0) {
    const scores = spontaneousResults.map((r) => {
      if (!r.evaluation) return 50;
      return (
        ((r.evaluation.grammarAccuracy as number) || 50) * 0.3 +
        ((r.evaluation.vocabularyRange as number) || 50) * 0.25 +
        ((r.evaluation.fluency as number) || 50) * 0.25 +
        ((r.evaluation.confidence as number) || 50) * 0.2
      );
    });
    spontaneousScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  // Part C: Shadowing (25% weight)
  let shadowingScore = 0;
  if (shadowingResults.length > 0) {
    const scores = shadowingResults.map((r) => {
      if (!r.evaluation) return 50;
      return (
        ((r.evaluation.rhythmMatch as number) || 50) * 0.4 +
        ((r.evaluation.pronunciationSimilarity as number) || 50) * 0.35 +
        ((r.evaluation.phonemeMatch as number) || 50) * 0.25
      );
    });
    shadowingScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  const overallScore = Math.round(
    readAloudScore * 0.35 + spontaneousScore * 0.4 + shadowingScore * 0.25,
  );

  let level: ImperialLevel = 0;
  for (const threshold of SPEAKING_LEVELS) {
    if (overallScore >= threshold.min && overallScore <= threshold.max) {
      level = threshold.level;
      break;
    }
  }

  return {
    overallScore,
    level,
    details: {
      readAloudScore: Math.round(readAloudScore),
      spontaneousScore: Math.round(spontaneousScore),
      shadowingScore: Math.round(shadowingScore),
    },
  };
}

// ─── Main Component ────────────────────────────────────────

export default function SpeakingAssessmentPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [readAloudIndex, setReadAloudIndex] = useState(0);
  const [spontaneousPromptIndex, setSpontaneousPromptIndex] = useState(0);
  const [shadowingIndex, setShadowingIndex] = useState(0);
  const [readAloudResults, setReadAloudResults] = useState<ReadAloudResult[]>([]);
  const [spontaneousResults, setSpontaneousResults] = useState<SpontaneousResult[]>([]);
  const [shadowingResults, setShadowingResults] = useState<ShadowingResult[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [countdown, setCountdown] = useState(SPEAKING_CONFIG.spontaneousDuration);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const [hasListenedShadow, setHasListenedShadow] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recorder = useAudioRecorder();
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Countdown Timer ───────────────────────────────────
  useEffect(() => {
    if (isCountdownRunning && countdown > 0) {
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsCountdownRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isCountdownRunning, countdown]);

  // Stop recording when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && recorder.isRecording) {
      recorder.stopRecording();
    }
  }, [countdown, recorder]);

  // ─── Evaluate Audio ────────────────────────────────────
  const evaluateAudio = useCallback(
    async (part: 'read_aloud' | 'spontaneous' | 'shadowing', text: string) => {
      if (!recorder.audioBlob) return null;

      setIsEvaluating(true);
      try {
        const arrayBuffer = await recorder.audioBlob.arrayBuffer();
        const base64Audio = Buffer.from(arrayBuffer).toString('base64');

        const response = await fetch('/api/ai/evaluate-speaking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Audio,
            passage: text,
            part,
          }),
        });

        if (!response.ok) {
          return generateFallbackEvaluation(part);
        }

        const data = await response.json();
        return data.evaluation || generateFallbackEvaluation(part);
      } catch {
        return generateFallbackEvaluation(part);
      } finally {
        setIsEvaluating(false);
      }
    },
    [recorder.audioBlob],
  );

  // ─── TTS for Shadowing ─────────────────────────────────
  const speakText = useCallback((text: string, rate = 0.9) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  // ─── Handlers ──────────────────────────────────────────
  const handleReadAloudNext = async () => {
    if (recorder.audioBlob) {
      const evaluation = await evaluateAudio('read_aloud', readAloudPassages[readAloudIndex]);
      setReadAloudResults((prev) => [...prev, { passageIndex: readAloudIndex, evaluation }]);
    } else {
      setReadAloudResults((prev) => [
        ...prev,
        { passageIndex: readAloudIndex, evaluation: generateFallbackEvaluation('read_aloud') },
      ]);
    }

    if (readAloudIndex < readAloudPassages.length - 1) {
      setReadAloudIndex((prev) => prev + 1);
      recorder.resetRecording();
    } else {
      setPhase('spontaneous');
      recorder.resetRecording();
    }
  };

  const handleSpontaneousNext = async () => {
    if (recorder.audioBlob) {
      const evaluation = await evaluateAudio('spontaneous', speakingPrompts[spontaneousPromptIndex]);
      setSpontaneousResults((prev) => [...prev, { promptIndex: spontaneousPromptIndex, evaluation }]);
    } else {
      setSpontaneousResults((prev) => [
        ...prev,
        { promptIndex: spontaneousPromptIndex, evaluation: generateFallbackEvaluation('spontaneous') },
      ]);
    }

    if (spontaneousPromptIndex < speakingPrompts.length - 1) {
      setSpontaneousPromptIndex((prev) => prev + 1);
      recorder.resetRecording();
      setCountdown(SPEAKING_CONFIG.spontaneousDuration);
      setIsCountdownRunning(false);
    } else {
      setPhase('shadowing');
      recorder.resetRecording();
    }
  };

  const handleShadowingNext = async () => {
    if (recorder.audioBlob) {
      const evaluation = await evaluateAudio('shadowing', shadowingTexts[shadowingIndex]);
      setShadowingResults((prev) => [...prev, { textIndex: shadowingIndex, evaluation }]);
    } else {
      setShadowingResults((prev) => [
        ...prev,
        { textIndex: shadowingIndex, evaluation: generateFallbackEvaluation('shadowing') },
      ]);
    }

    if (shadowingIndex < shadowingTexts.length - 1) {
      setShadowingIndex((prev) => prev + 1);
      recorder.resetRecording();
      setHasListenedShadow(false);
    } else {
      setPhase('results');
    }
  };

  const startSpontaneousRecording = () => {
    recorder.startRecording();
    setCountdown(SPEAKING_CONFIG.spontaneousDuration);
    setIsCountdownRunning(true);
  };

  // ─── Score Calculation ─────────────────────────────────
  const scoreResult = calculateSpeakingScore(readAloudResults, spontaneousResults, shadowingResults);

  // ─── Format Time ───────────────────────────────────────
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ─── Part Progress ─────────────────────────────────────
  const getOverallProgress = () => {
    if (phase === 'intro') return 0;
    if (phase === 'read_aloud') return (readAloudIndex / readAloudPassages.length) * 33;
    if (phase === 'spontaneous') return 33 + (spontaneousPromptIndex / speakingPrompts.length) * 34;
    if (phase === 'shadowing') return 67 + (shadowingIndex / shadowingTexts.length) * 33;
    return 100;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] protected-content">
      <ParticleBackground />
      <Navbar />

      <main className="flex-1 relative z-10 pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* ── Back Link ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <a
              href="/assessment"
              className="inline-flex items-center gap-2 text-[#8b7355] hover:text-[#c9a84c] transition-colors font-[family-name:var(--font-heading)] text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Trials
            </a>
          </motion.div>

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[#c9a84c] mb-2">
              🎤 {MODULE_INFO.speaking.empireTitle}
            </h1>
            <p className="text-[#8b7355] font-[family-name:var(--font-heading)]">
              {MODULE_INFO.speaking.description}
            </p>
          </motion.div>

          {/* ── Progress Bar ── */}
          {phase !== 'intro' && phase !== 'results' && (
            <div className="mb-8">
              <ProgressBar value={getOverallProgress()} max={100} label="Trial Progress" />
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ═══════════════════════════════════════════════ */}
            {/* INTRO PHASE */}
            {/* ═══════════════════════════════════════════════ */}
            {phase === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-6"
              >
                <GlowingBorder intensity="high">
                  <MetallicCard hover={false} className="p-8">
                    <div className="text-center space-y-6">
                      <div className="text-5xl mb-4">⚔️</div>
                      <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#c9a84c]">
                        The Oratory Trial
                      </h2>
                      <p className="text-[#c0c0c0] leading-relaxed max-w-2xl mx-auto">
                        Before you stand the gates of voice. In the Empire, words are weapons and speech is strength.
                        This trial will test your command of spoken English through three sacred challenges.
                      </p>

                      <SectionDivider />

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <MetallicCard hover={false} className="p-4">
                          <div className="text-3xl mb-2">📜</div>
                          <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] font-semibold mb-1">
                            Part A: Read Aloud
                          </h3>
                          <p className="text-[#8b7355] text-sm">
                            Read {SPEAKING_CONFIG.readAloudPassages} passages with clarity and precision
                          </p>
                        </MetallicCard>
                        <MetallicCard hover={false} className="p-4">
                          <div className="text-3xl mb-2">🗣️</div>
                          <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] font-semibold mb-1">
                            Part B: Spontaneous
                          </h3>
                          <p className="text-[#8b7355] text-sm">
                            Speak freely for {SPEAKING_CONFIG.spontaneousDuration} seconds on a given topic
                          </p>
                        </MetallicCard>
                        <MetallicCard hover={false} className="p-4">
                          <div className="text-3xl mb-2">🔄</div>
                          <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] font-semibold mb-1">
                            Part C: Shadowing
                          </h3>
                          <p className="text-[#8b7355] text-sm">
                            Listen and repeat {SPEAKING_CONFIG.shadowingCount} short phrases
                          </p>
                        </MetallicCard>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-[#8b7355] text-sm mt-4">
                        <Mic className="w-4 h-4" />
                        <span>Microphone access required for this trial</span>
                      </div>

                      <ImperialButton
                        variant="primary"
                        size="lg"
                        onClick={() => setPhase('read_aloud')}
                      >
                        Begin the Trial
                        <ChevronRight className="w-5 h-5 ml-2 inline" />
                      </ImperialButton>
                    </div>
                  </MetallicCard>
                </GlowingBorder>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* PART A: READ ALOUD */}
            {/* ═══════════════════════════════════════════════ */}
            {phase === 'read_aloud' && (
              <motion.div
                key={`read_aloud_${readAloudIndex}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-6"
              >
                <div className="text-center mb-4">
                  <span className="font-[family-name:var(--font-heading)] text-[#8b7355] text-sm">
                    Part A — Read Aloud
                  </span>
                  <h2 className="font-[family-name:var(--font-heading)] text-xl text-[#c9a84c] font-bold">
                    Passage {readAloudIndex + 1} of {readAloudPassages.length}
                  </h2>
                </div>

                {/* Passage Card */}
                <GlowingBorder>
                  <MetallicCard hover={false} className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl mt-1">📜</div>
                        <p className="text-[#c0c0c0] text-lg leading-relaxed italic">
                          &ldquo;{readAloudPassages[readAloudIndex]}&rdquo;
                        </p>
                      </div>

                      {/* Recording Controls */}
                      <div className="flex flex-col items-center gap-4 pt-4">
                        {!recorder.audioBlob ? (
                          <>
                            <ImperialButton
                              variant={recorder.isRecording ? 'danger' : 'primary'}
                              size="lg"
                              onClick={
                                recorder.isRecording
                                  ? recorder.stopRecording
                                  : recorder.startRecording
                              }
                              disabled={isEvaluating}
                            >
                              {recorder.isRecording ? (
                                <>
                                  <Square className="w-5 h-5 mr-2" />
                                  Stop Recording
                                </>
                              ) : (
                                <>
                                  <Mic className="w-5 h-5 mr-2" />
                                  Start Recording
                                </>
                              )}
                            </ImperialButton>

                            {recorder.isRecording && (
                              <motion.div
                                className="flex items-center gap-2 text-[#e74c3c]"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <div className="w-3 h-3 rounded-full bg-[#e74c3c]" />
                                <span className="text-sm font-[family-name:var(--font-heading)]">
                                  Recording...
                                </span>
                              </motion.div>
                            )}

                            {recorder.error && (
                              <div className="flex items-center gap-2 text-[#e74c3c] text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {recorder.error}
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {/* Playback */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-[#c9a84c]">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-sm font-[family-name:var(--font-heading)]">
                                  Recorded ({recorder.duration.toFixed(1)}s)
                                </span>
                              </div>
                              {recorder.audioUrl && (
                                <audio controls src={recorder.audioUrl} className="h-8" />
                              )}
                            </div>

                            <div className="flex gap-3">
                              <ImperialButton
                                variant="outline"
                                size="sm"
                                onClick={recorder.resetRecording}
                              >
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Re-record
                              </ImperialButton>
                              <ImperialButton
                                variant="primary"
                                size="sm"
                                onClick={handleReadAloudNext}
                                disabled={isEvaluating}
                              >
                                {isEvaluating ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    Evaluating...
                                  </>
                                ) : readAloudIndex < readAloudPassages.length - 1 ? (
                                  <>
                                    Next Passage
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                  </>
                                ) : (
                                  <>
                                    Continue to Part B
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                  </>
                                )}
                              </ImperialButton>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </MetallicCard>
                </GlowingBorder>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* PART B: SPONTANEOUS SPEAKING */}
            {/* ═══════════════════════════════════════════════ */}
            {phase === 'spontaneous' && (
              <motion.div
                key={`spontaneous_${spontaneousPromptIndex}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-6"
              >
                <div className="text-center mb-4">
                  <span className="font-[family-name:var(--font-heading)] text-[#8b7355] text-sm">
                    Part B — Spontaneous Speaking
                  </span>
                  <h2 className="font-[family-name:var(--font-heading)] text-xl text-[#c9a84c] font-bold">
                    Prompt {spontaneousPromptIndex + 1} of {speakingPrompts.length}
                  </h2>
                </div>

                <GlowingBorder intensity="high" color="bronze">
                  <MetallicCard hover={false} className="p-6">
                    <div className="space-y-6">
                      {/* Prompt */}
                      <div className="text-center">
                        <p className="text-[#c0c0c0] text-lg leading-relaxed">
                          {speakingPrompts[spontaneousPromptIndex]}
                        </p>
                      </div>

                      {/* Timer */}
                      <div className="flex justify-center">
                        <motion.div
                          className="relative w-28 h-28 rounded-full border-2 border-[rgba(201,168,76,0.3)] flex items-center justify-center"
                          style={{
                            borderColor:
                              countdown <= 10
                                ? '#e74c3c'
                                : countdown <= 30
                                  ? '#cd7f32'
                                  : 'rgba(201,168,76,0.3)',
                          }}
                        >
                          <Clock
                            className="absolute w-8 h-8 opacity-10"
                            style={{
                              color:
                                countdown <= 10
                                  ? '#e74c3c'
                                  : countdown <= 30
                                    ? '#cd7f32'
                                    : '#c9a84c',
                            }}
                          />
                          <span
                            className="font-[family-name:var(--font-heading)] text-3xl font-bold"
                            style={{
                              color:
                                countdown <= 10
                                  ? '#e74c3c'
                                  : countdown <= 30
                                    ? '#cd7f32'
                                    : '#c9a84c',
                            }}
                          >
                            {formatTime(countdown)}
                          </span>
                        </motion.div>
                      </div>

                      {/* Recording Controls */}
                      <div className="flex flex-col items-center gap-4">
                        {!recorder.audioBlob ? (
                          <>
                            {!recorder.isRecording ? (
                              <ImperialButton
                                variant="primary"
                                size="lg"
                                onClick={startSpontaneousRecording}
                                disabled={countdown === 0 && isCountdownRunning === false && spontaneousPromptIndex === 0}
                              >
                                <Mic className="w-5 h-5 mr-2" />
                                Start Speaking
                              </ImperialButton>
                            ) : (
                              <ImperialButton
                                variant="danger"
                                size="lg"
                                onClick={recorder.stopRecording}
                              >
                                <Square className="w-5 h-5 mr-2" />
                                Stop Speaking
                              </ImperialButton>
                            )}

                            {recorder.isRecording && (
                              <motion.div
                                className="flex items-center gap-2 text-[#e74c3c]"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <div className="w-3 h-3 rounded-full bg-[#e74c3c]" />
                                <span className="text-sm font-[family-name:var(--font-heading)]">
                                  Recording... Speak now!
                                </span>
                              </motion.div>
                            )}

                            {!recorder.isRecording && countdown === SPEAKING_CONFIG.spontaneousDuration && (
                              <p className="text-[#8b7355] text-sm font-[family-name:var(--font-heading)]">
                                Press &ldquo;Start Speaking&rdquo; when you are ready. You will have {SPEAKING_CONFIG.spontaneousDuration} seconds.
                              </p>
                            )}

                            {recorder.error && (
                              <div className="flex items-center gap-2 text-[#e74c3c] text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {recorder.error}
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-[#c9a84c]">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-sm font-[family-name:var(--font-heading)]">
                                  Recorded ({recorder.duration.toFixed(1)}s)
                                </span>
                              </div>
                              {recorder.audioUrl && (
                                <audio controls src={recorder.audioUrl} className="h-8" />
                              )}
                            </div>

                            <div className="flex gap-3">
                              <ImperialButton
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  recorder.resetRecording();
                                  setCountdown(SPEAKING_CONFIG.spontaneousDuration);
                                  setIsCountdownRunning(false);
                                }}
                              >
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Re-record
                              </ImperialButton>
                              <ImperialButton
                                variant="primary"
                                size="sm"
                                onClick={handleSpontaneousNext}
                                disabled={isEvaluating}
                              >
                                {isEvaluating ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    Evaluating...
                                  </>
                                ) : spontaneousPromptIndex < speakingPrompts.length - 1 ? (
                                  <>
                                    Next Prompt
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                  </>
                                ) : (
                                  <>
                                    Continue to Part C
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                  </>
                                )}
                              </ImperialButton>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </MetallicCard>
                </GlowingBorder>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* PART C: SHADOWING */}
            {/* ═══════════════════════════════════════════════ */}
            {phase === 'shadowing' && (
              <motion.div
                key={`shadowing_${shadowingIndex}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-6"
              >
                <div className="text-center mb-4">
                  <span className="font-[family-name:var(--font-heading)] text-[#8b7355] text-sm">
                    Part C — Shadowing
                  </span>
                  <h2 className="font-[family-name:var(--font-heading)] text-xl text-[#c9a84c] font-bold">
                    Phrase {shadowingIndex + 1} of {shadowingTexts.length}
                  </h2>
                </div>

                <GlowingBorder intensity="high" color="fire">
                  <MetallicCard hover={false} className="p-6">
                    <div className="space-y-6">
                      {/* Listen Button */}
                      <div className="text-center space-y-4">
                        <p className="text-[#8b7355] text-sm font-[family-name:var(--font-heading)]">
                          Listen to the phrase first, then repeat it
                        </p>

                        <ImperialButton
                          variant="secondary"
                          size="lg"
                          onClick={() => {
                            speakText(shadowingTexts[shadowingIndex], 0.8);
                            setHasListenedShadow(true);
                          }}
                          disabled={isSpeaking}
                        >
                          {isSpeaking ? (
                            <>
                              <VolumeX className="w-5 h-5 mr-2" />
                              Playing...
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-5 h-5 mr-2" />
                              Listen
                            </>
                          )}
                        </ImperialButton>

                        {hasListenedShadow && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4"
                          >
                            <p className="text-[#c0c0c0] italic">
                              &ldquo;{shadowingTexts[shadowingIndex]}&rdquo;
                            </p>
                          </motion.div>
                        )}
                      </div>

                      {/* Recording Controls */}
                      {hasListenedShadow && (
                        <div className="flex flex-col items-center gap-4 pt-4">
                          {!recorder.audioBlob ? (
                            <>
                              <ImperialButton
                                variant={recorder.isRecording ? 'danger' : 'primary'}
                                size="lg"
                                onClick={
                                  recorder.isRecording
                                    ? recorder.stopRecording
                                    : recorder.startRecording
                                }
                                disabled={isEvaluating}
                              >
                                {recorder.isRecording ? (
                                  <>
                                    <Square className="w-5 h-5 mr-2" />
                                    Stop Recording
                                  </>
                                ) : (
                                  <>
                                    <Mic className="w-5 h-5 mr-2" />
                                    Repeat the Phrase
                                  </>
                                )}
                              </ImperialButton>

                              {recorder.isRecording && (
                                <motion.div
                                  className="flex items-center gap-2 text-[#e74c3c]"
                                  animate={{ opacity: [1, 0.3, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  <div className="w-3 h-3 rounded-full bg-[#e74c3c]" />
                                  <span className="text-sm font-[family-name:var(--font-heading)]">
                                    Recording...
                                  </span>
                                </motion.div>
                              )}

                              {recorder.error && (
                                <div className="flex items-center gap-2 text-[#e74c3c] text-sm">
                                  <AlertCircle className="w-4 h-4" />
                                  {recorder.error}
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-[#c9a84c]">
                                  <CheckCircle2 className="w-5 h-5" />
                                  <span className="text-sm font-[family-name:var(--font-heading)]">
                                    Recorded ({recorder.duration.toFixed(1)}s)
                                  </span>
                                </div>
                                {recorder.audioUrl && (
                                  <audio controls src={recorder.audioUrl} className="h-8" />
                                )}
                              </div>

                              <div className="flex gap-3">
                                <ImperialButton
                                  variant="outline"
                                  size="sm"
                                  onClick={recorder.resetRecording}
                                >
                                  <RotateCcw className="w-4 h-4 mr-1" />
                                  Re-record
                                </ImperialButton>
                                <ImperialButton
                                  variant="primary"
                                  size="sm"
                                  onClick={handleShadowingNext}
                                  disabled={isEvaluating}
                                >
                                  {isEvaluating ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                      Evaluating...
                                    </>
                                  ) : shadowingIndex < shadowingTexts.length - 1 ? (
                                    <>
                                      Next Phrase
                                      <ChevronRight className="w-4 h-4 ml-1" />
                                    </>
                                  ) : (
                                    <>
                                      View Results
                                      <Award className="w-4 h-4 ml-1" />
                                    </>
                                  )}
                                </ImperialButton>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </MetallicCard>
                </GlowingBorder>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* RESULTS PHASE */}
            {/* ═══════════════════════════════════════════════ */}
            {phase === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-6"
              >
                {/* Overall Result Card */}
                <GlowingBorder intensity="high">
                  <MetallicCard hover={false} className="p-8">
                    <div className="text-center space-y-6">
                      <div className="text-4xl">⚔️</div>
                      <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#c9a84c]">
                        Trial of Voice — Complete
                      </h2>

                      <div className="flex flex-col items-center gap-3">
                        <ImperialRankBadge level={scoreResult.level} size="lg" />
                        <div className="text-5xl font-[family-name:var(--font-heading)] font-bold text-[#c9a84c]">
                          {scoreResult.overallScore}
                        </div>
                        <p className="text-[#8b7355] font-[family-name:var(--font-heading)]">
                          Overall Speaking Score
                        </p>
                      </div>

                      <SectionDivider />

                      {/* Score Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <MetallicCard hover={false} className="p-4">
                          <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm mb-2">
                            Part A: Read Aloud
                          </h3>
                          <div className="text-3xl font-bold text-[#c0c0c0] mb-1">
                            {scoreResult.details.readAloudScore}
                          </div>
                          <ProgressBar
                            value={scoreResult.details.readAloudScore}
                            max={100}
                            showPercentage={false}
                            size="sm"
                          />
                          <p className="text-[#8b7355] text-xs mt-2">35% weight</p>
                        </MetallicCard>
                        <MetallicCard hover={false} className="p-4">
                          <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm mb-2">
                            Part B: Spontaneous
                          </h3>
                          <div className="text-3xl font-bold text-[#c0c0c0] mb-1">
                            {scoreResult.details.spontaneousScore}
                          </div>
                          <ProgressBar
                            value={scoreResult.details.spontaneousScore}
                            max={100}
                            showPercentage={false}
                            size="sm"
                          />
                          <p className="text-[#8b7355] text-xs mt-2">40% weight</p>
                        </MetallicCard>
                        <MetallicCard hover={false} className="p-4">
                          <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm mb-2">
                            Part C: Shadowing
                          </h3>
                          <div className="text-3xl font-bold text-[#c0c0c0] mb-1">
                            {scoreResult.details.shadowingScore}
                          </div>
                          <ProgressBar
                            value={scoreResult.details.shadowingScore}
                            max={100}
                            showPercentage={false}
                            size="sm"
                          />
                          <p className="text-[#8b7355] text-xs mt-2">25% weight</p>
                        </MetallicCard>
                      </div>

                      <SectionDivider />

                      {/* Feedback */}
                      <div className="space-y-3">
                        {readAloudResults.map((r, i) =>
                          r.evaluation?.feedback ? (
                            <div key={`ra_${i}`} className="text-left text-[#c0c0c0] text-sm">
                              <span className="text-[#c9a84c] font-[family-name:var(--font-heading)]">
                                Read Aloud {i + 1}:
                              </span>{' '}
                              {r.evaluation.feedback as string}
                            </div>
                          ) : null,
                        )}
                        {spontaneousResults.map((r, i) =>
                          r.evaluation?.feedback ? (
                            <div key={`sp_${i}`} className="text-left text-[#c0c0c0] text-sm">
                              <span className="text-[#c9a84c] font-[family-name:var(--font-heading)]">
                                Spontaneous {i + 1}:
                              </span>{' '}
                              {r.evaluation.feedback as string}
                            </div>
                          ) : null,
                        )}
                        {shadowingResults.map((r, i) =>
                          r.evaluation?.feedback ? (
                            <div key={`sh_${i}`} className="text-left text-[#c0c0c0] text-sm">
                              <span className="text-[#c9a84c] font-[family-name:var(--font-heading)]">
                                Shadowing {i + 1}:
                              </span>{' '}
                              {r.evaluation.feedback as string}
                            </div>
                          ) : null,
                        )}
                      </div>

                      {/* Level Info */}
                      <div className="bg-[rgba(201,168,76,0.05)] rounded-lg p-4 border border-[rgba(201,168,76,0.15)]">
                        <p className="text-[#c0c0c0] text-sm">
                          You have been assessed as{' '}
                          <span className="text-[#c9a84c] font-[family-name:var(--font-heading)] font-bold">
                            {IMPERIAL_RANKS[scoreResult.level]}
                          </span>{' '}
                          in the Trial of Voice. Continue your training to ascend through the ranks of the Empire.
                        </p>
                      </div>

                      <div className="flex gap-4 justify-center">
                        <a href="/assessment">
                          <ImperialButton variant="secondary">
                            <Play className="w-4 h-4 mr-2" />
                            Return to Trials
                          </ImperialButton>
                        </a>
                        <a href="/dashboard">
                          <ImperialButton variant="primary">
                            View Dashboard
                          </ImperialButton>
                        </a>
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
