-- 1. Create channels table
CREATE TABLE public.channels (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    channel_name TEXT NOT NULL,
    handle TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Trigger to create a channel when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.channels (id, channel_name, handle, avatar_url)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'New Channel'), 
    COALESCE(new.raw_user_meta_data->>'handle', 'user_' || substr(new.id::text, 1, 8)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || new.id)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists to prevent errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Update videos table to use a foreign key linking user_id to channels(id)
ALTER TABLE public.videos ADD CONSTRAINT videos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.channels(id) ON DELETE CASCADE;

-- 4. Enable RLS on channels
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all channels
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.channels FOR SELECT
  USING ( true );

-- Allow users to update their own channel
CREATE POLICY "Users can update own channel."
  ON public.channels FOR UPDATE
  USING ( auth.uid() = id );
  
-- 5. Enable RLS on videos
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Videos are viewable by everyone."
  ON public.videos FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert own videos."
  ON public.videos FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update own videos."
  ON public.videos FOR UPDATE
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete own videos."
  ON public.videos FOR DELETE
  USING ( auth.uid() = user_id );
