# 📱 Tech Challenge FIAP — Plataforma de Blog Educacional
### Aplicativo Mobile em React Native + Expo + TypeScript

---

## 👥 Integrantes do Grupo

| Nome | RM | E-mail |
|------|------|--------|
| Gabriel Silva Queiroz | RM367280 | gabrielsq@yahoo.com.br |
| Daniela Moreira | RM366750 | dani-camargo@live.com |
| Bruno Teixeira Santos | RM367221 | bruno.if@hotmail.com |
| Fabio Tavares Santana | RM368685 | fabiotas9@gmail.com |

---

# 🎯 Objetivo do Projeto

Este projeto foi desenvolvido como parte do **Tech Challenge – Fase 4 (Mobile Development) da FIAP**, com o objetivo de criar um **aplicativo mobile** para a plataforma de blogging educacional construída nas fases anteriores, onde:

- **Alunos** podem listar, buscar e ler posts sem necessidade de login.
- **Professores** podem criar, editar e excluir posts pelo app.
- **Professores** também gerenciam cadastro de professores e alunos pelo painel administrativo.
- O app consome diretamente a **API REST da Fase 2** (Node.js + Express + MongoDB Atlas).

---

# 🔗 Relação com as Fases Anteriores

| Fase | Descrição |
|------|-----------|
| **Fase 2** | Backend REST em Node.js + Express + MongoDB Atlas |
| **Fase 3** | Frontend web em React + Vite + TypeScript |
| **Fase 4** | Cliente mobile em React Native reaproveitando contratos, regras de autenticação e domínio já construídos |

---

# 🏗 Arquitetura da Aplicação

Tecnologias utilizadas:

- React Native + Expo
- TypeScript
- React Navigation (native stack)
- Axios
- AsyncStorage
- Zod

### 🔧 Diagrama Arquitetural Simplificado

```
Usuário (Android / iOS / Web)
         ↓
   App React Native (Expo)
         ↓
   Axios (cliente HTTP)
         ↓
   API REST — Fase 2 (Node.js + Express)
         ↓
   MongoDB Atlas (Cloud)
```

---

# 🚀 Tecnologias Utilizadas

- **Expo ~54** — plataforma de build e execução React Native
- **React Native 0.81** + **React 19** — framework mobile
- **TypeScript ~5.8** — tipagem estática
- **React Navigation 7** — navegação em native stack
- **Axios** — cliente HTTP com interceptadores de autenticação
- **AsyncStorage** — persistência de sessão entre abertura do app
- **Zod** — validação de formulários de login, posts e usuários

---

# 📦 Estrutura de Pastas

```
/
|-- src/
|   |-- components/   componentes visuais reutilizáveis
|   |-- constants/    tokens de tema (cores, espaçamentos)
|   |-- contexts/     autenticação e sessão (AuthContext)
|   |-- navigation/   stack principal do app
|   |-- screens/      telas do fluxo mobile
|   |-- services/     cliente HTTP Axios e módulos de integração
|   |-- types/        contratos TypeScript compartilhados
|   |-- utils/        formatação de datas e tratamento de erro
|
|-- App.tsx
|-- app.json
|-- tsconfig.json
|-- package.json
|-- README.md
```

### 🖥 Telas implementadas

| Arquivo | Descrição |
|---------|-----------|
| `HomeScreen.tsx` | Listagem e busca de posts |
| `PostDetailScreen.tsx` | Leitura completa de um post |
| `LoginScreen.tsx` | Autenticação de usuários |
| `PostFormScreen.tsx` | Criação e edição de posts (professores) |
| `AdminHomeScreen.tsx` | Painel administrativo (professores) |
| `UsersListScreen.tsx` | Listagem de professores e alunos |
| `UserFormScreen.tsx` | Cadastro e edição de usuários |

---

# 🔐 Autenticação e Autorização

O projeto utiliza:

- **JWT** para autenticação — token obtido via `POST /auth/login`
- **Role-based access** para diferenciação de permissões
- **AsyncStorage** para persistência do token entre sessões
- Respostas `401` derrubam a sessão local automaticamente

### Regras de Acesso

- Alunos (`student`) — apenas visualização de posts
- Professores (`teacher`) — criação, edição e exclusão de posts + painel administrativo completo
- Telas administrativas exigem autenticação e papel `teacher`

---

# 📚 Endpoints Consumidos

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/login` | Autenticar e obter JWT |

### Posts
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/posts` | Listar posts |
| GET | `/posts/search?q=...` | Buscar posts por palavra-chave |
| GET | `/posts/:id` | Ler post completo |
| POST | `/posts` | Criar post (professor) |
| PUT | `/posts/:id` | Editar post (professor) |
| DELETE | `/posts/:id` | Excluir post (professor) |

### Usuários
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/users` | Cadastrar usuário (professor) |
| GET | `/users` | Listar usuários com paginação |
| GET | `/users/:id` | Buscar usuário por ID |
| PUT | `/users/:id` | Editar usuário (professor) |
| DELETE | `/users/:id` | Excluir usuário (professor) |

---

# ⚙ Requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- Expo CLI via `npx expo`
- API da Fase 2 rodando localmente ou publicada

---

# 🛠 Setup Inicial

1. Instale as dependências:

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

---

# 🌐 Variável de Ambiente

| Variável | Descrição |
|----------|-----------|
| `EXPO_PUBLIC_API_BASE_URL` | URL base da API REST da Fase 2 |

Exemplo local:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

Exemplo para produção:

```env
EXPO_PUBLIC_API_BASE_URL=https://desafio-fiap-fase-2.onrender.com
```

---

# 📋 Scripts Disponíveis

- `npm run start` — inicia o Metro/Expo
- `npm run android` — abre o app em Android
- `npm run ios` — abre o app em iOS
- `npm run web` — abre a versão web pelo Expo
- `npm run typecheck` — valida o TypeScript sem emitir arquivos

---

# 🤖 Observação sobre Emulador Android

Se você rodar em emulador Android, o app converte automaticamente `localhost` e `127.0.0.1` para `10.0.2.2`, facilitando o consumo da API local da Fase 2 sem configuração adicional.

---

# 🗺 Guia de Uso

1. Acesse a **Home** para listar e buscar posts sem necessidade de login.
2. Toque em um card para ler o conteúdo completo do post.
3. Faça login como **professor** para liberar as áreas protegidas.
4. No painel administrativo, crie posts e navegue para a gestão de professores e alunos.
5. Use as telas de cadastro e edição para manter os usuários atualizados.

---

# 🧾 Conclusão

O projeto implementa um aplicativo mobile completo com:

- React Native + Expo
- TypeScript com contratos compartilhados
- Autenticação JWT com persistência de sessão
- Controle de permissões por papel (professor / aluno)
- Integração total com a API REST da Fase 2
- Gerenciamento completo de posts e usuários
- Navegação estruturada com React Navigation
- Validação de formulários com Zod
- Reaproveitamento de domínio e contratos das fases anteriores

Alinhado às boas práticas do mercado e aos requisitos do **Tech Challenge FIAP — Fase 4**.
