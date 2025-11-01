import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AuthHookReturn } from '../types/auth';

export function useAuth(supabaseClient: SupabaseClient): AuthHookReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get initial session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabaseClient]);

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    
    setLoading(false);
    
    if (error) {
      const errorObj = new Error(error.message);
      setError(errorObj);
      throw errorObj;
    }
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    });
    
    setLoading(false);
    
    if (error) {
      const errorObj = new Error(error.message);
      setError(errorObj);
      throw errorObj;
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    const { error } = await supabaseClient.auth.signOut();
    
    setLoading(false);
    
    if (error) {
      const errorObj = new Error(error.message);
      setError(errorObj);
      throw errorObj;
    }
  };

  const signInWithOAuth = async (
    provider: 'google' | 'apple'
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider,
    });
    
    setLoading(false);
    
    if (error) {
      const errorObj = new Error(error.message);
      setError(errorObj);
      throw errorObj;
    }
  };

  return {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
  };
}

