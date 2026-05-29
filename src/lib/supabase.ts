// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH COMMUNITY — Supabase Client Configuration
// ═══════════════════════════════════════════════════════════
//
// When migrating to Supabase, replace the Prisma-based database
// access with Supabase client. This file provides the client
// configuration for when you're ready to switch.
//
// STEP 1: Install @supabase/supabase-js
// STEP 2: Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
// STEP 3: Uncomment and use the client below
// STEP 4: Run supabase/schema.sql in the Supabase SQL Editor
// ═══════════════════════════════════════════════════════════

// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── For now, we use Prisma ──────────────────────────────
// The Prisma client is available at @/lib/db
// import { db } from '@/lib/db';

export const SUPABASE_READY = false;

export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    isConfigured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  };
}
