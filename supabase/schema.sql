-- ═══════════════════════════════════════════════════════════
-- EMPIRE ENGLISH COMMUNITY — Supabase PostgreSQL Schema
-- ═══════════════════════════════════════════════════════════
-- 
-- INSTRUCTIONS:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire file
-- 4. Click "Run" to execute
-- 5. Enable Row Level Security (RLS) is already included below
--
-- ═══════════════════════════════════════════════════════════

-- ─── Enable UUID Extension ────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Profiles Table (extends auth.users) ──────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  current_level INTEGER DEFAULT 0,
  assessment_count INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  last_active_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Assessments Table ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  current_module TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  
  -- Speaking scores
  sp_pronunciation FLOAT,
  sp_fluency FLOAT,
  sp_words_per_minute FLOAT,
  sp_phoneme_accuracy FLOAT,
  sp_grammar_accuracy FLOAT,
  sp_vocab_range FLOAT,
  sp_confidence FLOAT,
  sp_rhythm_match FLOAT,
  sp_overall FLOAT,
  sp_level INTEGER,
  
  -- Listening scores
  li_literal FLOAT,
  li_inference FLOAT,
  li_detail FLOAT,
  li_overall FLOAT,
  li_level INTEGER,
  
  -- Vocabulary scores
  vo_band_1 FLOAT,
  vo_band_2 FLOAT,
  vo_band_3 FLOAT,
  vo_band_4 FLOAT,
  vo_band_5 FLOAT,
  vo_estimated_size FLOAT,
  vo_overall FLOAT,
  vo_level INTEGER,
  
  -- Grammar scores
  gr_percentage FLOAT,
  gr_level INTEGER,
  
  -- Final result
  assigned_level INTEGER,
  flagged BOOLEAN DEFAULT false,
  flag_reason TEXT
);

-- ─── Recordings Table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module TEXT NOT NULL,
  part TEXT,
  audio_url TEXT NOT NULL,
  duration FLOAT,
  transcript TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Answers Table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
  module TEXT NOT NULL,
  question_id UUID,
  selected_answer INTEGER,
  is_correct BOOLEAN,
  time_taken INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Questions Bank ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module TEXT NOT NULL,
  type TEXT,
  topic TEXT,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  difficulty INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Review Flags ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.review_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  resolved BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Admin Notes ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON public.assessments(status);
CREATE INDEX IF NOT EXISTS idx_recordings_assessment_id ON public.recordings(assessment_id);
CREATE INDEX IF NOT EXISTS idx_answers_assessment_id ON public.answers(assessment_id);
CREATE INDEX IF NOT EXISTS idx_answers_module ON public.answers(module);
CREATE INDEX IF NOT EXISTS idx_questions_module ON public.questions(module);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON public.questions(topic);
CREATE INDEX IF NOT EXISTS idx_questions_active ON public.questions(is_active);
CREATE INDEX IF NOT EXISTS idx_review_flags_resolved ON public.review_flags(resolved);
CREATE INDEX IF NOT EXISTS idx_review_flags_user_id ON public.review_flags(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_notes_target ON public.admin_notes(target_user_id);

-- ═══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ═══════════════════════════════════════════════════════════

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));

-- Assessments
CREATE POLICY "Users can read own assessments" ON public.assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessments" ON public.assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assessments" ON public.assessments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all assessments" ON public.assessments FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));

-- Recordings
CREATE POLICY "Users can read own recordings" ON public.recordings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recordings" ON public.recordings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can read all recordings" ON public.recordings FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));

-- Answers
CREATE POLICY "Users can read own answers" ON public.answers FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.assessments WHERE id = assessment_id));
CREATE POLICY "Users can insert own answers" ON public.answers FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.assessments WHERE id = assessment_id));
CREATE POLICY "Admins can read all answers" ON public.answers FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));

-- Questions
CREATE POLICY "Authenticated users can read active questions" ON public.questions FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);
CREATE POLICY "Admins can insert questions" ON public.questions FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));
CREATE POLICY "Admins can update questions" ON public.questions FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));
CREATE POLICY "Admins can delete questions" ON public.questions FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));

-- Review Flags
CREATE POLICY "Admins can read all flags" ON public.review_flags FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));
CREATE POLICY "System can insert flags" ON public.review_flags FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update flags" ON public.review_flags FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));

-- Admin Notes
CREATE POLICY "Admins can read all notes" ON public.admin_notes FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));
CREATE POLICY "Admins can insert notes" ON public.admin_notes FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));

-- ═══════════════════════════════════════════════════════════
-- TRIGGER: Auto-create profile on user signup
-- ═══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ═══════════════════════════════════════════════════════════
-- TRIGGER: Auto-update updated_at timestamp
-- ═══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
