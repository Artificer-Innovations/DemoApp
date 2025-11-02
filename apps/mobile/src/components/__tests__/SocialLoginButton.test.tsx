import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { SocialLoginButton } from '../SocialLoginButton';

describe('SocialLoginButton', () => {
  const mockOnPress = jest.fn<Promise<void>, []>();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign-in copy by default', () => {
    const { getByText } = render(<SocialLoginButton onPress={mockOnPress} />);

    expect(getByText('Sign in with Google')).toBeTruthy();
  });

  it('renders sign-up copy when mode is signup', () => {
    const { getByText } = render(
      <SocialLoginButton onPress={mockOnPress} mode="signup" />
    );

    expect(getByText('Sign up with Google')).toBeTruthy();
  });

  it('invokes onPress exactly once per tap and shows loading state', async () => {
    let resolvePress: () => void;
    const pressPromise = new Promise<void>((resolve) => {
      resolvePress = resolve;
    });
    mockOnPress.mockReturnValueOnce(pressPromise);

    const { getByText, queryByText } = render(
      <SocialLoginButton onPress={mockOnPress} />
    );

    await act(async () => {
      fireEvent.press(getByText('Sign in with Google'));
      await waitFor(() => expect(queryByText('Sign in with Google')).toBeNull());
    });

    expect(mockOnPress).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolvePress!();
      await pressPromise;
    });

    // Button should be tappable again after promise resolves
    mockOnPress.mockResolvedValueOnce();

    await act(async () => {
      fireEvent.press(getByText('Sign in with Google'));
      await waitFor(() => expect(mockOnPress).toHaveBeenCalledTimes(2));
    });
  });

  it('logs a warning when onPress rejects', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const errorPromise = Promise.reject(new Error('Google failure'));
    mockOnPress.mockReturnValueOnce(errorPromise);

    const { getByText } = render(<SocialLoginButton onPress={mockOnPress} />);

    await act(async () => {
      fireEvent.press(getByText('Sign in with Google'));
      try {
        await errorPromise;
      } catch (err) {
        // expected rejection
      }
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Google sign-in error:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});


