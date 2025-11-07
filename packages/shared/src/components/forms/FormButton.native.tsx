import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

export interface FormButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * FormButton component for React Native
 * Provides a styled button with loading and disabled states
 */
export function FormButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  fullWidth = true,
  style,
  textStyle,
}: FormButtonProps) {
  const isDisabled = disabled || loading;

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#4F46E5',
          textColor: '#FFFFFF',
        };
      case 'secondary':
        return {
          backgroundColor: '#E5E7EB',
          textColor: '#111827',
        };
      case 'danger':
        return {
          backgroundColor: '#DC2626',
          textColor: '#FFFFFF',
        };
      default:
        return {
          backgroundColor: '#4F46E5',
          textColor: '#FFFFFF',
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        {
          backgroundColor: variantStyles.backgroundColor,
          width: fullWidth ? '100%' : undefined,
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.textColor} />
      ) : (
        <Text
          style={[styles.text, { color: variantStyles.textColor }, textStyle]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
