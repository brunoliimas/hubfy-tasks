# Hubfy Tasks

Sistema de gerenciamento de tarefas full-stack desenvolvido como desafio técnico para a Hubfy.ai.

## 🚀 Tecnologias

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma 7 ORM
- **Banco de Dados**: MySQL 8
- **Autenticação**: JWT (JSON Web Token)
- **Containerização**: Docker & Docker Compose
- **Testes**: Jest

## 📋 Funcionalidades

- ✅ Cadastro e autenticação de usuários
- ✅ CRUD completo de tarefas
- ✅ Filtros por status (pendente, em progresso, concluída)
- ✅ Proteção de rotas (frontend e backend)
- ✅ Isolamento de dados por usuário
- ✅ Interface responsiva
- ✅ Testes automatizados

## 🛠️ Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/brunoliimas/hubfy-tasks
cd hubfy-tasks
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="sua_chave_secreta_aqui"
```

### 4. Inicie o banco de dados

```bash
docker compose up -d
```

### 5. Execute as migrations

```bash
npx prisma migrate dev
```

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🧪 Testes

Para executar os testes, certifique-se de que o servidor está rodando:

```bash
# Em um terminal
npm run dev

# Em outro terminal
npm test
```

### Cobertura de Testes

- **Unitários**: Hash de senha, geração/verificação de JWT
- **Integração**: API de autenticação (register, login)
- **Integração**: API de tarefas (CRUD completo)

## 📁 Estrutura do Projeto

```
hubfy-tasks/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── register/route.ts
│   │   │   └── tasks/
│   │   │       ├── route.ts
│   │   │       └── [id]/route.ts
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   └── TaskFilter.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── db.ts
│   │   ├── auth.ts
│   │   ├── middleware.ts
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   └── __tests__/
│       ├── setup.ts
│       ├── auth.test.ts
│       └── tasks.test.ts
├── prisma/
│   ├── schema.prisma
│   └── prisma.config.ts
├── docker-compose.yml
├── .env.example
├── README.md
└── API.md
```

## 🔐 Segurança

- Senhas hasheadas com bcrypt (salt rounds: 10)
- Autenticação via JWT com expiração de 1 hora
- Proteção contra SQL Injection via Prisma ORM
- Isolamento de dados por usuário
- Validação de inputs em todas as rotas

## 📖 Documentação da API

Consulte o arquivo [API.md](./API.md) para documentação completa dos endpoints.

## 🐳 Docker

O projeto inclui configuração Docker para o banco de dados:

```bash
# Iniciar containers
docker compose up -d

# Verificar logs
docker compose logs -f

# Parar containers
docker compose down

# Limpar volumes (reset do banco)
docker compose down -v
```

### Serviços

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| MySQL | 3306 | Banco de dados |
| Adminer | 8080 | Interface web para o banco |

## 📝 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm start` | Inicia o servidor de produção |
| `npm test` | Executa os testes |
| `npm run lint` | Executa o linter |

## 👤 Autor

Bruno Lima

## 📄 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.
