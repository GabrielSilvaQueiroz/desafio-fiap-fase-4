import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import Screen from '../components/Screen';
import SectionHeader from '../components/SectionHeader';
import { colors, radius, shadow, spacing } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { deletePost, listPosts } from '../services/posts';
import { listUsers } from '../services/users';
import type { Post, RootStackParamList } from '../types';
import { formatDateLabel, getEntityTimestamp } from '../utils/date';
import { getErrorMessage } from '../utils/error';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminHome'>;

export default function AdminHomeScreen({ navigation }: Props) {
  const { loading: authLoading, isAuthenticated, isTeacher } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshError, setRefreshError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setRefreshError('');

    try {
      const [allPosts, teachersPage, studentsPage] = await Promise.all([
        listPosts(),
        listUsers({ page: 1, limit: 1, role: 'teacher' }),
        listUsers({ page: 1, limit: 1, role: 'student' }),
      ]);
      setPosts(allPosts);
      setTeacherCount(teachersPage.pagination.totalItems);
      setStudentCount(studentsPage.pagination.totalItems);
    } catch (currentError) {
      setRefreshError(getErrorMessage(currentError, 'Não foi possível carregar esta área.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated && isTeacher) {
        void loadDashboard();
      } else {
        setLoading(false);
      }
    }, [isAuthenticated, isTeacher, loadDashboard])
  );

  const handleDelete = useCallback(
    (postId: string) => {
      Alert.alert(
        'Excluir post',
        'Deseja remover esta publicação?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
              try {
                await deletePost(postId);
                await loadDashboard();
              } catch (currentError) {
                Alert.alert('Falha ao excluir', getErrorMessage(currentError));
              }
            },
          },
        ]
      );
    },
    [loadDashboard]
  );

  if (authLoading || loading) {
    return (
      <Screen scroll={false} contentContainerStyle={styles.centered}>
        <LoadingState label="Carregando..." />
      </Screen>
    );
  }

  if (!isAuthenticated) {
    return (
      <Screen onBack={() => navigation.goBack()}>
        <SectionHeader
          title="Painel"
          subtitle="Faça login para continuar."
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
      <Screen onBack={() => navigation.goBack()}>
        <SectionHeader
          title="Painel"
          subtitle="Esta área não está disponível para a sua conta."
        />
        <EmptyState
          title="Acesso restrito"
          description="Você não tem permissão para acessar esta área."
          actionLabel="Voltar para a home"
          onAction={() => navigation.navigate('Home')}
        />
      </Screen>
    );
  }

  return (
    <Screen
      onBack={() => navigation.goBack()}
      headerAction={
        <AppButton
          title="Atualizar"
          size="sm"
          variant="ghost"
          onPress={() => void loadDashboard()}
          style={styles.darkGhostButton}
          textStyle={styles.darkGhostButtonText}
        />
      }
    >
      <SectionHeader
        eyebrow="Gestão"
        title="Painel"
        subtitle="Acompanhe publicações e acessos em um só lugar."
      />

      {refreshError ? (
        <EmptyState
          title="Falha ao atualizar"
          description={refreshError}
          actionLabel="Tentar novamente"
          onAction={() => void loadDashboard()}
        />
      ) : null}

      <View style={styles.statsRow}>
        <View style={[styles.statCard, shadow(1)]}>
          <Text style={styles.statLabel}>Posts</Text>
          <Text style={styles.statValue}>{posts.length}</Text>
        </View>
        <View style={[styles.statCard, shadow(1)]}>
          <Text style={styles.statLabel}>Professores</Text>
          <Text style={styles.statValue}>{teacherCount}</Text>
        </View>
        <View style={[styles.statCard, shadow(1)]}>
          <Text style={styles.statLabel}>Alunos</Text>
          <Text style={styles.statValue}>{studentCount}</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <AppButton
          title="Novo Post"
          onPress={() => navigation.navigate('PostForm', { mode: 'create' })}
        />
        <AppButton
          title="Professores"
          variant="secondary"
          onPress={() => navigation.navigate('UsersList', { role: 'teacher' })}
        />
        <AppButton
          title="Alunos"
          variant="ghost"
          onPress={() => navigation.navigate('UsersList', { role: 'student' })}
          style={styles.darkGhostButton}
          textStyle={styles.darkGhostButtonText}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Todas as publicações</Text>
        {posts.length === 0 ? (
          <EmptyState
            title="Nenhum post cadastrado"
            description="Ainda não existem publicações nesta área."
            actionLabel="Criar post"
            onAction={() => navigation.navigate('PostForm', { mode: 'create' })}
          />
        ) : (
          <View style={styles.list}>
            {posts.map((post) => (
              <View key={post._id} style={[styles.postCard, shadow(1)]}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postMeta}>
                  {post.author_name} · {formatDateLabel(getEntityTimestamp(post))}
                </Text>
                <View style={styles.postActions}>
                  <AppButton
                    title="Ver"
                    size="sm"
                    variant="ghost"
                    onPress={() => navigation.navigate('PostDetail', { postId: post._id })}
                    style={styles.cardGhostButton}
                    textStyle={styles.cardGhostButtonText}
                  />
                  <AppButton
                    title="Editar"
                    size="sm"
                    onPress={() => navigation.navigate('PostForm', { mode: 'edit', postId: post._id })}
                  />
                  <AppButton
                    title="Excluir"
                    size="sm"
                    variant="danger"
                    onPress={() => handleDelete(post._id)}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    backgroundColor: colors.card,
    borderColor: colors.divider,
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    padding: spacing.lg,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
  },
  quickActions: {
    gap: spacing.sm,
  },
  darkGhostButton: {
    backgroundColor: 'rgba(248, 243, 235, 0.08)',
    borderColor: 'rgba(248, 243, 235, 0.18)',
  },
  darkGhostButtonText: {
    color: colors.textOnDark,
  },
  cardGhostButton: {
    backgroundColor: colors.cardMuted,
    borderColor: colors.border,
  },
  cardGhostButtonText: {
    color: colors.text,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.textOnDark,
    fontSize: 20,
    fontWeight: '800',
  },
  postCard: {
    backgroundColor: colors.card,
    borderColor: colors.divider,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  postTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  postMeta: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    gap: spacing.md,
  },
  postActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
