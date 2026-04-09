import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../constants/theme';

type BannerVariant = 'info' | 'warning' | 'success';

interface InfoBannerProps {
  title: string;
  description: string;
  variant?: BannerVariant;
}

const variantConfig: Record<BannerVariant, { backgroundColor: string; borderColor: string }> = {
  info: {
    backgroundColor: '#E0F2FE',
    borderColor: '#38BDF8',
  },
  warning: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  success: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
};

export default function InfoBanner({
  title,
  description,
  variant = 'info',
}: InfoBannerProps) {
  return (
    <View style={[styles.container, variantConfig[variant]]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  description: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
});
