import React, { useCallback, useEffect, useState } from 'react';
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

export default function HomeScreen({ navigation }: Props) {
  const { user, isAuthenticated, isTeacher, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const loadPosts = useCallback(async (query: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await listPosts(query);
      setPosts(response);
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

  return (
    <Screen>
      <SectionHeader
        eyebrow="SystemConnect"
        title="Publicações"
        subtitle="Encontre novidades, leia conteúdos completos e acompanhe o que importa."
        action={
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
        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <Text style={styles.metaPillValue}>{posts.length}</Text>
            <Text style={styles.metaPillLabel}>{debouncedSearch ? 'resultados' : 'itens'}</Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaPillValue}>{debouncedSearch ? 'Busca ativa' : 'Catálogo'}</Text>
            <Text style={styles.metaPillLabel}>navegação</Text>
          </View>
        </View>
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
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPress={() => navigation.navigate('PostDetail', { postId: post._id })}
              />
            ))}
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
  metaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metaPill: {
    backgroundColor: 'rgba(248, 243, 235, 0.08)',
    borderColor: 'rgba(248, 243, 235, 0.14)',
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    gap: 2,
    padding: spacing.md,
  },
  metaPillValue: {
    color: colors.textOnDark,
    fontSize: 17,
    fontWeight: '800',
  },
  metaPillLabel: {
    color: 'rgba(248, 243, 235, 0.72)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
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
});
