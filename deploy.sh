#!/bin/bash
# ═══════════════════════════════════════════════════════════
# EMPIRE ENGLISH COMMUNITY — Z.ai Placement Test Deployer
# Run on Hetzner server to deploy/update the assessment app
# ═══════════════════════════════════════════════════════════

set -e

APP_DIR="/opt/empire-assessment"
REPO_URL="https://github.com/empireenglishcommunity-glitch/zai-placement-test.git"

echo "═══════════════════════════════════════════════════"
echo " Empire Assessment — Deployment Script"
echo "═══════════════════════════════════════════════════"
echo ""

# Create directory if first run
if [ ! -d "$APP_DIR" ]; then
    echo "📁 First deployment — cloning repository..."
    mkdir -p "$APP_DIR"
    git clone "$REPO_URL" "$APP_DIR"
else
    echo "📥 Pulling latest changes..."
    cd "$APP_DIR"
    git pull origin main
fi

cd "$APP_DIR"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "🔐 Creating .env file..."
    cat > .env << 'EOF'
NEXTAUTH_SECRET=CHANGE_ME_generate_with_openssl_rand_base64_32
NEXTAUTH_URL=https://assessment.empireenglish.online
GEMINI_API_KEY=CHANGE_ME_add_your_gemini_api_key_here
EOF
    echo "   ✅ .env created with placeholder values"
    echo ""
    echo "   ⚠️  IMPORTANT: Edit /opt/empire-assessment/.env and add your real keys!"
    echo "   Run: nano /opt/empire-assessment/.env"
    echo ""
fi

# Build and start
echo ""
echo "🐳 Building Docker image (this may take 2-3 minutes)..."
docker compose down 2>/dev/null || true
docker compose up -d --build

echo ""
echo "⏳ Waiting for container to be healthy..."
sleep 5

# Check if running
if docker ps | grep -q "empire-assessment"; then
    echo ""
    echo "═══════════════════════════════════════════════════"
    echo " ✅ DEPLOYMENT SUCCESSFUL!"
    echo "═══════════════════════════════════════════════════"
    echo ""
    echo " Container: empire-assessment"
    echo " Port:      3100 (internal 3000)"
    echo " Status:    $(docker inspect --format='{{.State.Status}}' empire-assessment)"
    echo ""
    echo " Next step: Configure Cloudflare Tunnel to route"
    echo " assessment.empireenglish.online → localhost:3100"
    echo ""
else
    echo "❌ Container failed to start. Check logs:"
    echo "   docker logs empire-assessment"
    exit 1
fi
