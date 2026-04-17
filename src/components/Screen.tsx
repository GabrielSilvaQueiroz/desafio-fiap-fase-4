import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '../constants/theme';

const logo = require('../../assets/logo.png') as ReturnType<typeof require>;

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onBack?: () => void;
  headerAction?: React.ReactNode;
}

export default function Screen({
  children,
  scroll = true,
  contentContainerStyle,
  onBack,
  headerAction,
}: ScreenProps) {
  const showHeader = Boolean(onBack ?? headerAction);

  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.scrollContent, contentContainerStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {showHeader ? (
        <View style={styles.header}>
          {onBack ? (
            <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
              <Text style={styles.backArrow}>←</Text>
              <Text style={styles.backText}>Voltar</Text>
            </Pressable>
          ) : (
            <View style={styles.logoRow}>
              <Image source={logo} style={styles.logoImg} resizeMode="contain" />
              <Text style={styles.logoText}>SystemConnect</Text>
            </View>
          )}
          <View>{headerAction ?? null}</View>
        </View>
      ) : null}
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
    minHeight: 52,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backArrow: {
    color: colors.textOnDark,
    fontSize: 20,
    lineHeight: 22,
  },
  backText: {
    color: colors.textOnDark,
    fontSize: 15,
    fontWeight: '600',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImg: {
    width: 26,
    height: 26,
    borderRadius: 4,
  },
  logoText: {
    color: colors.textOnDark,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.x3,
  },
});
