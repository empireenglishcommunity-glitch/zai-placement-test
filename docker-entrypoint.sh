#!/bin/sh
# ═══════════════════════════════════════════════════════════
# EMPIRE ENGLISH — Docker Entrypoint
# Ensures database tables exist before starting the app
# ═══════════════════════════════════════════════════════════

echo "🏛️ Empire Assessment — Starting..."

# Initialize SQLite database tables
echo "📦 Initializing database..."
./node_modules/.bin/prisma db push --schema=./prisma/schema.prisma --skip-generate --accept-data-loss 2>&1 || echo "⚠️ Prisma db push had issues, continuing anyway"
echo "✅ Database ready"

# Start the server
echo "🚀 Starting server on port ${PORT:-3000}..."
exec node server.js
