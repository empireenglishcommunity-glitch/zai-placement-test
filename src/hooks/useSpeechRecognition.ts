// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH COMMUNITY — Speech Recognition Hook
// Uses Web Speech API for real-time transcription
// Works in Chrome, Edge, Safari (no cost, no API key needed)
// ═══════════════════════════════════════════════════════════

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface UseSpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxDuration?: number; // seconds — auto-stop after this
}

interface UseSpeechRecognitionReturn {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  duration: number; // seconds of listening
  wordCount: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const {
    language = 'en-US',
    continuous = true,
    interimResults = true,
    maxDuration = 120,
  } = options;

  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxDurationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check browser support
  const isSupported = typeof window !== 'undefined' && (
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  );

  // Count words in transcript
  useEffect(() => {
    const words = transcript.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  }, [transcript]);

  const start = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    setError(null);
    setTranscript('');
    setInterimTranscript('');
    setDuration(0);
    setWordCount(0);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      // Timer already started above (before recognition.start())
      // This just confirms the mic is active
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let final = '';
      let interim = '';

      // Only process NEW results (from resultIndex onward)
      // This prevents re-processing and duplicating earlier speech
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        setTranscript(prev => (prev + final).trim());
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      switch (event.error) {
        case 'no-speech':
          setError('No speech detected. Please speak clearly into your microphone.');
          break;
        case 'audio-capture':
          setError('No microphone found. Please connect a microphone and try again.');
          break;
        case 'not-allowed':
          setError('Microphone access denied. Please allow microphone access in your browser settings.');
          break;
        case 'network':
          setError('Network error. Speech recognition requires an internet connection.');
          break;
        default:
          setError(`Speech recognition error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
      if (maxDurationTimeoutRef.current) {
        clearTimeout(maxDurationTimeoutRef.current);
        maxDurationTimeoutRef.current = null;
      }
    };

    recognitionRef.current = recognition;
    recognition.start();

    // Start duration timer IMMEDIATELY (don't wait for onstart which delays for mic permission)
    startTimeRef.current = Date.now();
    setIsListening(true);
    durationIntervalRef.current = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    // Auto-stop after maxDuration
    maxDurationTimeoutRef.current = setTimeout(() => {
      recognition.stop();
    }, maxDuration * 1000);
  }, [isSupported, language, continuous, interimResults, maxDuration]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setTranscript('');
    setInterimTranscript('');
    setDuration(0);
    setWordCount(0);
    setError(null);
  }, [stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (maxDurationTimeoutRef.current) {
        clearTimeout(maxDurationTimeoutRef.current);
      }
    };
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    error,
    duration,
    wordCount,
    start,
    stop,
    reset,
  };
}

// ─── Type declarations for Web Speech API ───────────────────

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
