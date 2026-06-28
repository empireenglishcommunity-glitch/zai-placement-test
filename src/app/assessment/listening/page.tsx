'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRetakeCooldown } from '@/hooks/useRetakeCooldown';
import { useUserId } from '@/hooks/useUserId';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  ChevronRight,
  ArrowLeft,
  Award,
  CheckCircle2,
  Loader2,
  Headphones,
  Radio,
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
import { IMPERIAL_RANKS } from '@/lib/types';
import type { ImperialLevel, ListeningSpeed } from '@/lib/types';
import { LISTENING_LEVELS, LISTENING_CONFIG, MODULE_INFO } from '@/lib/constants';

// ─── Fallback Passages ────────────────────────────────────

const fallbackPassages: Record<ListeningSpeed, {
  passage: string;
  speed: string;
  wpm: number;
  questions: { question: string; options: string[]; correctAnswer: number; type: string }[];
}> = {
  slow: {
    passage: 'The old warrior sat by the fire. He told stories of the great battles. The young recruits listened carefully. They wanted to learn from his experience.',
    speed: 'slow',
    wpm: 80,
    questions: [
      { question: 'What was the warrior doing?', options: ['Fighting a battle', 'Sitting by the fire', 'Training recruits', 'Writing a book'], correctAnswer: 1, type: 'literal' },
      { question: 'Why did the recruits listen carefully?', options: ['They were ordered to', 'They wanted to learn', 'They were bored', 'They were scared'], correctAnswer: 1, type: 'inference' },
      { question: 'What did the warrior tell stories about?', options: ['His childhood', 'Cooking recipes', 'Great battles', 'The weather'], correctAnswer: 2, type: 'detail' },
    ],
  },
  natural: {
    passage: "The empire's training academy was known throughout the land for producing the most skilled warriors. Students underwent rigorous physical and mental training, learning not only combat techniques but also the art of strategy and leadership.",
    speed: 'natural',
    wpm: 130,
    questions: [
      { question: 'What was the academy known for?', options: ['Beautiful architecture', 'Producing skilled warriors', 'Large library', 'Musical performances'], correctAnswer: 1, type: 'literal' },
      { question: 'What can be inferred about the training?', options: ['It was easy', 'It was comprehensive', 'It was only physical', 'It was short'], correctAnswer: 1, type: 'inference' },
      { question: 'Besides combat, what else did students learn?', options: ['Music and art', 'Strategy and leadership', 'Cooking and healing', 'Farming and trading'], correctAnswer: 1, type: 'detail' },
    ],
  },
  fast: {
    passage: "The council convened at dawn, their deliberations spanning the entire day as they weighed the consequences of the proposed alliance with the neighboring kingdom. Arguments were presented with meticulous detail, each delegate articulating their perspective with the precision of a seasoned diplomat, knowing that the decision would shape the empire's trajectory for generations to come.",
    speed: 'fast',
    wpm: 160,
    questions: [
      { question: 'When did the council meet?', options: ['At midnight', 'At dawn', 'At dusk', 'At noon'], correctAnswer: 1, type: 'literal' },
      { question: 'What can be inferred about the decision?', options: ['It was unimportant', 'It had far-reaching consequences', 'It was about trade only', 'It was quickly decided'], correctAnswer: 1, type: 'inference' },
      { question: 'How did the delegates present their arguments?', options: ['Emotionally', 'With meticulous detail', 'Briefly', 'Aggressively'], correctAnswer: 1, type: 'detail' },
    ],
  },
};

// ─── Types ─────────────────────────────────────────────────

type Phase = 'intro' | 'listening' | 'results';

interface PassageContent {
  passage: string;
  speed: string;
  wpm: number;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    type: string;
  }[];
}

interface SpeedSectionResult {
  speed: ListeningSpeed;
  answers: number[];
  correctAnswers: number[];
  questionTypes: string[];
}

// ─── Calculate Listening Score ─────────────────────────────

function calculateListeningScore(results: SpeedSectionResult[]): {
  overallScore: number;
  level: ImperialLevel;
  literalComprehension: number;
  inference: number;
  detailRecognition: number;
} {
  let literalCorrect = 0;
  let literalTotal = 0;
  let inferenceCorrect = 0;
  let inferenceTotal = 0;
  let detailCorrect = 0;
  let detailTotal = 0;

  for (const result of results) {
    for (let i = 0; i < result.answers.length; i++) {
      const isCorrect = result.answers[i] === result.correctAnswers[i];
      const type = result.questionTypes[i];

      if (type === 'literal') {
        literalTotal++;
        if (isCorrect) literalCorrect++;
      } else if (type === 'inference') {
        inferenceTotal++;
        if (isCorrect) inferenceCorrect++;
      } else if (type === 'detail') {
        detailTotal++;
        if (isCorrect) detailCorrect++;
      }
    }
  }

  const literalComprehension = literalTotal > 0 ? Math.round((literalCorrect / literalTotal) * 100) : 0;
  const inference = inferenceTotal > 0 ? Math.round((inferenceCorrect / inferenceTotal) * 100) : 0;
  const detailRecognition = detailTotal > 0 ? Math.round((detailCorrect / detailTotal) * 100) : 0;

  const overallScore = Math.round(
    literalComprehension * 0.3 + inference * 0.4 + detailRecognition * 0.3,
  );

  let level: ImperialLevel = 0;
  for (const threshold of LISTENING_LEVELS) {
    if (overallScore >= threshold.min && overallScore <= threshold.max) {
      level = threshold.level;
      break;
    }
  }

  return { overallScore, level, literalComprehension, inference, detailRecognition };
}

// ─── Speed Config ──────────────────────────────────────────

const speeds: ListeningSpeed[] = ['slow', 'natural', 'fast'];
const speedLabels = LISTENING_CONFIG.speeds;
const ttsRates: Record<ListeningSpeed, number> = { slow: 0.6, natural: 0.9, fast: 1.3 };

// ─── Main Component ────────────────────────────────────────

export default function ListeningAssessmentPage() {
  const { data: authSession, status: authStatus } = useSession();
  const { userId: listeningUserId, isGuest: isListeningGuest } = useUserId();
  const cooldown = useRetakeCooldown('listening');
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');

  // Auth guard: redirect if not logged in AND not guest
  useEffect(() => {
    if (authStatus === 'loading') return;
    if (authStatus === 'unauthenticated' && !isListeningGuest) {
      router.push('/login');
    }
  }, [authStatus, router, isListeningGuest]);
  const [currentSpeedIndex, setCurrentSpeedIndex] = useState(0);
  const [passages, setPassages] = useState<Record<ListeningSpeed, PassageContent | null>>({
    slow: null,
    natural: null,
    fast: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasListened, setHasListened] = useState(false);
  const [answers, setAnswers] = useState<Record<ListeningSpeed, number[]>>({
    slow: [],
    natural: [],
    fast: [],
  });
  const [results, setResults] = useState<SpeedSectionResult[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);

  const currentSpeed = speeds[currentSpeedIndex];
  const currentPassage = passages[currentSpeed];
  const currentAnswers = answers[currentSpeed];

  // ─── Fetch Passages ────────────────────────────────────
  const fetchPassages = useCallback(async () => {
    setIsLoading(true);
    const newPassages: Record<ListeningSpeed, PassageContent | null> = { slow: null, natural: null, fast: null };

    await Promise.all(
      speeds.map(async (speed) => {
        try {
          const response = await fetch('/api/ai/generate-listening', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ speed }),
          });

          if (response.ok) {
            const data = await response.json();
            newPassages[speed] = data.content || fallbackPassages[speed];
          } else {
            newPassages[speed] = fallbackPassages[speed];
          }
        } catch {
          newPassages[speed] = fallbackPassages[speed];
        }
      }),
    );

    setPassages(newPassages);
    setIsLoading(false);
  }, []);

  // ─── TTS ───────────────────────────────────────────────
  const speakPassage = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = ttsRates[currentSpeed];
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setHasListened(true);
      };
      window.speechSynthesis.speak(utterance);
    },
    [currentSpeed],
  );

  // ─── Answer Selection ──────────────────────────────────
  const selectAnswer = useCallback(
    (questionIndex: number, optionIndex: number) => {
      setAnswers((prev) => {
        const newAnswers = { ...prev };
        const current = [...(newAnswers[currentSpeed] || [])];
        current[questionIndex] = optionIndex;
        newAnswers[currentSpeed] = current;
        return newAnswers;
      });
    },
    [currentSpeed],
  );

  // ─── Submit Section ────────────────────────────────────
  const submitSection = useCallback(() => {
    if (!currentPassage) return;

    const sectionResult: SpeedSectionResult = {
      speed: currentSpeed,
      answers: currentPassage.questions.map((_, i) => currentAnswers[i] ?? -1),
      correctAnswers: currentPassage.questions.map((q) => q.correctAnswer),
      questionTypes: currentPassage.questions.map((q) => q.type),
    };

    setResults((prev) => {
      const newResults = [...prev, sectionResult];
      
      // If this was the last section, submit scores now (we have all data)
      if (currentSpeedIndex >= speeds.length - 1) {
        const finalScore = calculateListeningScore(newResults);
        const userId = listeningUserId || '';
        fetch('/api/assessment/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            module: 'listening',
            userId,
            answers: [],
            scores: {
              literalComprehension: finalScore.literalComprehension,
              inference: finalScore.inference,
              overall: finalScore.overallScore,
              level: finalScore.level,
            },
          }),
        }).catch(() => {});
      }
      
      return newResults;
    });

    if (currentSpeedIndex < speeds.length - 1) {
      setCurrentSpeedIndex((prev) => prev + 1);
      setHasListened(false);
      setShowTranscript(false);
      setAnswers((prev) => ({ ...prev, [speeds[currentSpeedIndex + 1]]: [] }));
    } else {
      setPhase('results');
      cooldown.markCompleted();
    }
  }, [currentPassage, currentAnswers, currentSpeed, currentSpeedIndex]);

  // ─── Start Assessment ──────────────────────────────────
  const startAssessment = async () => {
    await fetchPassages();
    setPhase('listening');
  };

  // ─── Score ─────────────────────────────────────────────
  const scoreResult = calculateListeningScore(results);

  // ─── Progress ──────────────────────────────────────────
  const getOverallProgress = () => {
    if (phase === 'intro') return 0;
    if (phase === 'listening') {
      const base = (currentSpeedIndex / speeds.length) * 100;
      const questionsAnswered = currentAnswers.filter((a) => a !== undefined).length;
      const totalQuestions = currentPassage?.questions.length || 3;
      return base + (questionsAnswered / totalQuestions / speeds.length) * 100;
    }
    return 100;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
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
              👂 {MODULE_INFO.listening.empireTitle}
            </h1>
            <p className="text-[#8b7355] font-[family-name:var(--font-heading)]">
              {MODULE_INFO.listening.description}
            </p>
          </motion.div>

          {/* ── Progress Bar ── */}
          {phase === 'listening' && (
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
                      <div className="text-5xl mb-4">👂</div>
                      <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#c9a84c]">
                        The Perception Trial
                      </h2>
                      <p className="font-arabic text-[#8b7355] text-base mt-2" dir="rtl">اختبار الاستماع</p>
                      <p className="text-[#c0c0c0] leading-relaxed max-w-2xl mx-auto mt-4">
                        The Empire demands not only a strong voice, but keen ears. Listen to passages
                        at increasing speeds and prove your comprehension. Only those who truly
                        understand the spoken word will ascend.
                      </p>
                      <p className="font-arabic text-[#8b7355] text-sm leading-relaxed mt-3 max-w-2xl mx-auto" dir="rtl">
                        استمع لمقاطع صوتية بثلاث سرعات مختلفة وأجب عن أسئلة الفهم. اختبار يقيس قدرتك على فهم اللغة الإنجليزية المنطوقة.
                      </p>

                      <SectionDivider />

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {speeds.map((speed) => (
                          <MetallicCard key={speed} hover={false} className="p-4">
                            <div className="text-3xl mb-2">
                              {speed === 'slow' ? '🐢' : speed === 'natural' ? '⚔️' : '⚡'}
                            </div>
                            <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] font-semibold mb-1">
                              {speedLabels[speed].label}
                            </h3>
                            <p className="text-[#8b7355] text-sm">
                              {speedLabels[speed].wpm} WPM —{' '}
                              {speed === 'slow'
                                ? 'Clear and deliberate'
                                : speed === 'natural'
                                  ? 'Conversational pace'
                                  : 'Rapid and challenging'}
                            </p>
                          </MetallicCard>
                        ))}
                      </div>

                      <div className="flex items-center justify-center gap-2 text-[#8b7355] text-sm mt-4">
                        <Headphones className="w-4 h-4" />
                        <span>Audio playback required for this trial</span>
                      </div>

                      <ImperialButton
                        variant="primary"
                        size="lg"
                        onClick={startAssessment}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Preparing Trials...
                          </>
                        ) : (
                          <>
                            Begin the Trial
                            <ChevronRight className="w-5 h-5 ml-2 inline" />
                          </>
                        )}
                      </ImperialButton>
                    </div>
                  </MetallicCard>
                </GlowingBorder>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* LISTENING PHASE */}
            {/* ═══════════════════════════════════════════════ */}
            {phase === 'listening' && currentPassage && (
              <motion.div
                key={`listening_${currentSpeed}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-6"
              >
                {/* Speed Header */}
                <div className="text-center mb-4">
                  <span className="font-[family-name:var(--font-heading)] text-[#8b7355] text-sm">
                    Section {currentSpeedIndex + 1} of {speeds.length}
                  </span>
                  <h2 className="font-[family-name:var(--font-heading)] text-xl text-[#c9a84c] font-bold">
                    {speedLabels[currentSpeed].label} — {speedLabels[currentSpeed].wpm} WPM
                  </h2>
                </div>

                {/* Listen Card */}
                <GlowingBorder
                  intensity={currentSpeed === 'fast' ? 'high' : 'medium'}
                  color={currentSpeed === 'slow' ? 'gold' : currentSpeed === 'natural' ? 'bronze' : 'fire'}
                >
                  <MetallicCard hover={false} className="p-6">
                    <div className="space-y-6">
                      {/* Audio Controls */}
                      <div className="text-center space-y-4">
                        <p className="text-[#8b7355] text-sm font-[family-name:var(--font-heading)]">
                          Listen to the passage carefully
                        </p>

                        <div className="flex justify-center gap-3">
                          <ImperialButton
                            variant={isSpeaking ? 'danger' : 'primary'}
                            size="lg"
                            onClick={() => speakPassage(currentPassage.passage)}
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
                                Listen to Passage
                              </>
                            )}
                          </ImperialButton>

                          {hasListened && (
                            <ImperialButton
                              variant="outline"
                              size="lg"
                              onClick={() => speakPassage(currentPassage.passage)}
                              disabled={isSpeaking}
                            >
                              <Radio className="w-5 h-5 mr-2" />
                              Replay
                            </ImperialButton>
                          )}
                        </div>

                        {/* Speaking indicator */}
                        {isSpeaking && (
                          <motion.div
                            className="flex items-center justify-center gap-2 text-[#c9a84c]"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <div className="w-3 h-3 rounded-full bg-[#c9a84c]" />
                            <span className="text-sm font-[family-name:var(--font-heading)]">
                              Playing audio at {speedLabels[currentSpeed].wpm} WPM...
                            </span>
                          </motion.div>
                        )}

                        {/* Transcript toggle */}
                        {hasListened && (
                          <div className="space-y-3">
                            <ImperialButton
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowTranscript(!showTranscript)}
                            >
                              {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
                            </ImperialButton>

                            {showTranscript && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-[rgba(201,168,76,0.05)] rounded-lg p-4 border border-[rgba(201,168,76,0.15)]"
                              >
                                <p className="text-[#c0c0c0] italic text-sm leading-relaxed">
                                  {currentPassage.passage}
                                </p>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Questions */}
                      {hasListened && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4 pt-4"
                        >
                          <SectionDivider />

                          <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] font-semibold text-center">
                            Comprehension Questions
                          </h3>

                          {currentPassage.questions.map((q, qIndex) => (
                            <MetallicCard key={qIndex} hover={false} className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                  <span className="text-[#c9a84c] font-[family-name:var(--font-heading)] font-bold text-sm">
                                    {qIndex + 1}.
                                  </span>
                                  <div className="flex-1">
                                    <p className="text-[#c0c0c0] text-sm mb-1">{q.question}</p>
                                    <span className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)] uppercase">
                                      {q.type === 'literal'
                                        ? '📖 Literal Comprehension'
                                        : q.type === 'inference'
                                          ? '🔍 Inference'
                                          : '🔎 Detail Recognition'}
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {q.options.map((option, oIndex) => (
                                    <button
                                      key={oIndex}
                                      onClick={() => selectAnswer(qIndex, oIndex)}
                                      className={`text-left px-4 py-2.5 rounded-md border text-sm transition-all cursor-pointer ${
                                        currentAnswers[qIndex] === oIndex
                                          ? 'border-[#c9a84c] bg-[rgba(201,168,76,0.15)] text-[#c9a84c]'
                                          : 'border-[rgba(201,168,76,0.15)] bg-[rgba(26,26,46,0.5)] text-[#c0c0c0] hover:border-[rgba(201,168,76,0.3)] hover:bg-[rgba(201,168,76,0.05)]'
                                      }`}
                                    >
                                      <span className="font-[family-name:var(--font-heading)] font-semibold mr-2">
                                        {String.fromCharCode(65 + oIndex)}.
                                      </span>
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </MetallicCard>
                          ))}

                          {/* Submit */}
                          <div className="flex justify-center pt-4">
                            <ImperialButton
                              variant="primary"
                              size="lg"
                              onClick={submitSection}
                              disabled={
                                currentPassage.questions.some(
                                  (_, i) => currentAnswers[i] === undefined,
                                )
                              }
                            >
                              {currentSpeedIndex < speeds.length - 1 ? (
                                <>
                                  Next Speed Level
                                  <ChevronRight className="w-5 h-5 ml-2 inline" />
                                </>
                              ) : (
                                <>
                                  View Results
                                  <Award className="w-5 h-5 ml-2 inline" />
                                </>
                              )}
                            </ImperialButton>
                          </div>
                        </motion.div>
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
                <GlowingBorder intensity="high">
                  <MetallicCard hover={false} className="p-8">
                    <div className="text-center space-y-6">
                      <div className="text-4xl">👂</div>
                      <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#c9a84c]">
                        Trial of the Ear — Complete
                      </h2>

                      <div className="flex flex-col items-center gap-3">
                        <ImperialRankBadge level={scoreResult.level} size="lg" />
                        <div className="text-5xl font-[family-name:var(--font-heading)] font-bold text-[#c9a84c]">
                          {scoreResult.overallScore}
                        </div>
                        <p className="text-[#8b7355] font-[family-name:var(--font-heading)]">
                          Overall Listening Score
                        </p>
                      </div>

                      <SectionDivider />

                      {/* Score Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <MetallicCard hover={false} className="p-4">
                          <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm mb-2">
                            📖 Literal Comprehension
                          </h3>
                          <div className="text-3xl font-bold text-[#c0c0c0] mb-1">
                            {scoreResult.literalComprehension}%
                          </div>
                          <ProgressBar
                            value={scoreResult.literalComprehension}
                            max={100}
                            showPercentage={false}
                            size="sm"
                          />
                          <p className="text-[#8b7355] text-xs mt-2">30% weight</p>
                        </MetallicCard>
                        <MetallicCard hover={false} className="p-4">
                          <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm mb-2">
                            🔍 Inference
                          </h3>
                          <div className="text-3xl font-bold text-[#c0c0c0] mb-1">
                            {scoreResult.inference}%
                          </div>
                          <ProgressBar
                            value={scoreResult.inference}
                            max={100}
                            showPercentage={false}
                            size="sm"
                          />
                          <p className="text-[#8b7355] text-xs mt-2">40% weight</p>
                        </MetallicCard>
                        <MetallicCard hover={false} className="p-4">
                          <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm mb-2">
                            🔎 Detail Recognition
                          </h3>
                          <div className="text-3xl font-bold text-[#c0c0c0] mb-1">
                            {scoreResult.detailRecognition}%
                          </div>
                          <ProgressBar
                            value={scoreResult.detailRecognition}
                            max={100}
                            showPercentage={false}
                            size="sm"
                          />
                          <p className="text-[#8b7355] text-xs mt-2">30% weight</p>
                        </MetallicCard>
                      </div>

                      <SectionDivider />

                      {/* Per-Speed Breakdown */}
                      <div className="space-y-3">
                        <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] font-semibold">
                          Per-Speed Results
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {results.map((r, i) => {
                            const correct = r.answers.filter(
                              (a, j) => a === r.correctAnswers[j],
                            ).length;
                            const total = r.answers.length;
                            return (
                              <MetallicCard key={i} hover={false} className="p-3">
                                <div className="text-center">
                                  <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-xs mb-1">
                                    {speedLabels[r.speed].label}
                                  </p>
                                  <p className="text-[#c0c0c0] font-bold">
                                    {correct}/{total}
                                  </p>
                                  <div className="flex items-center justify-center gap-1 mt-1">
                                    {r.answers.map((a, j) => (
                                      <CheckCircle2
                                        key={j}
                                        className="w-4 h-4"
                                        style={{
                                          color: a === r.correctAnswers[j] ? '#c9a84c' : '#e74c3c',
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </MetallicCard>
                            );
                          })}
                        </div>
                      </div>

                      {/* Level Info */}
                      <div className="bg-[rgba(201,168,76,0.05)] rounded-lg p-4 border border-[rgba(201,168,76,0.15)]">
                        <p className="text-[#c0c0c0] text-sm">
                          You have been assessed as{' '}
                          <span className="text-[#c9a84c] font-[family-name:var(--font-heading)] font-bold">
                            {IMPERIAL_RANKS[scoreResult.level]}
                          </span>{' '}
                          in the Trial of the Ear. Continue your training to sharpen your perception
                          and ascend through the ranks of the Empire.
                        </p>
                      </div>

                      <div className="flex gap-4 justify-center">
                        <a href="/assessment">
                          <ImperialButton variant="secondary">
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
