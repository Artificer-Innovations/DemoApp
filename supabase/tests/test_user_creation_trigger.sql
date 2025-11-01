-- Test user creation trigger and profile generation
-- This test verifies that when a user is created in auth.users,
-- the trigger automatically creates a profile in user_profiles

BEGIN;

SELECT plan(8);

-- Test 1: Verify the trigger function exists
SELECT has_function(
    'public',
    'handle_new_user',
    'handle_new_user function should exist'
);

-- Test 2: Verify the generate_username function exists
SELECT has_function(
    'public',
    'generate_username',
    'generate_username function should exist'
);

-- Test 3: Verify the trigger exists
SELECT has_trigger(
    'auth',
    'users',
    'on_auth_user_created',
    'on_auth_user_created trigger should exist on auth.users'
);

-- Test 4: Test that generate_username returns valid format
SELECT matches(
    generate_username(),
    '^user_[a-f0-9]{8}$',
    'generate_username should return user_<8 hex chars>'
);

-- Test 5-8: Test the full trigger flow
-- Create a test user in auth.users and verify profile is created

-- Create a test user
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    aud,
    role
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'trigger-test@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"email":"trigger-test@example.com"}'::jsonb,
    now(),
    now(),
    'authenticated',
    'authenticated'
);

-- Test 5: Verify profile was created
SELECT ok(
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_id = '00000000-0000-0000-0000-000000000001'
    ),
    'Profile should be created automatically by trigger'
);

-- Test 6: Verify username was generated in correct format
SELECT matches(
    (SELECT username FROM public.user_profiles WHERE user_id = '00000000-0000-0000-0000-000000000001'),
    '^user_[a-f0-9]{8}$',
    'Profile should have auto-generated username in correct format'
);

-- Test 7: Verify display_name is set to email
SELECT is(
    (SELECT display_name FROM public.user_profiles WHERE user_id = '00000000-0000-0000-0000-000000000001'),
    'trigger-test@example.com',
    'Profile display_name should be set to user email'
);

-- Test 8: Verify profile user_id matches auth user id
SELECT is(
    (SELECT user_id::text FROM public.user_profiles WHERE user_id = '00000000-0000-0000-0000-000000000001'),
    '00000000-0000-0000-0000-000000000001',
    'Profile user_id should match auth.users id'
);

SELECT * FROM finish();

ROLLBACK;

