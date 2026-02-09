-- ১. ইউজার টেবিল ও কলাম সেটআপ (Users Table with Profile Picture support)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  tokens INTEGER DEFAULT 10,
  avatar_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_banned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- কলামগুলো নিশ্চিত করা (Add Missing Columns if not exist)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS tokens INTEGER DEFAULT 10;

-- ২. প্যাকেজ টেবিল (Packages Table)
CREATE TABLE IF NOT EXISTS public.packages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tokens INTEGER NOT NULL,
  price INTEGER NOT NULL,
  color TEXT DEFAULT 'cyan',
  icon TEXT DEFAULT 'Package',
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ৩. ট্রানজেকশন টেবিল (Transactions Table)
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  package_id uuid REFERENCES public.packages(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  trx_id TEXT,
  screenshot_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ৪. অ্যাক্টিভিটি লগ টেবিল (Activity Logs Table)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id TEXT,
  admin_email TEXT,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ৫. রিয়েল-টাইম পাবলিকেশন ফিক্স (ERROR 42710 Solution)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'transactions'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
    END IF;
END $$;

-- ৬. সিকিউরিটি পলিসি (RLS & Secure Policies - Fixed 'admin_list' error)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ইউজার প্রোফাইল পলিসি
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- এডমিন ইউজার ম্যানেজমেন্ট পলিসি (Hardcoded Admin List)
DROP POLICY IF EXISTS "Admins view all users" ON public.users;
CREATE POLICY "Admins view all users" ON public.users FOR SELECT 
USING (auth.jwt() ->> 'email' = ANY(ARRAY['rajshahi.shojib@gmail.com', 'rajshahi.jibon@gmail.com', 'rajshahi.sumi@gmail.com']));

DROP POLICY IF EXISTS "Admins can update any user" ON public.users;
CREATE POLICY "Admins can update any user" ON public.users FOR UPDATE 
USING (auth.jwt() ->> 'email' = ANY(ARRAY['rajshahi.shojib@gmail.com', 'rajshahi.jibon@gmail.com', 'rajshahi.sumi@gmail.com']));

-- প্যাকেজ পলিসি
DROP POLICY IF EXISTS "Anyone can view packages" ON public.packages;
CREATE POLICY "Anyone can view packages" ON public.packages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage packages" ON public.packages;
CREATE POLICY "Admins manage packages" ON public.packages FOR ALL 
USING (auth.jwt() ->> 'email' = ANY(ARRAY['rajshahi.shojib@gmail.com', 'rajshahi.jibon@gmail.com', 'rajshahi.sumi@gmail.com']));

-- ট্রানজেকশন পলিসি
DROP POLICY IF EXISTS "Users view own transactions" ON public.transactions;
CREATE POLICY "Users view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to create transactions" ON public.transactions;
CREATE POLICY "Allow users to create transactions" ON public.transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage transactions" ON public.transactions;
CREATE POLICY "Admins manage transactions" ON public.transactions FOR ALL 
USING (auth.jwt() ->> 'email' = ANY(ARRAY['rajshahi.shojib@gmail.com', 'rajshahi.jibon@gmail.com', 'rajshahi.sumi@gmail.com']));

-- লগ পলিসি
DROP POLICY IF EXISTS "Admins view logs" ON public.activity_logs;
CREATE POLICY "Admins view logs" ON public.activity_logs FOR SELECT 
USING (auth.jwt() ->> 'email' = ANY(ARRAY['rajshahi.shojib@gmail.com', 'rajshahi.jibon@gmail.com', 'rajshahi.sumi@gmail.com']));

DROP POLICY IF EXISTS "Admins can insert logs" ON public.activity_logs;
CREATE POLICY "Admins can insert logs" ON public.activity_logs FOR INSERT 
WITH CHECK (auth.jwt() ->> 'email' = ANY(ARRAY['rajshahi.shojib@gmail.com', 'rajshahi.jibon@gmail.com', 'rajshahi.sumi@gmail.com']));

-- ৭. অটোমেটিক প্রোফাইল তৈরির ট্রিগার (Profile Creation on Sign-up)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, email, name, tokens)
  VALUES (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
    10
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ৮. ডামি প্যাকেজ ইনসার্ট (Seed Data)
INSERT INTO public.packages (name, tokens, price, color, icon, is_popular)
VALUES 
('Developer Starter', 50, 500, 'cyan', 'Package', false),
('Pro Builder', 250, 1500, 'purple', 'Rocket', true),
('Agency Master', 1200, 5000, 'amber', 'Cpu', false)
ON CONFLICT DO NOTHING;