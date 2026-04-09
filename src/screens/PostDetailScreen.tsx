import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import Screen from '../components/Screen';
import SectionHeader from '../components/SectionHeader';
import { colors, radius, shadow, spacing } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { deletePost, getPostById } from '../services/posts';
import type { Post, RootStackParamList } from '../types';
import { formatDateLabel, getEntityTimestamp } from '../utils/date';
import { getErrorMessage } from '../utils/error';

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

export default function PostDetailScreen({ navigation, route }: Props) {
  const { postId } = route.params;
  const { isTeacher } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadPost = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getPostById(postId);
      setPost(response);
    } catch (currentError) {
      setError(getErrorMessage(currentError, 'Não foi possível carregar o conteúdo selecionado.'));
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    void loadPost();
  }, [loadPost]);

  const handleDelete = useCallback(async () => {
    setSubmitting(true);

    try {
      await deletePost(postId);
      navigation.navigate('AdminHome');
    } catch (currentError) {
      Alert.alert('Falha ao excluir', getErrorMessage(currentError));
    } finally {
      setSubmitting(false);
    }
  }, [navigation, postId]);

  const confirmDelete = useCallback(() => {
    Alert.alert(
      'Excluir post',
      'Esta ação remove o conteúdo permanentemente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => void handleDelete() },
      ]
    );
  }, [handleDelete]);

  if (loading) {
    return (
      <Screen scroll={false} contentContainerStyle={styles.centered}>
        <LoadingState label="Carregando conteúdo..." />
      </Screen>
    );
  }

  if (!post || error) {
    return (
      <Screen>
        <SectionHeader
          title="Leitura"
          subtitle="Detalhes da publicação selecionada."
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          title="Conteúdo indisponível"
          description={error || 'Não encontramos a publicação solicitada.'}
          actionLabel="Voltar para a home"
          onAction={() => navigation.navigate('Home')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title="Leitura"
        subtitle="Conteúdo completo da publicação."
        onBack={() => navigation.goBack()}
      />

      <View style={[styles.articleCard, shadow(2)]}>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.metaBlock}>
          <Text style={styles.metaText}>Por {post.author_name}</Text>
          <Text style={styles.metaText}>
            Atualizado em {formatDateLabel(getEntityTimestamp(post))}
          </Text>
        </View>
        <Text style={styles.content}>{post.content}</Text>
      </View>

      {isTeacher ? (
        <View style={styles.actions}>
          <AppButton
            title="Editar Post"
            onPress={() => navigation.navigate('PostForm', { mode: 'edit', postId })}
          />
          <AppButton
            title="Excluir Post"
            variant="danger"
            loading={submitting}
            onPress={confirmDelete}
          />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
  },
  articleCard: {
    backgroundColor: colors.card,
    borderColor: colors.divider,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 36,
  },
  metaBlock: {
    gap: spacing.xs,
  },
  metaText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 26,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
