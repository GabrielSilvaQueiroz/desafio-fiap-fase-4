import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.author}>Por {post.author_name}</Text>
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
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 28,
  },
  author: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
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
