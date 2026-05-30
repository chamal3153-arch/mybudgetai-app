-- Run ALL of this in Supabase Dashboard > SQL Editor > New Query

-- 1. Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  email_reminders BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (new.id, new.email) ON CONFLICT DO NOTHING;
  RETURN new;
END;
$$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Plans
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT, age INTEGER, country TEXT, currency TEXT, currency_code TEXT,
  income NUMERIC, expenses NUMERIC DEFAULT 0, savings NUMERIC DEFAULT 0, debt NUMERIC DEFAULT 0,
  goal TEXT, timeframe TEXT, risk INTEGER DEFAULT 5,
  free_data JSONB, premium_data JSONB,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own plans" ON public.plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role full access on plans" ON public.plans TO service_role USING (true) WITH CHECK (true);

-- 3. Purchases
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_session_id TEXT UNIQUE,
  amount_cents INTEGER DEFAULT 500,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS purchases_email_idx ON public.purchases(email);
CREATE INDEX IF NOT EXISTS purchases_user_id_idx ON public.purchases(user_id);
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own purchases" ON public.purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role full access on purchases" ON public.purchases TO service_role USING (true) WITH CHECK (true);
