import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { z } from 'zod';

import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import Screen from '../components/Screen';
import SectionHeader from '../components/SectionHeader';
import { colors, radius, shadow, spacing } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { createUser, getUserById, updateUser } from '../services/users';
import type { RootStackParamList } from '../types';
import { getErrorMessage } from '../utils/error';

type Props = NativeStackScreenProps<RootStackParamList, 'UserForm'>;

const createSchema = z.object({
  name: z.string().min(2, 'Informe pelo menos 2 caracteres para o nome.'),
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(6, 'A senha precisa ter ao menos 6 caracteres.'),
});

const editSchema = z.object({
  name: z.string().min(2, 'Informe pelo menos 2 caracteres para o nome.'),
  email: z.string().email('Informe um e-mail válido.'),
  password: z
    .string()
    .optional()
    .refine((value) => !value || value.length >= 6, 'Se informada, a senha precisa ter ao menos 6 caracteres.'),
});

export default function UserFormScreen({ navigation, route }: Props) {
  const { mode, role, userId } = route.params;
  const { loading: authLoading, isAuthenticated, isTeacher, user, patchCurrentUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(mode === 'edit');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const roleLabel = useMemo(() => (role === 'teacher' ? 'professor' : 'aluno'), [role]);

  useEffect(() => {
    async function bootstrap() {
      if (mode !== 'edit' || !userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getUserById(userId);
        setName(response.name);
        setEmail(response.email);
      } catch (currentError) {
        setSubmitError(getErrorMessage(currentError, `Não foi possível carregar o ${roleLabel} para edição.`));
      } finally {
        setLoading(false);
      }
    }

    void bootstrap();
  }, [mode, roleLabel, userId]);

  const handleSubmit = async () => {
    setSubmitError('');
    const schema = mode === 'edit' ? editSchema : createSchema;
    const parsed = schema.safeParse({ name, email, password });

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
    setSubmitting(true);

    try {
      if (mode === 'edit' && userId) {
        const payload = {
          name: name.trim(),
          email: email.trim(),
          role,
          ...(password.trim() ? { password: password.trim() } : {}),
        };

        const updatedUser = await updateUser(userId, payload);
        if (user?._id === updatedUser._id) {
          await patchCurrentUser(updatedUser);
        }
      } else {
        await createUser({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          role,
        });
      }

      navigation.replace('UsersList', { role });
    } catch (currentError) {
      setSubmitError(getErrorMessage(currentError, `Não foi possível salvar o ${roleLabel}.`));
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <Screen scroll={false}>
        <LoadingState label={`Preparando formulário de ${roleLabel}...`} />
      </Screen>
    );
  }

  if (!isAuthenticated) {
    return (
      <Screen>
        <SectionHeader
          title={`Cadastro de ${roleLabel}`}
          subtitle="Faça login para continuar."
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          title="Login necessário"
          description="Entre na sua conta para acessar esta área."
          actionLabel="Ir para login"
          onAction={() => navigation.navigate('Login')}
        />
      </Screen>
    );
  }

  if (!isTeacher) {
    return (
      <Screen>
        <SectionHeader
          title={`Cadastro de ${roleLabel}`}
          subtitle="Esta área não está disponível para a sua conta."
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          title="Acesso restrito"
          description="Você não tem permissão para modificar estes registros."
          actionLabel="Voltar para a home"
          onAction={() => navigation.navigate('Home')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        eyebrow={mode === 'edit' ? 'Edição de cadastro' : 'Novo cadastro'}
        title={mode === 'edit' ? `Editar ${roleLabel}` : `Cadastrar ${roleLabel}`}
        subtitle="Preencha os dados abaixo para salvar o cadastro."
        onBack={() => navigation.goBack()}
      />

      <View style={[styles.card, shadow(2)]}>
        <Text style={styles.caption}>
          {mode === 'edit'
            ? `Atualize os dados deste ${roleLabel}.`
            : `Preencha as informações para criar um novo ${roleLabel}.`}
        </Text>
        <AppInput
          label="Nome"
          value={name}
          onChangeText={(value) => {
            setName(value);
            setErrors((current) => ({ ...current, name: '' }));
          }}
          placeholder={`Nome do ${roleLabel}`}
          error={errors.name}
        />
        <AppInput
          label="E-mail"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setErrors((current) => ({ ...current, email: '' }));
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder={`email-${roleLabel}@exemplo.com`}
          error={errors.email}
        />
        <AppInput
          label={mode === 'edit' ? 'Senha (opcional)' : 'Senha'}
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setErrors((current) => ({ ...current, password: '' }));
          }}
          secureTextEntry
          placeholder={mode === 'edit' ? 'Deixe em branco para manter a senha atual' : 'Mínimo de 6 caracteres'}
          helperText={mode === 'edit' ? 'Se o campo ficar vazio, a senha atual será preservada.' : undefined}
          error={errors.password}
        />
        {submitError ? <Text style={styles.error}>{submitError}</Text> : null}
        <View style={styles.actions}>
          <AppButton
            title={mode === 'edit' ? 'Salvar cadastro' : `Cadastrar ${roleLabel}`}
            loading={submitting}
            onPress={() => void handleSubmit()}
          />
          <AppButton title="Cancelar" variant="ghost" onPress={() => navigation.goBack()} />
        </View>
      </View>
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
  caption: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
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
