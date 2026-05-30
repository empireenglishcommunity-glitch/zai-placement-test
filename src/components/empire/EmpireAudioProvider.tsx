'use client';

import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';

interface EmpireAudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isActivated: boolean;
  showOverlay: boolean;
  activate: () => void;
  skipActivation: () => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  fadeOut: () => void;
}

const EmpireAudioContext = createContext<EmpireAudioState | null>(null);

export function useEmpireAudio() {
  const ctx = useContext(EmpireAudioContext);
  if (!ctx) throw new Error('useEmpireAudio must be used within EmpireAudioProvider');
  return ctx;
}

// Fade-in utility (standalone, not a hook)
function fadeInAudio(
  audio: HTMLAudioElement,
  targetVol: number,
  duration: number,
  onVolumeChange: (v: number) => void,
  intervalRef: React.MutableRefObject<NodeJS.Timeout | null>,
) {
  const steps = 30;
  const stepTime = duration / steps;
  const volStep = targetVol / steps;
  let current = 0;
  audio.volume = 0;

  if (intervalRef.current) clearInterval(intervalRef.current);
  intervalRef.current = setInterval(() => {
    current += volStep;
    if (current >= targetVol) {
      audio.volume = targetVol;
      onVolumeChange(targetVol);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    audio.volume = current;
    onVolumeChange(current);
  }, stepTime);
}

export function EmpireAudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.15);
  const [isActivated, setIsActivated] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio('/empire-soundtrack.mp3');
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Attempt autoplay
    const attemptAutoplay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setIsActivated(true);
        fadeInAudio(audio, 0.15, 2000, setVolumeState, fadeIntervalRef);
      } catch {
        // Autoplay blocked — show overlay
        setShowOverlay(true);
      }
    };

    attemptAutoplay();

    // Listen for "skip" events from the overlay
    const handleSkip = () => {
      setShowOverlay(false);
    };
    window.addEventListener('empire-audio-skip', handleSkip);

    return () => {
      audio.pause();
      audio.src = '';
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      window.removeEventListener('empire-audio-skip', handleSkip);
    };
  }, []);

  // Activate from overlay
  const activate = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.volume = 0;
      await audio.play();
      setIsPlaying(true);
      setIsActivated(true);
      setShowOverlay(false);
      fadeInAudio(audio, 0.15, 2500, setVolumeState, fadeIntervalRef);
    } catch (err) {
      console.warn('Audio activation failed:', err);
      setShowOverlay(false);
    }
  }, []);

  // Skip activation (enter silently)
  const skipActivation = useCallback(() => {
    setShowOverlay(false);
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  }, [isMuted]);

  // Set volume
  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(1, v));
    audio.volume = clamped;
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      audio.muted = false;
      setIsMuted(false);
    }
  }, [isMuted]);

  // Fade out and pause
  const fadeOut = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const steps = 20;
    const stepTime = 50;
    const volStep = audio.volume / steps;
    let current = audio.volume;

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    fadeIntervalRef.current = setInterval(() => {
      current -= volStep;
      if (current <= 0.01) {
        audio.volume = 0;
        audio.pause();
        setIsPlaying(false);
        setVolumeState(0);
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        return;
      }
      audio.volume = current;
      setVolumeState(current);
    }, stepTime);
  }, []);

  return (
    <EmpireAudioContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        isActivated,
        showOverlay,
        activate,
        skipActivation,
        toggleMute,
        setVolume,
        fadeOut,
      }}
    >
      {children}
    </EmpireAudioContext.Provider>
  );
}
