# Tech Challenge FIAP - Fase 04

Aplicativo mobile em React Native para a plataforma de blogging educacional desenvolvida nas fases 2 e 3. O projeto consome a API em Node.js/Express da fase 2 e replica, no contexto mobile, os fluxos de leitura, autenticacao e administracao da plataforma.

## Objetivo da fase

Esta entrega atende ao desafio da FIAP de criar uma interface mobile robusta, intuitiva e eficiente para:

- listar e buscar posts
- ler posts completos
- autenticar usuarios
- permitir criacao e edicao de posts por professores
- cadastrar e editar professores
- cadastrar e editar alunos
- listar professores e alunos em telas administrativas
- oferecer um painel administrativo para professores

## Stack

- Expo + React Native
- TypeScript
- React Navigation (native stack)
- Axios
- AsyncStorage
- Zod

## Relacao com as fases anteriores

- `desafio-fiap-fase-2`: backend REST em Node.js + Express + MongoDB
- `desafio-fiap-fase-3`: frontend web em React + Vite + TypeScript
- `desafio-fiap-fase-4`: cliente mobile em React Native reaproveitando os contratos, regras de autenticacao e dominio ja construidos

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- Expo CLI via `npx expo`
- API da fase 2 rodando localmente ou publicada

## Setup inicial

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo de ambiente a partir do exemplo:

```bash
cp .env.example .env
```

3. Ajuste a URL da API:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

4. Inicie o app:

```bash
npm run start
```

5. Abra no Android, iOS ou web a partir do menu do Expo.

## Observacao importante sobre ambiente local

Se voce rodar em emulador Android, o app converte automaticamente `localhost` e `127.0.0.1` para `10.0.2.2`, facilitando o consumo da API local da fase 2.

## Scripts

- `npm run start`: inicia o Metro/Expo
- `npm run android`: abre o app em Android
- `npm run ios`: abre o app em iOS
- `npm run web`: abre a versao web pelo Expo
- `npm run typecheck`: valida o TypeScript sem emitir arquivos

## Variavel de ambiente

- `EXPO_PUBLIC_API_BASE_URL`: URL base da API REST da fase 2

Exemplos:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

```env
EXPO_PUBLIC_API_BASE_URL=https://desafio-fiap-fase-2.onrender.com
```

## Funcionalidades implementadas

### Area publica

- listagem de posts
- busca por palavra-chave
- leitura completa de posts
- funcionamento sem login para consulta de conteudo

### Area autenticada

- login com qualquer usuario existente na API
- diferenciacao de permissoes entre `teacher` e `student`
- criacao e edicao de posts para professores
- painel administrativo com visao de posts, professores e alunos
- cadastro e edicao de professores
- cadastro e edicao de alunos
- listagem paginada no servidor para usuarios
- exclusao de professores e alunos pela area administrativa

## Regras de acesso

- professores podem criar e editar posts
- alunos permanecem em modo leitura
- telas administrativas exigem autenticacao e papel `teacher`
- o token JWT e persistido no `AsyncStorage`
- respostas `401` derrubam a sessao local automaticamente

## Arquitetura da aplicacao

Estrutura principal:

```text
src/
  components/   componentes visuais reutilizaveis
  constants/    tokens de tema
  contexts/     autenticacao e sessao
  navigation/   stack principal do app
  screens/      telas do fluxo mobile
  services/     cliente HTTP e modulos de integracao
  types/        contratos TypeScript compartilhados
  utils/        datas e tratamento de erro
```

### Decisoes de implementacao

- `AuthContext` centraliza sessao, token e papel do usuario
- `Axios` encapsula headers, base URL e tratamento de `401`
- `React Navigation` organiza os fluxos mobile
- `Zod` valida formularios de login, posts e usuarios
- `AsyncStorage` persiste a sessao entre aberturas do app

## Endpoints consumidos

### Autenticacao

- `POST /auth/login`

### Posts

- `GET /posts`
- `GET /posts/search?q=...`
- `GET /posts/:id`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`

### Usuarios

- `POST /users`
- `GET /users`
- `GET /users/:id`
- `PUT /users/:id`
- `DELETE /users/:id`

## Guia de uso

1. Abra a Home para listar e buscar posts.
2. Toque em um card para ler o conteudo completo.
3. Entre com um usuario `teacher` para liberar o painel administrativo.
4. No painel, crie posts e navegue para a gestao de professores e alunos.
5. Use as telas de cadastro e edicao para manter os usuarios.

## Entrega tecnica sugerida

Para a apresentacao em video e documentacao final da FIAP, vale destacar:

- reaproveitamento de contratos e regras das fases 2 e 3
- estrategia de persistencia de sessao mobile
- tratamento das restricoes reais do backend no UX do app
- modularizacao entre telas, servicos e contexto de autenticacao
