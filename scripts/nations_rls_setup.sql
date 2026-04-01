-- Enable Row Level Security (RLS) for the nations table
ALTER TABLE public.nations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to view all nations
CREATE POLICY "Anon Select" ON public.nations
  FOR SELECT
  USING (true);

-- Allow anonymous users to insert new nations (if applicable)
CREATE POLICY "Anon Insert" ON public.nations
  FOR INSERT
  WITH CHECK (true);

-- Allow anonymous users to update their nation (name, flag)
-- In a fully secure setup, this would verify the user, but since passcodes are used
-- and there's no native Supabase auth token matching the passcode right now,
-- we allow updates. The app checks passcodes before making the update request.
CREATE POLICY "Student Update Own Nation" ON public.nations
  FOR UPDATE
  USING (user_id = current_setting('app.user_id')::int);