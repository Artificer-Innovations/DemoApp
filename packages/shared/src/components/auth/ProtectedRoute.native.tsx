import { ReactNode, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthContext } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: 'Login' | 'Signup' | 'Home';
}

/**
 * ProtectedRoute component for mobile (React Navigation)
 * Redirects unauthenticated users to the login screen
 */
export function ProtectedRoute({ children, redirectTo = 'Login' }: ProtectedRouteProps) {
  const auth = useAuthContext();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    // Redirect to login if not authenticated (after loading completes)
    // Add small delay to ensure navigation context is fully initialized
    if (!auth.loading && !auth.user && navigation) {
      const timer = setTimeout(() => {
        try {
          navigation.replace(redirectTo);
        } catch (error) {
          console.warn('[ProtectedRoute] Navigation error:', error);
        }
      }, 100); // Small delay to ensure navigation is ready
      
      return () => clearTimeout(timer);
    }
  }, [auth.loading, auth.user, navigation, redirectTo]);

  // Show loading state while checking authentication
  if (auth.loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show loading state while redirecting (to avoid blank screen)
  if (!auth.user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Redirecting...</Text>
      </View>
    );
  }

  // Render protected content if authenticated
  // Use View wrapper instead of fragment for better Android compatibility
  return <View style={{ flex: 1 }}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
});
