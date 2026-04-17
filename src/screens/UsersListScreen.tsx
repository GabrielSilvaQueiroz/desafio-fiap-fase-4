import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import Screen from '../components/Screen';
import SectionHeader from '../components/SectionHeader';
import UserCard from '../components/UserCard';
import { colors, spacing } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { deleteUser, listUsers } from '../services/users';
import type { PaginatedResponse, RootStackParamList, User } from '../types';
import { getErrorMessage } from '../utils/error';

type Props = NativeStackScreenProps<RootStackParamList, 'UsersList'>;

const PAGE_SIZE = 6;

export default function UsersListScreen({ navigation, route }: Props) {
  const { role } = route.params;
  const { loading: authLoading, isAuthenticated, isTeacher } = useAuth();
  const [userPage, setUserPage] = useState<PaginatedResponse<User> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const roleLabel = role === 'teacher' ? 'professores' : 'alunos';
  const roleLabelSingular = role === 'teacher' ? 'professor' : 'aluno';

  const loadRoleUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await listUsers({ page, limit: PAGE_SIZE, role });
      setUserPage(response);
    } catch (currentError) {
      setError(getErrorMessage(currentError, `Não foi possível carregar a lista de ${roleLabel}.`));
    } finally {
      setLoading(false);
    }
  }, [page, role, roleLabel]);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated && isTeacher) {
        void loadRoleUsers();
      } else {
        setLoading(false);
      }
    }, [isAuthenticated, isTeacher, loadRoleUsers])
  );

  const users = useMemo(() => userPage?.items ?? [], [userPage]);
  const pagination = userPage?.pagination;

  useEffect(() => {
    if (pagination && page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [page, pagination]);

  const handleDeletePress = (userId: string) => {
    Alert.alert('Excluir cadastro', `Deseja remover este ${roleLabelSingular}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteUser(userId);

            if (users.length === 1 && page > 1) {
              setPage((current) => current - 1);
            } else {
              await loadRoleUsers();
            }
          } catch (currentError) {
            Alert.alert('Falha ao excluir', getErrorMessage(currentError));
          }
        },
      },
    ]);
  };

  if (authLoading || loading) {
    return (
      <Screen scroll={false}>
        <LoadingState label={`Carregando ${roleLabel}...`} />
      </Screen>
    );
  }

  if (!isAuthenticated) {
    return (
      <Screen onBack={() => navigation.goBack()}>
        <SectionHeader
          title={`Listagem de ${roleLabel}`}
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
          title={`Listagem de ${roleLabel}`}
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
          title={`Novo ${roleLabelSingular}`}
          size="sm"
          onPress={() => navigation.navigate('UserForm', { mode: 'create', role })}
        />
      }
    >
      <SectionHeader
        eyebrow="Cadastros"
        title={`Listagem de ${roleLabel}`}
        subtitle="Visualize, edite e mantenha os registros atualizados."
      />

      {error ? (
        <EmptyState
          title={`Falha ao carregar ${roleLabel}`}
          description={error}
          actionLabel="Tentar novamente"
          onAction={() => void loadRoleUsers()}
        />
      ) : null}

      {!error && users.length === 0 ? (
        <EmptyState
          title={`Nenhum ${roleLabelSingular} encontrado`}
          description={`Adicione um novo ${roleLabelSingular} para começar esta lista.`}
          actionLabel={`Novo ${roleLabelSingular}`}
          onAction={() => navigation.navigate('UserForm', { mode: 'create', role })}
        />
      ) : null}

      {!error && users.length > 0 && pagination ? (
        <>
          <View style={styles.list}>
            {users.map((currentUser) => (
              <UserCard
                key={currentUser._id}
                name={currentUser.name}
                email={currentUser.email}
                role={currentUser.role}
                onEdit={() => navigation.navigate('UserForm', { mode: 'edit', role, userId: currentUser._id })}
                onDelete={() => handleDeletePress(currentUser._id)}
              />
            ))}
          </View>
          <View style={styles.pagination}>
            <Text style={styles.paginationLabel}>
              Página {pagination.page} de {pagination.totalPages} · {pagination.totalItems} registros
            </Text>
            <View style={styles.paginationActions}>
              <AppButton
                title="Anterior"
                variant="ghost"
                size="sm"
                onPress={() => setPage((current) => Math.max(1, current - 1))}
                disabled={!pagination.hasPrevPage}
                style={styles.darkGhostButton}
                textStyle={styles.darkGhostButtonText}
              />
              <AppButton
                title="Próxima"
                variant="ghost"
                size="sm"
                onPress={() => setPage((current) => current + 1)}
                disabled={!pagination.hasNextPage}
                style={styles.darkGhostButton}
                textStyle={styles.darkGhostButtonText}
              />
            </View>
          </View>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  pagination: {
    gap: spacing.sm,
  },
  paginationLabel: {
    color: colors.textOnDark,
    fontSize: 14,
    fontWeight: '700',
  },
  paginationActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  darkGhostButton: {
    backgroundColor: 'rgba(248, 243, 235, 0.08)',
    borderColor: 'rgba(248, 243, 235, 0.18)',
  },
  darkGhostButtonText: {
    color: colors.textOnDark,
  },
});
