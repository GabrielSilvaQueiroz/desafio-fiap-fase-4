import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../constants/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

export default function SectionHeader({ title, subtitle, eyebrow }: SectionHeaderProps) {
  return (
    <View style={styles.wrapper}>
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
