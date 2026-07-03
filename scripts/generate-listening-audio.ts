#!/usr/bin/env npx tsx
// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH — Listening Audio Generator
// Reads all listening passages and generates MP3 files via Kokoro TTS
//
// Usage:
//   npx tsx scripts/generate-listening-audio.ts              # Generate missing only
//   npx tsx scripts/generate-listening-audio.ts --regenerate # Regenerate ALL
//   npx tsx scripts/generate-listening-audio.ts --voice am_adam  # Use specific voice
//   npx tsx scripts/generate-listening-audio.ts --list-voices   # Show available voices
//
// Requirements:
//   - Kokoro TTS running at localhost:8880 (see kokoro-tts/setup.sh)
//   - Or set KOKORO_URL environment variable
//
// Output:
//   public/audio/listening/{passage-id}.mp3
//   public/audio/listening/manifest.json
// ═══════════════════════════════════════════════════════════

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

// ─── Configuration ─────────────────────────────────────────

const KOKORO_URL = process.env.KOKORO_URL || 'http://localhost:8880';
const OUTPUT_DIR = join(process.cwd(), 'public', 'audio', 'listening');
const DEFAULT_VOICE = 'af_heart';
const RESPONSE_FORMAT = 'mp3';

// Speed mapping by difficulty (slower = easier to understand)
const SPEED_MAP: Record<string, number> = {
  easy: 0.85,    // Slow, clear — beginner friendly
  medium: 0.95,  // Natural pace
  hard: 1.05,    // Slightly faster — advanced challenge
};

// ─── Types ─────────────────────────────────────────────────

interface Passage {
  id: string;
  difficulty: string;
  title: string;
  format: string;
  topic: string;
  transcript: string;
  wordCount: number;
  wpm: number;
}

interface ManifestEntry {
  id: string;
  title: string;
  difficulty: string;
  format: string;
  topic: string;
  duration_seconds: number;
  word_count: number;
  speed: number;
  voice: string;
  file_size_bytes: number;
  generated_at: string;
}

interface Manifest {
  generated: string;
  voice: string;
  model: string;
  format: string;
  kokoro_url: string;
  total_passages: number;
  total_duration_seconds: number;
  files: Record<string, ManifestEntry>;
}

// ─── Parse CLI Args ────────────────────────────────────────

const args = process.argv.slice(2);
const regenerate = args.includes('--regenerate');
const listVoices = args.includes('--list-voices');
const voiceIdx = args.indexOf('--voice');
const voice = voiceIdx !== -1 && args[voiceIdx + 1] ? args[voiceIdx + 1] : DEFAULT_VOICE;

// ─── Utilities ─────────────────────────────────────────────

function log(msg: string) {
  console.log(`  ${msg}`);
}

function logHeader(msg: string) {
  console.log(`\n  ─── ${msg} ${'─'.repeat(Math.max(0, 50 - msg.length))}`);
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Check Kokoro Health ───────────────────────────────────

async function checkKokoroHealth(): Promise<boolean> {
  try {
    const resp = await fetch(`${KOKORO_URL}/v1/audio/speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'kokoro',
        input: 'test',
        voice: voice,
        response_format: 'mp3',
      }),
    });
    return resp.ok;
  } catch {
    return false;
  }
}

// ─── List Available Voices ─────────────────────────────────

async function listAvailableVoices(): Promise<void> {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  KOKORO TTS — Available Voices');
  console.log('═══════════════════════════════════════════════════════\n');
  
  // Known Kokoro voices (from documentation)
  const voices = [
    { id: 'af_heart', desc: 'Female, warm, professional (DEFAULT)' },
    { id: 'af_bella', desc: 'Female, clear, neutral' },
    { id: 'af_nicole', desc: 'Female, calm, mature' },
    { id: 'af_sarah', desc: 'Female, bright, energetic' },
    { id: 'af_sky', desc: 'Female, young, friendly' },
    { id: 'am_adam', desc: 'Male, professional, neutral' },
    { id: 'am_michael', desc: 'Male, warm, conversational' },
    { id: 'bf_emma', desc: 'British Female, clear, professional' },
    { id: 'bf_isabella', desc: 'British Female, elegant' },
    { id: 'bm_george', desc: 'British Male, authoritative' },
    { id: 'bm_lewis', desc: 'British Male, warm' },
  ];

  console.log('  Recommended for TOEFL academic content:');
  console.log('  ─────────────────────────────────────────');
  voices.forEach(v => {
    const marker = v.id === DEFAULT_VOICE ? ' ★' : '  ';
    console.log(`  ${marker} ${v.id.padEnd(14)} — ${v.desc}`);
  });
  console.log('\n  Usage: npx tsx scripts/generate-listening-audio.ts --voice am_adam');
  console.log('');
}

// ─── Generate Audio for a Single Passage ───────────────────

async function generateAudio(passage: Passage, voiceName: string): Promise<{ buffer: Buffer; duration: number }> {
  const speed = SPEED_MAP[passage.difficulty] || 1.0;
  
  const response = await fetch(`${KOKORO_URL}/v1/audio/speech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'kokoro',
      input: passage.transcript,
      voice: voiceName,
      response_format: RESPONSE_FORMAT,
      speed: speed,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Kokoro API error (${response.status}): ${errorText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  
  // Estimate duration from word count and speed
  // Base WPM for Kokoro is ~150 at speed 1.0
  const effectiveWpm = 150 * speed;
  const durationSeconds = Math.round((passage.wordCount / effectiveWpm) * 60);

  return { buffer, duration: durationSeconds };
}

// ─── Load Passages (import from data file) ─────────────────

async function loadPassages(): Promise<Passage[]> {
  // Dynamic import of the listening passages
  const dataPath = join(process.cwd(), 'src', 'data', 'listening-passages.ts');
  
  if (!existsSync(dataPath)) {
    throw new Error(`Passages file not found: ${dataPath}`);
  }

  // Use dynamic import (tsx handles TypeScript)
  const module = await import(join(process.cwd(), 'src', 'data', 'listening-passages'));
  return module.ALL_LISTENING_PASSAGES;
}

// ─── Main ──────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  EMPIRE ENGLISH — Listening Audio Generator');
  console.log('═══════════════════════════════════════════════════════');

  // Handle --list-voices
  if (listVoices) {
    await listAvailableVoices();
    return;
  }

  logHeader('Configuration');
  log(`Kokoro URL:   ${KOKORO_URL}`);
  log(`Voice:        ${voice}`);
  log(`Output:       ${OUTPUT_DIR}`);
  log(`Mode:         ${regenerate ? 'REGENERATE ALL' : 'Generate missing only'}`);

  // Check Kokoro is running
  logHeader('Checking Kokoro TTS');
  const isHealthy = await checkKokoroHealth();
  if (!isHealthy) {
    console.error('\n  ERROR: Cannot connect to Kokoro TTS at ' + KOKORO_URL);
    console.error('  Make sure Kokoro is running:');
    console.error('    cd /opt/kokoro-tts && docker compose up -d');
    console.error('  Or set KOKORO_URL environment variable.\n');
    process.exit(1);
  }
  log('Kokoro TTS is responsive');

  // Load passages
  logHeader('Loading Passages');
  const passages = await loadPassages();
  log(`Found ${passages.length} passages`);
  passages.forEach(p => {
    log(`  ${p.id} — ${p.title} (${p.difficulty}, ${p.wordCount} words)`);
  });

  // Create output directory
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Generate audio for each passage
  logHeader('Generating Audio');
  const manifest: Manifest = {
    generated: new Date().toISOString(),
    voice: voice,
    model: 'kokoro-82m',
    format: RESPONSE_FORMAT,
    kokoro_url: KOKORO_URL,
    total_passages: passages.length,
    total_duration_seconds: 0,
    files: {},
  };

  let generated = 0;
  let skipped = 0;

  for (const passage of passages) {
    const outputPath = join(OUTPUT_DIR, `${passage.id}.mp3`);
    
    // Skip if exists and not regenerating
    if (!regenerate && existsSync(outputPath)) {
      const stats = readFileSync(outputPath);
      log(`SKIP  ${passage.id}.mp3 (exists, ${stats.length} bytes)`);
      
      // Still add to manifest
      const speed = SPEED_MAP[passage.difficulty] || 1.0;
      const durationSeconds = Math.round((passage.wordCount / (150 * speed)) * 60);
      manifest.files[passage.id] = {
        id: passage.id,
        title: passage.title,
        difficulty: passage.difficulty,
        format: passage.format,
        topic: passage.topic,
        duration_seconds: durationSeconds,
        word_count: passage.wordCount,
        speed: speed,
        voice: voice,
        file_size_bytes: stats.length,
        generated_at: 'previously generated',
      };
      manifest.total_duration_seconds += durationSeconds;
      skipped++;
      continue;
    }

    log(`GEN   ${passage.id} — "${passage.title}"...`);
    
    try {
      const { buffer, duration } = await generateAudio(passage, voice);
      writeFileSync(outputPath, buffer);
      
      manifest.files[passage.id] = {
        id: passage.id,
        title: passage.title,
        difficulty: passage.difficulty,
        format: passage.format,
        topic: passage.topic,
        duration_seconds: duration,
        word_count: passage.wordCount,
        speed: SPEED_MAP[passage.difficulty] || 1.0,
        voice: voice,
        file_size_bytes: buffer.length,
        generated_at: new Date().toISOString(),
      };
      manifest.total_duration_seconds += duration;
      
      log(`  ✓ Saved: ${passage.id}.mp3 (${(buffer.length / 1024).toFixed(1)} KB, ~${duration}s)`);
      generated++;
      
      // Brief pause between generations to avoid overloading CPU
      await sleep(1000);
    } catch (error) {
      console.error(`  ✗ FAILED: ${passage.id} — ${error}`);
      // Continue with other passages
    }
  }

  // Write manifest
  const manifestPath = join(OUTPUT_DIR, 'manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  // Summary
  logHeader('Complete');
  log(`Generated: ${generated} files`);
  log(`Skipped:   ${skipped} files (already exist)`);
  log(`Total:     ${passages.length} passages`);
  log(`Duration:  ~${Math.round(manifest.total_duration_seconds / 60)} minutes of audio`);
  log(`Output:    ${OUTPUT_DIR}`);
  log(`Manifest:  ${manifestPath}`);
  console.log('\n═══════════════════════════════════════════════════════\n');
}

// Run
main().catch(err => {
  console.error('\nFATAL:', err.message || err);
  process.exit(1);
});
