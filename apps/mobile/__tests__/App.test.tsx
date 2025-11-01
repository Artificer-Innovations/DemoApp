// Mock the Supabase client module entirely
jest.mock('../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}));

// Mock AuthContext to avoid needing the full provider setup in tests
jest.mock('@shared/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: any) => children,
  useAuthContext: () => ({
    user: null,
    session: null,
    loading: false,
    error: null,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    signInWithOAuth: jest.fn(),
  }),
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: any) => children,
  useNavigation: () => ({
    navigate: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn(),
  }),
}));

jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }: any) => children,
      Screen: ({ component: Component, ...props }: any) => {
        if (Component) {
          // Create a mock navigation prop for screens that need it
          const mockNavigation = {
            navigate: jest.fn(),
            replace: jest.fn(),
            goBack: jest.fn(),
          };
          return <Component navigation={mockNavigation} {...props} />;
        }
        return null;
      },
    }),
  };
});

// Mock ProtectedRoute to avoid React Native component issues in tests
jest.mock('@shared/components/auth/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: any) => children,
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { describe, it, expect } from '@jest/globals';
import App from '../App';

describe('Mobile App', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<App />);
    
    // Check if the app content is rendered
    expect(getByText('Welcome to Demo App')).toBeTruthy();
  });

  it('renders subtitle text', () => {
    const { getByText } = render(<App />);
    
    // Check if subtitle is present
    expect(getByText('A modern full-stack application with React, React Native, and Supabase')).toBeTruthy();
  });
});
