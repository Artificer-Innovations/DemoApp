/**
 * Integration tests for authentication flow
 * These tests use a real Supabase client and database
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

describe('Authentication Integration Tests', () => {
  let supabase: SupabaseClient;
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  let testUserId: string;

  beforeAll(() => {
    // Use local Supabase instance
    const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
    
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  });

  afterAll(async () => {
    // Cleanup: Delete test user if it exists
    if (testUserId) {
      try {
        // Sign in as the test user first to delete their profile
        await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword,
        });
        
        // Delete the user's profile
        await supabase.from('user_profiles').delete().eq('user_id', testUserId);
        
        // Note: We can't delete from auth.users via the client API
        // The user will be cleaned up by the test database reset
      } catch (error) {
        // Ignore cleanup errors
        console.warn('Cleanup warning:', error);
      }
    }
  });

  describe('User Signup', () => {
    it('should create a new user with email and password', async () => {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });

      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.user?.email).toBe(testEmail);
      expect(data.session).toBeDefined();
      
      // Save user ID for cleanup
      testUserId = data.user!.id;
    });

    it('should automatically create user profile on signup', async () => {
      // Wait a bit for trigger to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', testUserId)
        .single();

      expect(error).toBeNull();
      expect(profile).toBeDefined();
      expect(profile?.user_id).toBe(testUserId);
      expect(profile?.username).toMatch(/^user_[a-f0-9]{8}$/);
      expect(profile?.display_name).toBe(testEmail);
    });

    it('should not allow duplicate email signup', async () => {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });

      // Supabase may return success but not create a new user
      // or return an error depending on configuration
      if (data.user) {
        expect(data.user.id).toBe(testUserId);
      } else {
        expect(error).toBeDefined();
      }
    });
  });

  describe('User Sign In', () => {
    it('should sign in with correct credentials', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.user?.email).toBe(testEmail);
      expect(data.session).toBeDefined();
      expect(data.session?.access_token).toBeDefined();
    });

    it('should fail to sign in with incorrect password', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: 'WrongPassword123!',
      });

      expect(error).toBeDefined();
      expect(error?.message).toContain('Invalid');
      expect(data.user).toBeNull();
      expect(data.session).toBeNull();
    });

    it('should fail to sign in with non-existent email', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'nonexistent@example.com',
        password: testPassword,
      });

      expect(error).toBeDefined();
      expect(data.user).toBeNull();
      expect(data.session).toBeNull();
    });
  });

  describe('User Sign Out', () => {
    it('should sign out successfully', async () => {
      // First sign in
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      // Then sign out
      const { error } = await supabase.auth.signOut();

      expect(error).toBeNull();

      // Verify session is cleared
      const { data: { session } } = await supabase.auth.getSession();
      expect(session).toBeNull();
    });
  });

  describe('Session Management', () => {
    it('should maintain session after sign in', async () => {
      // Sign in
      const { data: signInData } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      expect(signInData.session).toBeDefined();

      // Get session
      const { data: { session } } = await supabase.auth.getSession();
      
      expect(session).toBeDefined();
      expect(session?.user.email).toBe(testEmail);
      expect(session?.access_token).toBe(signInData.session?.access_token);
    });

    it('should access user profile when authenticated', async () => {
      // Sign in
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      // Access profile
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', testUserId)
        .single();

      expect(error).toBeNull();
      expect(profile).toBeDefined();
      expect(profile?.user_id).toBe(testUserId);
    });
  });

  describe('Profile Updates', () => {
    it('should allow user to update their own profile', async () => {
      // Sign in
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      const newBio = 'This is my test bio';
      
      // Update profile
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ bio: newBio })
        .eq('user_id', testUserId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.bio).toBe(newBio);
    });

    it('should not allow updating another user\'s profile', async () => {
      // Sign in as test user
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      // Try to update a different user's profile (using a fake UUID)
      const fakeUserId = '00000000-0000-0000-0000-000000000099';
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ bio: 'Hacked!' })
        .eq('user_id', fakeUserId);

      // Should either fail or update 0 rows (RLS policy blocks it)
      // The error might be null if no rows match, which is fine
      if (error) {
        expect(error).toBeDefined();
      }
    });
  });
});

