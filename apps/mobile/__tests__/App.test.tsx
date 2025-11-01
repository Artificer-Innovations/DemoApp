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
