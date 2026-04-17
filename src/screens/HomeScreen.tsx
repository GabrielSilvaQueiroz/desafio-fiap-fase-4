import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import PostCard from '../components/PostCard';
import Screen from '../components/Screen';
import SectionHeader from '../components/SectionHeader';
import { colors, radius, shadow, spacing } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { listPosts } from '../services/posts';
import type { Post, RootStackParamList } from '../types';
import { getErrorMessage } from '../utils/error';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const PAGE_SIZE = 5;

export default function HomeScreen({ navigation }: Props) {
  const { user, isAuthenticated, isTeacher, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const loadPosts = useCallback(async (query: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await listPosts(query);
      setPosts(response);
      setPage(1);
    } catch (currentError) {
      setError(getErrorMessage(currentError, 'Não foi possível carregar as publicações.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadPosts(debouncedSearch);
    }, [debouncedSearch, loadPosts])
  );

  const totalPages = useMemo(() => Math.max(1, Math.ceil(posts.length / PAGE_SIZE)), [posts.length]);
  const safePage = Math.min(page, totalPages);
  const pagePosts = useMemo(
    () => posts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [posts, safePage]
  );
  const from = posts.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const to = Math.min(safePage * PAGE_SIZE, posts.length);

  return (
    <Screen
      headerAction={
        isAuthenticated ? (
          <AppButton
            title="Sair"
            variant="ghost"
            size="sm"
            onPress={() => void logout()}
            style={styles.secondaryHeaderButton}
            textStyle={styles.secondaryHeaderButtonText}
          />
        ) : (
          <AppButton
            title="Entrar"
            variant="primary"
            size="sm"
            onPress={() => navigation.navigate('Login')}
            style={styles.loginButton}
          />
        )
      }
    >
      <SectionHeader
        title="Publicações"
        subtitle="Encontre novidades, leia conteúdos completos e acompanhe o que importa."
      />

      <View style={[styles.heroCard, shadow(2)]}>
        <Text style={styles.heroTag}>{user ? `Olá, ${user.name}` : 'Conteúdo em destaque'}</Text>
        <Text style={styles.heroTitle}>Busque por tema, título ou trecho do texto.</Text>
        <Text style={styles.heroCopy}>
          {debouncedSearch
            ? `Mostrando resultados para "${debouncedSearch}".`
            : 'Abra qualquer publicação para leitura completa e acompanhe as atualizações mais recentes.'}
        </Text>
        <AppInput
          label="Pesquisar publicações"
          value={search}
          onChangeText={setSearch}
          placeholder="Digite um assunto, título ou palavra-chave"
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      {isTeacher ? (
        <View style={styles.actionsRow}>
          <AppButton
            title="Novo Post"
            onPress={() => navigation.navigate('PostForm', { mode: 'create' })}
          />
          <AppButton
            title="Painel"
            variant="secondary"
            onPress={() => navigation.navigate('AdminHome')}
          />
        </View>
      ) : null}

      {loading ? <LoadingState label="Atualizando Publicações..." /> : null}

      {!loading && error ? (
        <EmptyState
          title="Não foi possível carregar as publicações"
          description={error}
          actionLabel="Tentar novamente"
          onAction={() => void loadPosts(debouncedSearch)}
        />
      ) : null}

      {!loading && !error && posts.length === 0 ? (
        <EmptyState
          title="Nenhum post encontrado"
          description={
            debouncedSearch
              ? 'Nenhum post foi encontrado para essa busca. Tente outro termo.'
              : 'Ainda não existem publicações disponíveis.'
          }
          actionLabel={debouncedSearch ? 'Limpar busca' : undefined}
          onAction={debouncedSearch ? () => setSearch('') : undefined}
        />
      ) : null}

      {!loading && !error && posts.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {debouncedSearch ? 'Resultados da Busca' : 'Posts Recentes'}
          </Text>
          <View style={styles.list}>
            {pagePosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPress={() => navigation.navigate('PostDetail', { postId: post._id })}
              />
            ))}
          </View>
          <View style={styles.pagination}>
            <Text style={styles.paginationLabel}>
              Exibindo {from}–{to} de {posts.length} {posts.length !== 1 ? 'publicações' : 'publicação'}
            </Text>
            {totalPages > 1 ? (
              <View style={styles.paginationActions}>
                <AppButton
                  title="Anterior"
                  variant="ghost"
                  size="sm"
                  disabled={safePage <= 1}
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                  style={styles.paginationBtn}
                  textStyle={styles.paginationBtnText}
                />
                <AppButton
                  title="Próxima"
                  variant="ghost"
                  size="sm"
                  disabled={safePage >= totalPages}
                  onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                  style={styles.paginationBtn}
                  textStyle={styles.paginationBtnText}
                />
              </View>
            ) : null}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(248, 243, 235, 0.1)',
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.xl,
  },
  heroTag: {
    color: '#F2C28B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.textOnDark,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 34,
  },
  heroCopy: {
    color: 'rgba(248, 243, 235, 0.82)',
    fontSize: 15,
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  loginButton: {
    minWidth: 96,
  },
  secondaryHeaderButton: {
    backgroundColor: 'rgba(248, 243, 235, 0.08)',
    borderColor: 'rgba(248, 243, 235, 0.18)',
  },
  secondaryHeaderButtonText: {
    color: colors.textOnDark,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.textOnDark,
    fontSize: 19,
    fontWeight: '800',
  },
  list: {
    gap: spacing.md,
  },
  pagination: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  paginationLabel: {
    color: 'rgba(248, 243, 235, 0.72)',
    fontSize: 13,
    fontWeight: '600',
  },
  paginationActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  paginationBtn: {
    backgroundColor: 'rgba(248, 243, 235, 0.08)',
    borderColor: 'rgba(248, 243, 235, 0.18)',
  },
  paginationBtnText: {
    color: colors.textOnDark,
  },
});
