import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@shared/contexts/AuthContext';
import { configureGoogleSignIn } from '@shared/hooks/useAuth';
import { supabase } from './src/lib/supabase';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return (
    <AuthProvider supabaseClient={supabase}>
      <AppNavigator />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}