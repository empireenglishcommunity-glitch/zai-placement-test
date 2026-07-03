'use client';

// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH — Listening Audio Player
// HTML5 audio player for pre-generated Kokoro TTS passages
// Features: play/pause, progress bar, replay limit, speed control, TTS fallback
// ═══════════════════════════════════════════════════════════

import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// ─── Types ─────────────────────────────────────────────────

interface ListeningAudioPlayerProps {
  passageId: string;
  transcript: string;  // Fallback for browser TTS
  wpm?: number;        // Words per minute for TTS fallback speed
  maxReplays?: number; // Maximum number of total plays (default 2)
  onPlaybackComplete?: () => void; // Called when playback finishes (first time)
  onAllPlaysUsed?: () => void;     // Called when all replays exhausted
}

type PlayerState = 'loading' | 'ready' | 'playing' | 'paused' | 'completed' | 'error';

// ─── Component ─────────────────────────────────────────────

export function ListeningAudioPlayer({
  passageId,
  transcript,
  wpm = 130,
  maxReplays = 2,
  onPlaybackComplete,
  onAllPlaysUsed,
}: ListeningAudioPlayerProps) {
  const [playerState, setPlayerState] = useState<PlayerState>('loading');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const [useFallback, setUseFallback] = useState(false);
  const [hasCompletedOnce, setHasCompletedOnce] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const animationRef = useRef<number | null>(null);

  const audioSrc = `/audio/listening/${passageId}.mp3`;

  // ─── Audio Element Setup ───────────────────────────────────

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = audioSrc;
    audioRef.current = audio;

    const handleCanPlay = () => {
      if (playerState === 'loading') setPlayerState('ready');
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setPlayerState('completed');
      setCurrentTime(0);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      
      if (!hasCompletedOnce) {
        setHasCompletedOnce(true);
        onPlaybackComplete?.();
      }
      
      if (playCount + 1 >= maxReplays) {
        onAllPlaysUsed?.();
      }
    };

    const handleError = () => {
      // MP3 not found — fall back to browser TTS
      console.warn(`[ListeningAudioPlayer] MP3 not found for ${passageId}, using browser TTS fallback`);
      setUseFallback(true);
      setPlayerState('ready');
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passageId]);

  // ─── Time Update Loop ──────────────────────────────────────

  const updateTime = useCallback(() => {
    if (audioRef.current && playerState === 'playing') {
      setCurrentTime(audioRef.current.currentTime);
      animationRef.current = requestAnimationFrame(updateTime);
    }
  }, [playerState]);

  useEffect(() => {
    if (playerState === 'playing' && !useFallback) {
      animationRef.current = requestAnimationFrame(updateTime);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [playerState, updateTime, useFallback]);

  // ─── Play (HTML5 Audio) ────────────────────────────────────

  const playAudio = useCallback(() => {
    if (playCount >= maxReplays) return;

    if (!useFallback && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setPlayerState('playing');
      setPlayCount(prev => prev + 1);
    } else {
      // Browser TTS fallback
      playWithTTS();
    }
  }, [playCount, maxReplays, useFallback]);

  // ─── Play (Browser TTS Fallback) ──────────────────────────

  const playWithTTS = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (playCount >= maxReplays) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(transcript);
    utterance.rate = (wpm / 150) * speed;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'))
      || voices.find(v => v.lang.startsWith('en-US'))
      || voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onstart = () => setPlayerState('playing');
    utterance.onend = () => {
      setPlayerState('completed');
      if (!hasCompletedOnce) {
        setHasCompletedOnce(true);
        onPlaybackComplete?.();
      }
      if (playCount + 1 >= maxReplays) {
        onAllPlaysUsed?.();
      }
    };
    utterance.onerror = () => setPlayerState('error');

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setPlayCount(prev => prev + 1);
    setPlayerState('playing');
  }, [transcript, wpm, speed, playCount, maxReplays, hasCompletedOnce, onPlaybackComplete, onAllPlaysUsed]);

  // ─── Pause ─────────────────────────────────────────────────

  const pauseAudio = useCallback(() => {
    if (!useFallback && audioRef.current) {
      audioRef.current.pause();
      setPlayerState('paused');
    } else if (window.speechSynthesis) {
      window.speechSynthesis.pause();
      setPlayerState('paused');
    }
  }, [useFallback]);

  // ─── Resume ────────────────────────────────────────────────

  const resumeAudio = useCallback(() => {
    if (!useFallback && audioRef.current) {
      audioRef.current.play();
      setPlayerState('playing');
    } else if (window.speechSynthesis) {
      window.speechSynthesis.resume();
      setPlayerState('playing');
    }
  }, [useFallback]);

  // ─── Speed Change ──────────────────────────────────────────

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    // Always apply to audio element immediately
    if (!useFallback && audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  // ─── Format Time ───────────────────────────────────────────

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ─── Progress Percentage ───────────────────────────────────

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const replaysRemaining = maxReplays - playCount;
  const canPlay = playCount < maxReplays;

  // ─── Render ────────────────────────────────────────────────

  return (
    <div className="w-full">
      {/* Audio Visualization */}
      <div className="flex flex-col items-center mb-6">
        <motion.div
          animate={playerState === 'playing' ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 1.5, repeat: playerState === 'playing' ? Infinity : 0 }}
        >
          <Volume2 className={`w-14 h-14 ${
            playerState === 'playing' ? 'text-[#c9a84c]' : 
            playerState === 'completed' ? 'text-[#4ade80]' :
            playerState === 'error' ? 'text-[#e74c3c]' :
            'text-[#8b7355]'
          }`} />
        </motion.div>
      </div>

      {/* Status Text */}
      <div className="text-center mb-5">
        {playerState === 'loading' && (
          <p className="text-[#8b7355] text-sm">Loading audio...</p>
        )}
        {playerState === 'ready' && playCount === 0 && (
          <p className="text-[#c0c0c0] text-sm">Press play to listen to the passage. Listen carefully — you will answer questions after.</p>
        )}
        {playerState === 'playing' && (
          <p className="text-[#c9a84c] text-sm font-[family-name:var(--font-heading)]">
            Listening... pay close attention.
          </p>
        )}
        {playerState === 'paused' && (
          <p className="text-[#e8d48b] text-sm">Paused — click play to resume.</p>
        )}
        {playerState === 'completed' && canPlay && (
          <p className="text-[#4ade80] text-sm">Passage complete. You may replay or proceed to questions.</p>
        )}
        {playerState === 'completed' && !canPlay && (
          <p className="text-[#8b7355] text-sm">All replays used. Proceed to questions.</p>
        )}
        {playerState === 'error' && (
          <div className="flex items-center justify-center gap-2 text-[#e74c3c] text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Audio unavailable. Using text-to-speech.</span>
          </div>
        )}
      </div>

      {/* Progress Bar (only for HTML5 audio, not TTS) */}
      {!useFallback && duration > 0 && (playerState === 'playing' || playerState === 'paused') && (
        <div className="mb-5">
          <div className="relative w-full h-2 bg-[#1a1a2e] rounded-full overflow-hidden border border-[rgba(201,168,76,0.15)]">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#c9a84c] to-[#e8d48b] rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[#8b7355] text-xs font-mono">{formatTime(currentTime)}</span>
            <span className="text-[#8b7355] text-xs font-mono">{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {/* Play / Pause / Replay Button */}
        {playerState === 'loading' ? (
          <button disabled className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[rgba(139,115,85,0.3)] bg-[#111118] text-[#8b7355] cursor-wait">
            <div className="w-5 h-5 border-2 border-[#8b7355] border-t-transparent rounded-full animate-spin" />
            <span className="font-[family-name:var(--font-heading)] text-sm">Loading...</span>
          </button>
        ) : playerState === 'playing' ? (
          <button
            onClick={pauseAudio}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[rgba(201,168,76,0.4)] bg-[rgba(201,168,76,0.08)] text-[#e8d48b] hover:bg-[rgba(201,168,76,0.15)] transition-all"
          >
            <Pause className="w-5 h-5" />
            <span className="font-[family-name:var(--font-heading)] text-sm">Pause</span>
          </button>
        ) : playerState === 'paused' ? (
          <button
            onClick={resumeAudio}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[rgba(201,168,76,0.5)] bg-[rgba(201,168,76,0.1)] text-[#c9a84c] hover:bg-[rgba(201,168,76,0.2)] transition-all"
          >
            <Play className="w-5 h-5" />
            <span className="font-[family-name:var(--font-heading)] text-sm">Resume</span>
          </button>
        ) : canPlay ? (
          <button
            onClick={playAudio}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[rgba(201,168,76,0.5)] bg-gradient-to-r from-[rgba(201,168,76,0.15)] to-[rgba(201,168,76,0.05)] text-[#c9a84c] hover:from-[rgba(201,168,76,0.25)] hover:to-[rgba(201,168,76,0.1)] transition-all shadow-[0_0_15px_rgba(201,168,76,0.1)]"
          >
            {playCount === 0 ? (
              <>
                <Play className="w-5 h-5" />
                <span className="font-[family-name:var(--font-heading)] text-sm">Play Passage</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-5 h-5" />
                <span className="font-[family-name:var(--font-heading)] text-sm">Replay</span>
              </>
            )}
          </button>
        ) : (
          <button disabled className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[rgba(139,115,85,0.2)] bg-[#111118] text-[#555] cursor-not-allowed">
            <Play className="w-5 h-5" />
            <span className="font-[family-name:var(--font-heading)] text-sm">No Replays Left</span>
          </button>
        )}
      </div>

      {/* Speed Control + Replay Counter */}
      <div className="flex items-center justify-between mt-5 px-2">
        {/* Speed */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#8b7355] text-xs mr-1">Speed:</span>
          {[0.75, 1.0, 1.25].map(s => (
            <button
              key={s}
              onClick={() => handleSpeedChange(s)}
              disabled={playerState === 'loading'}
              className={`px-2.5 py-1 rounded text-xs font-[family-name:var(--font-heading)] transition-all ${
                speed === s
                  ? 'bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.4)] text-[#c9a84c]'
                  : 'border border-[rgba(139,115,85,0.2)] text-[#8b7355] hover:border-[rgba(201,168,76,0.3)] hover:text-[#c9a84c]'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Replay Counter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#8b7355] text-xs">
            {replaysRemaining > 0 ? (
              <>Replays: <span className="text-[#c9a84c] font-bold">{replaysRemaining}</span> remaining</>
            ) : (
              <span className="text-[#555]">No replays left</span>
            )}
          </span>
        </div>
      </div>

      {/* Fallback indicator */}
      {useFallback && playerState !== 'loading' && (
        <div className="mt-3 text-center">
          <span className="text-[#8b7355] text-[10px] uppercase tracking-wider">
            Using browser voice (pre-recorded audio not available)
          </span>
        </div>
      )}
    </div>
  );
}
