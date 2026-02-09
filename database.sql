
-- ১. ইউজার টেবিল ও কলাম সেটআপ
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

-- কলামগুলো নিশ্চিত করা
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS tokens INTEGER DEFAULT 10;

-- ২. প্যাকেজ টেবিল
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

-- ৩. ট্রানজেকশন টেবিল
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  package_id uuid REFERENCES public.packages(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  trx_id TEXT,
  screenshot_url TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ৪. অ্যাক্টিভিটি লগ টেবিল
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id TEXT,
  admin_email TEXT,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ৫. অটোমেটিক লগিং ট্রিগার (NEW!)
-- এই ফাংশনটি ইউজারের টোকেন বা স্ট্যাটাস পরিবর্তন হলে অটো লগ এন্ট্রি করবে
CREATE OR REPLACE FUNCTION public.log_user_updates()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
    admin_email_from_jwt TEXT;
BEGIN
    -- JWT থেকে এডমিন ইমেইল নেওয়ার চেষ্টা
    BEGIN
        admin_email_from_jwt := auth.jwt() ->> 'email';
    EXCEPTION WHEN OTHERS THEN
        admin_email_from_jwt := 'SYSTEM';
    END;

    IF admin_email_from_jwt IS NULL THEN
        admin_email_from_jwt := 'SYSTEM_TRIGGER';
    END IF;

    -- টোকেন আপডেট চেক
    IF OLD.tokens <> NEW.tokens THEN
        INSERT INTO public.activity_logs (admin_email, action, details)
        VALUES (admin_email_from_jwt, 'TOKEN_UPDATE', 'User: ' || NEW.email || ' | ' || OLD.tokens || ' -> ' || NEW.tokens);
    END IF;

    -- ব্যান স্ট্যাটাস চেক
    IF OLD.is_banned <> NEW.is_banned THEN
        INSERT INTO public.activity_logs (admin_email, action, details)
        VALUES (admin_email_from_jwt, CASE WHEN NEW.is_banned THEN 'USER_SUSPEND' ELSE 'USER_UNSUSPEND' END, 'User: ' || NEW.email);
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_user_update_log ON public.users;
CREATE TRIGGER on_user_update_log
  AFTER UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.log_user_updates();

-- ৬. প্যাকেজ ম্যানেজমেন্ট লগ ট্রিগার
CREATE OR REPLACE FUNCTION public.log_package_changes()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
    admin_email_from_jwt TEXT;
BEGIN
    BEGIN
        admin_email_from_jwt := auth.jwt() ->> 'email';
    EXCEPTION WHEN OTHERS THEN
        admin_email_from_jwt := 'SYSTEM';
    END;

    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.activity_logs (admin_email, action, details)
        VALUES (admin_email_from_jwt, 'PACKAGE_CREATE', 'Name: ' || NEW.name || ' | Price: ' || NEW.price);
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.activity_logs (admin_email, action, details)
        VALUES (admin_email_from_jwt, 'PACKAGE_MODIFY', 'Modified: ' || NEW.name);
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.activity_logs (admin_email, action, details)
        VALUES (admin_email_from_jwt, 'PACKAGE_DELETE', 'Deleted: ' || OLD.name);
    END IF;
    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS on_package_change_log ON public.packages;
CREATE TRIGGER on_package_change_log
  AFTER INSERT OR UPDATE OR DELETE ON public.packages
  FOR EACH ROW EXECUTE PROCEDURE public.log_package_changes();

-- ৭. রিয়েল-টাইম পাবলিকেশন ফিক্স
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
    
    -- ইউজারের টোকেন আপডেটের জন্য 'users' টেবিলকেও রিয়েল-টাইমে যোগ করা হলো
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
END $$;

-- ৮. সিকিউরিটি পলিসি (RLS & Secure Policies with Ban Check)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ইউজার প্রোফাইল পলিসি (ব্যান চেক সহ)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT 
USING (auth.uid() = id AND is_banned = false);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE 
USING (auth.uid() = id AND is_banned = false);

-- এডমিন ইউজার ম্যানেজমেন্ট পলিসি
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

-- ট্রানজেকশন পলিসি (ব্যান চেক সহ)
DROP POLICY IF EXISTS "Users view own transactions" ON public.transactions;
CREATE POLICY "Users view own transactions" ON public.transactions FOR SELECT 
USING (auth.uid() = user_id AND (SELECT is_banned FROM users WHERE id = auth.uid()) = false);

DROP POLICY IF EXISTS "Allow users to create transactions" ON public.transactions;
CREATE POLICY "Allow users to create transactions" ON public.transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id AND (SELECT is_banned FROM users WHERE id = auth.uid()) = false);

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

-- ৯. অটোমেটিক প্রোফাইল তৈরির ট্রিগার
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
