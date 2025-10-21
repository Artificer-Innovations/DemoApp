-- Simple database tests for user_profiles table
BEGIN;

-- Plan for tests
SELECT plan(5);

-- Test 1: Verify user_profiles table exists
SELECT has_table('public', 'user_profiles', 'user_profiles table should exist');

-- Test 2: Verify key columns exist
SELECT has_column('public', 'user_profiles', 'id', 'id column should exist');
SELECT has_column('public', 'user_profiles', 'user_id', 'user_id column should exist');
SELECT has_column('public', 'user_profiles', 'username', 'username column should exist');

-- Test 3: Verify primary key
SELECT col_is_pk('public', 'user_profiles', 'id', 'id should be primary key');

ROLLBACK;
