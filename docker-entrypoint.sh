#!/bin/sh
# ═══════════════════════════════════════════════════════════
# EMPIRE ENGLISH — Docker Entrypoint
# Ensures database tables exist before starting the app
# ═══════════════════════════════════════════════════════════

echo "🏛️ Empire Assessment — Starting..."

# Initialize SQLite database if it doesn't exist
if [ ! -f /app/db/assessment.db ]; then
  echo "📦 Creating database..."
  npx prisma db push --skip-generate 2>/dev/null || echo "⚠️ DB init skipped (will use stateless mode)"
  echo "✅ Database ready"
else
  echo "✅ Database exists"
fi

# Start the server
echo "🚀 Starting server on port ${PORT:-3000}..."
exec node server.js
