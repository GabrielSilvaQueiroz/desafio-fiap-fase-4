import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../constants/theme';

interface LoadingStateProps {
  label?: string;
}

export default function LoadingState({ label = 'Carregando...' }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
    gap: spacing.md,
  },
  label: {
    color: colors.textOnDark,
    fontSize: 15,
    fontWeight: '600',
  },
});
