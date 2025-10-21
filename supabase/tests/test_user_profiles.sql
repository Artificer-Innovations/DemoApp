-- Database tests for user_profiles table
-- These tests verify the schema, constraints, and RLS policies

BEGIN;

-- Plan for all tests (only one plan() call allowed)
SELECT plan(13);

-- Test 1: Verify user_profiles table exists
SELECT has_table('public', 'user_profiles', 'user_profiles table should exist');

-- Test 2: Verify table structure
SELECT has_column('public', 'user_profiles', 'id', 'id column should exist');
SELECT has_column('public', 'user_profiles', 'user_id', 'user_id column should exist');
SELECT has_column('public', 'user_profiles', 'username', 'username column should exist');
SELECT has_column('public', 'user_profiles', 'display_name', 'display_name column should exist');
SELECT has_column('public', 'user_profiles', 'bio', 'bio column should exist');
SELECT has_column('public', 'user_profiles', 'avatar_url', 'avatar_url column should exist');
SELECT has_column('public', 'user_profiles', 'created_at', 'created_at column should exist');
SELECT has_column('public', 'user_profiles', 'updated_at', 'updated_at column should exist');

-- Test 3: Verify constraints
SELECT col_is_pk('public', 'user_profiles', 'id', 'id should be primary key');
SELECT col_is_unique('public', 'user_profiles', 'user_id', 'user_id should be unique');
SELECT col_is_unique('public', 'user_profiles', 'username', 'username should be unique');

-- Test 4: Verify RLS is enabled (using a simple query instead of row_security_on)
SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_class 
    WHERE relname = 'user_profiles' 
    AND relrowsecurity = true
  ),
  'RLS should be enabled on user_profiles table'
);

ROLLBACK;
