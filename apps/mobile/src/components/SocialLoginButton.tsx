import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface SocialLoginButtonProps {
  onPress: () => Promise<void>;
  mode?: 'signin' | 'signup';
}

export function SocialLoginButton({
  onPress,
  mode = 'signin',
}: SocialLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    setIsLoading(true);
    try {
      await onPress();
    } catch (error) {
      console.warn('Google sign-in error:', error);
      // Error is already handled by useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  const actionText = mode === 'signin' ? 'Sign in' : 'Sign up';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles.googleButton,
        isLoading && styles.buttonDisabled,
      ]}
      onPress={handlePress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#374151" />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.icon, styles.googleText]}>🔍</Text>
          <Text style={[styles.text, styles.googleText]}>
            {actionText} with Google
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    minHeight: 48,
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  googleText: {
    color: '#374151',
  },
});

