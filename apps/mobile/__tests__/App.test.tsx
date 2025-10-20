import React from 'react';
import { render } from '@testing-library/react-native';
import { describe, it, expect } from '@jest/globals';
import App from '../App';

describe('Mobile App', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<App />);
    
    // Check if the app content is rendered
    expect(getByText('Mobile App Works!')).toBeTruthy();
  });

  it('renders subtitle text', () => {
    const { getByText } = render(<App />);
    
    // Check if subtitle is present
    expect(getByText('Testing minimal setup')).toBeTruthy();
  });
});
