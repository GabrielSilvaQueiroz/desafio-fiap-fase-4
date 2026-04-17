import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { z } from 'zod';

import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import EmptyState from '../components/EmptyState';
import Screen from '../components/Screen';
import SectionHeader from '../components/SectionHeader';
import { colors, radius, shadow, spacing } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import type { RootStackParamList } from '../types';
import { getErrorMessage } from '../utils/error';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const schema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

export default function LoginScreen({ navigation }: Props) {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const currentProfileLabel = useMemo(() => {
    if (!user) {
      return null;
    }

    return `${user.name} (${user.role === 'teacher' ? 'Professor' : 'Aluno'})`;
  }, [user]);

  const handleSubmit = async () => {
    setSubmitError('');
    const parsed = schema.safeParse({ email, password });

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === 'string') {
          nextErrors[field] = issue.message;
        }
      });
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const authenticatedUser = await login(email.trim(), password);
      navigation.replace(authenticatedUser.role === 'teacher' ? 'AdminHome' : 'Home');
    } catch (currentError) {
      setSubmitError(getErrorMessage(currentError, 'Não foi possível concluir o acesso no momento.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen onBack={() => navigation.goBack()}>
      <SectionHeader
        eyebrow="Acesso"
        title="Entrar"
        subtitle="Acesse sua conta para continuar."
      />

      {isAuthenticated ? (
        <EmptyState
          title="Sessão ativa"
          description={`Você já está conectado como ${currentProfileLabel}.`}
          actionLabel="Continuar"
          onAction={() => navigation.replace(user?.role === 'teacher' ? 'AdminHome' : 'Home')}
        >
          <AppButton title="Sair da conta" variant="ghost" onPress={() => void logout()} />
        </EmptyState>
      ) : (
        <View style={[styles.card, shadow(2)]}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Informe seus dados para acessar sua conta.</Text>
          <AppInput
            label="E-mail"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setErrors((current) => ({ ...current, email: '' }));
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="seuemail@exemplo.com"
            error={errors.email}
          />
          <AppInput
            label="Senha"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setErrors((current) => ({ ...current, password: '' }));
            }}
            secureTextEntry
            placeholder="Digite sua senha"
            error={errors.password}
          />
          {submitError ? <Text style={styles.error}>{submitError}</Text> : null}
          <View style={styles.actions}>
            <AppButton title="Entrar" loading={loading} onPress={() => void handleSubmit()} />
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.divider,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
});
