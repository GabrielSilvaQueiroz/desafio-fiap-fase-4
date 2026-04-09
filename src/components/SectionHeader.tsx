import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../constants/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  onBack?: () => void;
  action?: React.ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  eyebrow,
  onBack,
  action,
}: SectionHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </Pressable>
        ) : (
          <View />
        )}
        {action}
      </View>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    borderColor: 'rgba(248, 250, 252, 0.25)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  backButtonText: {
    color: colors.textOnDark,
    fontSize: 13,
    fontWeight: '700',
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.textOnDark,
    fontSize: typography.title,
    fontWeight: '900',
    lineHeight: 34,
  },
  subtitle: {
    color: 'rgba(248, 250, 252, 0.82)',
    fontSize: 15,
    lineHeight: 22,
  },
});
