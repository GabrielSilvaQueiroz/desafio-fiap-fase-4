import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import AppButton from './AppButton';
import { colors, radius, shadow, spacing } from '../constants/theme';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={[styles.card, shadow(4)]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <AppButton
              title="Cancelar"
              variant="ghost"
              style={styles.cancelBtn}
              onPress={onCancel}
            />
            <AppButton
              title={confirmLabel}
              variant="danger"
              style={styles.confirmBtn}
              onPress={onConfirm}
            />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.xl,
    gap: spacing.md,
    width: '100%',
    maxWidth: 360,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  message: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: colors.cardMuted,
    borderColor: colors.border,
  },
  confirmBtn: {
    flex: 1,
  },
});
