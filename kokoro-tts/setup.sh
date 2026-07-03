#!/bin/bash
# ═══════════════════════════════════════════════════════════
# EMPIRE ENGLISH — Kokoro TTS Setup Script
# Run on Hetzner VPS (77.42.43.250) to deploy Kokoro TTS
# ═══════════════════════════════════════════════════════════

set -e

INSTALL_DIR="/opt/kokoro-tts"
KOKORO_PORT=8880

echo "═══════════════════════════════════════════════════════"
echo "  EMPIRE ENGLISH — Kokoro TTS Deployment"
echo "═══════════════════════════════════════════════════════"
echo ""

# 1. Create directory
echo "[1/5] Creating installation directory..."
mkdir -p "$INSTALL_DIR"
cp docker-compose.yml "$INSTALL_DIR/"
cd "$INSTALL_DIR"

# 2. Pull the image
echo "[2/5] Pulling Kokoro TTS Docker image (CPU mode)..."
docker compose pull

# 3. Start the container
echo "[3/5] Starting Kokoro TTS container..."
docker compose up -d

# 4. Wait for startup (model loading takes ~60-90s on CPU)
echo "[4/5] Waiting for Kokoro to load model (this takes ~90 seconds)..."
echo "      Container: kokoro-tts | Port: $KOKORO_PORT"
sleep 10

# Poll until ready (max 3 minutes)
MAX_WAIT=180
WAITED=0
while [ $WAITED -lt $MAX_WAIT ]; do
  if curl -sf "http://localhost:$KOKORO_PORT/v1/audio/speech" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"model":"kokoro","input":"test","voice":"af_heart","response_format":"mp3"}' \
    -o /dev/null 2>/dev/null; then
    echo ""
    echo "  Kokoro TTS is READY!"
    break
  fi
  echo -n "."
  sleep 5
  WAITED=$((WAITED + 5))
done

if [ $WAITED -ge $MAX_WAIT ]; then
  echo ""
  echo "  WARNING: Kokoro did not respond within ${MAX_WAIT}s"
  echo "  Check logs: docker logs kokoro-tts"
  exit 1
fi

# 5. Test voice generation
echo ""
echo "[5/5] Testing voice generation..."
TEST_FILE="/tmp/kokoro-test.mp3"
HTTP_CODE=$(curl -sf -o "$TEST_FILE" -w "%{http_code}" \
  "http://localhost:$KOKORO_PORT/v1/audio/speech" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"model":"kokoro","input":"Today we are going to talk about photosynthesis, the process by which plants make their own food.","voice":"af_heart","response_format":"mp3","speed":0.9}')

if [ "$HTTP_CODE" = "200" ] && [ -s "$TEST_FILE" ]; then
  FILE_SIZE=$(stat -f%z "$TEST_FILE" 2>/dev/null || stat -c%s "$TEST_FILE" 2>/dev/null)
  echo "  Test audio generated: ${FILE_SIZE} bytes"
  echo "  File: $TEST_FILE (play to verify quality)"
  echo ""
  echo "═══════════════════════════════════════════════════════"
  echo "  DEPLOYMENT COMPLETE"
  echo "═══════════════════════════════════════════════════════"
  echo ""
  echo "  Container: kokoro-tts"
  echo "  Port:      $KOKORO_PORT (localhost only)"
  echo "  API:       POST http://localhost:$KOKORO_PORT/v1/audio/speech"
  echo "  Voice:     af_heart (default)"
  echo "  Format:    mp3"
  echo ""
  echo "  Available voices:"
  echo "    af_heart  — Female, warm, professional"
  echo "    af_bella  — Female, clear, neutral"  
  echo "    am_adam   — Male, professional, neutral"
  echo "    am_michael — Male, warm, conversational"
  echo ""
  echo "  Commands:"
  echo "    docker logs kokoro-tts           # View logs"
  echo "    docker restart kokoro-tts        # Restart"
  echo "    docker compose -f $INSTALL_DIR/docker-compose.yml down  # Stop"
  echo ""
  echo "  Next: Run 'npx tsx scripts/generate-listening-audio.ts'"
  echo "        to generate all listening passage audio files."
  echo ""
else
  echo "  ERROR: Test generation failed (HTTP $HTTP_CODE)"
  echo "  Check: docker logs kokoro-tts"
  exit 1
fi
