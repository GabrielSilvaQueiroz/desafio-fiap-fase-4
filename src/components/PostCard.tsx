import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, shadow, spacing } from '../constants/theme';
import type { Post } from '../types';
import { formatDateLabel, getEntityTimestamp, getExcerpt } from '../utils/date';

interface PostCardProps {
  post: Post;
  onPress: () => void;
}

export default function PostCard({ post, onPress }: PostCardProps) {
  return (
    <Pressable style={({ pressed }) => [styles.card, shadow(1), pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.authorBadge}>
          <Ionicons name="person" size={11} color={colors.accent} />
          <Text style={styles.authorBadgeText}>Professor {post.author_name}</Text>
        </View>
        <Text style={styles.title}>{post.title}</Text>
      </View>
      <Text style={styles.excerpt}>{getExcerpt(post.content, 150)}</Text>
      <Text style={styles.date}>{formatDateLabel(getEntityTimestamp(post))}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
    gap: spacing.md,
    padding: spacing.lg,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  header: {
    gap: spacing.sm,
  },
  authorBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 45, 92, 0.08)',
    borderColor: 'rgba(15, 45, 92, 0.18)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  authorBadgeText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 28,
  },
  excerpt: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  date: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
});
