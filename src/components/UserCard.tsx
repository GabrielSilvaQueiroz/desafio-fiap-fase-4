import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadow, spacing } from '../constants/theme';
import type { UserRole } from '../types';

import AppButton from './AppButton';

interface UserCardProps {
  name: string;
  email: string;
  role: UserRole;
  onEdit: () => void;
  onDelete: () => void;
}

export default function UserCard({
  name,
  email,
  role,
  onEdit,
  onDelete,
}: UserCardProps) {
  return (
    <View style={[styles.card, shadow(1)]}>
      <View style={styles.header}>
        <View style={styles.nameBlock}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        <View style={[styles.pill, role === 'teacher' ? styles.teacherPill : styles.studentPill]}>
          <Text style={styles.pillText}>{role === 'teacher' ? 'Professor' : 'Aluno'}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <AppButton title="Editar" onPress={onEdit} size="sm" />
        <AppButton title="Excluir" onPress={onDelete} size="sm" variant="danger" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.divider,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  header: {
    gap: spacing.sm,
  },
  nameBlock: {
    gap: 4,
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  email: {
    color: colors.textMuted,
    fontSize: 14,
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  teacherPill: {
    backgroundColor: '#FEF3C7',
  },
  studentPill: {
    backgroundColor: '#DBEAFE',
  },
  pillText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
