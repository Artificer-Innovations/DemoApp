import { View, Text, StyleSheet, ViewStyle } from 'react-native';

export interface FormErrorProps {
  message: string;
  style?: ViewStyle;
}

/**
 * FormError component for React Native
 * Displays error messages in a styled container
 */
export function FormError({ message, style }: FormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <View style={[styles.container, style]} accessibilityRole='alert'>
      <Text style={styles.icon}>⚠</Text>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
    color: '#DC2626',
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#991B1B',
  },
});
