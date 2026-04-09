import React, { useEffect, useState } from 'react';
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
import { createPost, getPostById, updatePost } from '../services/posts';
import type { RootStackParamList } from '../types';
import { getErrorMessage } from '../utils/error';

type Props = NativeStackScreenProps<RootStackParamList, 'PostForm'>;

const schema = z.object({
  title: z.string().min(3, 'O título precisa ter pelo menos 3 caracteres.'),
  content: z.string().min(10, 'O conteúdo precisa ter pelo menos 10 caracteres.'),
});

export default function PostFormScreen({ navigation, route }: Props) {
  const { mode, postId } = route.params;
  const { loading: authLoading, isAuthenticated, isTeacher, user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(mode === 'edit');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    async function bootstrap() {
      if (mode !== 'edit' || !postId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getPostById(postId);
        setTitle(response.title);
        setContent(response.content);
      } catch (currentError) {
        setSubmitError(getErrorMessage(currentError, 'Não foi possível carregar este conteúdo para edição.'));
      } finally {
        setLoading(false);
      }
    }

    void bootstrap();
  }, [mode, postId]);

  const handleSubmit = async () => {
    setSubmitError('');
    const parsed = schema.safeParse({ title, content });

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
      const post =
        mode === 'edit' && postId
          ? await updatePost(postId, { title: title.trim(), content: content.trim() })
          : await createPost({ title: title.trim(), content: content.trim() });

      navigation.replace('PostDetail', { postId: post._id });
    } catch (currentError) {
      setSubmitError(getErrorMessage(currentError, 'Não foi possível salvar a publicação.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <Screen scroll={false} contentContainerStyle={styles.centered}>
        <LoadingState label="Preparando editor..." />
      </Screen>
    );
  }

  if (!isAuthenticated) {
    return (
      <Screen>
        <SectionHeader
          title="Editor"
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
          title="Editor"
          subtitle="Esta área não está disponível para a sua conta."
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          title="Acesso restrito"
          description="Você não tem permissão para editar publicações nesta conta."
          actionLabel="Voltar para a home"
          onAction={() => navigation.navigate('Home')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        eyebrow={mode === 'edit' ? 'Edição' : 'Novo   Conteúdo'}
        title={mode === 'edit' ? 'Editar Publicação' : 'Criar Publicação'}
        subtitle="Preencha os campos abaixo para salvar seu conteúdo."
        onBack={() => navigation.goBack()}
      />

      <View style={[styles.card, shadow(2)]}>
        <Text style={styles.caption}>Autoria: {user?.name}</Text>
        <AppInput
          label="Autor"
          value={user?.name ?? ''}
          editable={false}
          helperText="Este campo é preenchido automaticamente."
        />
        <AppInput
          label="Título"
          value={title}
          onChangeText={(value) => {
            setTitle(value);
            setErrors((current) => ({ ...current, title: '' }));
          }}
          placeholder="Digite um título"
          error={errors.title}
        />
        <AppInput
          label="Conteúdo"
          value={content}
          onChangeText={(value) => {
            setContent(value);
            setErrors((current) => ({ ...current, content: '' }));
          }}
          placeholder="Escreva o conteúdo da publicação"
          multiline
          error={errors.content}
        />
        {submitError ? <Text style={styles.error}>{submitError}</Text> : null}
        <View style={styles.actions}>
          <AppButton
            title={mode === 'edit' ? 'Salvar Alterações' : 'Publicar'}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.divider,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.xl,
  },
  caption: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
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
