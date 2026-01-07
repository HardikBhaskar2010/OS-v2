# Supabase Setup Instructions for Love OS 💕

## Step 1: Run Database Schema

1. Go to your Supabase dashboard: https://app.supabase.com/project/wurbydnkogvqhvtzttlp
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire content from `/app/supabase-setup.sql` 
5. Paste it into the SQL Editor
6. Click **Run** to execute the schema

This will create:
- All necessary tables (users, moods, mood_reactions, letters, photos, questions, answers)
- Row Level Security (RLS) policies for data protection
- Indexes for performance
- Enable Realtime for instant mood updates
- Insert some romantic daily questions

## Step 2: Create User Accounts

After running the schema, you need to create two user accounts in Supabase:

### Option A: Using Supabase Dashboard (Recommended)

1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Click **Add user** → **Create new user**
3. Create Hardik's account:
   - Email: `hardik@loveos.local` (or your preferred email)
   - Password: (choose a secure password)
   - Auto confirm: ✓ (check this box)
4. Click **Create user**
5. Repeat for Saumya:
   - Email: `saumya@loveos.local` (or your preferred email)
   - Password: (choose a secure password)
   - Auto confirm: ✓

### Option B: Using SQL (Alternative)

Run this SQL in the SQL Editor (replace passwords):

```sql
-- Create Hardik's auth account
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  raw_app_meta_data,
  confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'hardik@loveos.local',
  crypt('YOUR_PASSWORD_HERE', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"username": "hardik"}'::jsonb,
  '{"provider": "email"}'::jsonb,
  ''
);

-- Create Saumya's auth account
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  raw_app_meta_data,
  confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'saumya@loveos.local',
  crypt('YOUR_PASSWORD_HERE', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"username": "saumya"}'::jsonb,
  '{"provider": "email"}'::jsonb,
  ''
);
```

## Step 3: Create User Profiles

After creating auth accounts, link them to the users table:

```sql
-- Get auth user IDs (run this to see the IDs)
SELECT id, email FROM auth.users;

-- Create user profiles (replace the auth_user_id values with actual IDs from above)
INSERT INTO public.users (auth_user_id, username, role, display_name, relationship_start, anniversary_date)
VALUES 
  ('HARDIK_AUTH_USER_ID_HERE', 'hardik', 'boyfriend', 'Hardik', '2024-02-14', '2024-05-14'),
  ('SAUMYA_AUTH_USER_ID_HERE', 'saumya', 'girlfriend', 'Saumya', '2024-02-14', '2024-05-14');

-- Link partners to each other
UPDATE public.users u1
SET partner_id = u2.id
FROM public.users u2
WHERE u1.username = 'hardik' AND u2.username = 'saumya';

UPDATE public.users u1
SET partner_id = u2.id
FROM public.users u2
WHERE u1.username = 'saumya' AND u2.username = 'hardik';
```

## Step 4: Enable Storage for Mood Photos

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Create a bucket named: `mood-photos`
4. Make it **Public** (so users can see each other's mood photos)
5. Click **Create bucket**

### Set Storage Policies

Go to **Policies** tab in the mood-photos bucket and add:

**Policy 1: Allow authenticated users to upload**
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'mood-photos');
```

**Policy 2: Allow public reads**
```sql
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'mood-photos');
```

**Policy 3: Allow users to delete their own files**
```sql
CREATE POLICY "Allow users to delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'mood-photos' AND owner = auth.uid());
```

## Step 5: Enable Realtime

1. Go to **Database** → **Replication** in your Supabase dashboard
2. Find the `moods` table and toggle **Realtime** to ON
3. Find the `mood_reactions` table and toggle **Realtime** to ON

## That's it! 🎉

Your Supabase backend is now fully configured for Love OS. The React app will automatically connect using the credentials in `/app/frontend/.env`.

## Testing the Setup

After completing the above steps, you should be able to:
1. Login with either account
2. See personalized dashboards
3. Share moods in real-time
4. Upload mood photos
5. React to partner's moods
6. View mood history
7. Use all other features (letters, photos, questions)

## Credentials Summary

- **Supabase URL**: https://wurbydnkogvqhvtzttlp.supabase.co
- **Hardik's Login**: hardik@loveos.local (or your chosen email)
- **Saumya's Login**: saumya@loveos.local (or your chosen email)
- **Frontend .env**: Already configured at `/app/frontend/.env`
