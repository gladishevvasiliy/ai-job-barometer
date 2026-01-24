-- Create Specialty Enum
CREATE TYPE specialty AS ENUM (
  'frontend', 
  'backend', 
  'qa', 
  'devops', 
  'mobile', 
  'data_science', 
  'ml_engineer', 
  'designer', 
  'pm'
);

-- Create Vote Type Enum
CREATE TYPE vote_type AS ENUM ('working', 'ai_replaced');

-- Create User Profiles table
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  provider TEXT NOT NULL,
  display_name TEXT,
  specialty specialty,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Votes table
CREATE TABLE public.votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  vote_type vote_type NOT NULL,
  specialty specialty NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view all profiles" 
  ON public.user_profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "System can insert profiles" 
  ON public.user_profiles FOR INSERT WITH CHECK (true);

-- Policies for votes
CREATE POLICY "Anyone can view votes" 
  ON public.votes FOR SELECT USING (true);

CREATE POLICY "Users can insert their own vote" 
  ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vote" 
  ON public.votes FOR UPDATE USING (
    auth.uid() = user_id AND 
    (updated_at + interval '30 days') < NOW()
  );

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, provider, display_name)
  VALUES (
    NEW.id, 
    NEW.raw_app_meta_data->>'provider', 
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
