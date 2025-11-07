import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';

export interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'url'
    | 'visible-password';
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  style?: TextInputProps['style'];
}

/**
 * FormInput component for React Native
 * Provides a styled input field with label and error message
 */
export function FormInput({
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 3,
  disabled = false,
  autoCapitalize = 'sentences',
  autoCorrect = true,
  style,
}: FormInputProps) {
  const hasError = !!error;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, hasError && styles.labelError]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : undefined}
        editable={!disabled}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          hasError && styles.inputError,
          disabled && styles.inputDisabled,
          style,
        ]}
        placeholderTextColor='#9CA3AF'
      />
      {hasError && (
        <Text style={styles.errorText} accessibilityRole='alert'>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  labelError: {
    color: '#B91C1C',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    minHeight: 44,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputDisabled: {
    opacity: 0.5,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
    marginTop: 4,
  },
});
