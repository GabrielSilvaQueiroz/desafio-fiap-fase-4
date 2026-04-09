import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from 'react-native';

import { colors, radius, spacing } from '../constants/theme';

interface AppInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  helperText?: string;
  keyboardType?: KeyboardTypeOptions;
}

export default function AppInput({
  label,
  error,
  helperText,
  multiline = false,
  editable = true,
  ...props
}: AppInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        editable={editable}
        style={[
          styles.input,
          multiline && styles.multiline,
          !editable && styles.readOnly,
          error ? styles.errorBorder : styles.normalBorder,
        ]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 54,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  multiline: {
    minHeight: 180,
    textAlignVertical: 'top',
  },
  normalBorder: {
    borderColor: colors.border,
  },
  errorBorder: {
    borderColor: colors.danger,
  },
  readOnly: {
    backgroundColor: colors.cardMuted,
  },
  helper: {
    color: colors.textMuted,
    fontSize: 12,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '600',
  },
});
