# API Documentation

Base URL: `http://localhost:3000/api`

## Autenticação

A API utiliza JWT (JSON Web Token) para autenticação. Após fazer login, inclua o token no header de todas as requisições protegidas:

```
Authorization: Bearer <token>
```

---

## Endpoints

### Autenticação

#### POST /auth/register

Registra um novo usuário.

**Request Body:**

```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123456"
}
```

**Validações:**
- `name`: obrigatório
- `email`: obrigatório, formato válido, único
- `password`: obrigatório, mínimo 8 caracteres

**Response (201 Created):**

```json
{
  "message": "Usuário registrado com sucesso.",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@exemplo.com"
  }
}
```

**Erros:**

| Status | Descrição |
|--------|-----------|
| 400 | Campos inválidos ou faltando |
| 409 | Email já cadastrado |
| 500 | Erro interno do servidor |

---

#### POST /auth/login

Autentica um usuário e retorna o token JWT.

**Request Body:**

```json
{
  "email": "joao@exemplo.com",
  "password": "senha123456"
}
```

**Response (200 OK):**

```json
{
  "message": "Login realizado com sucesso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@exemplo.com"
  }
}
```

**Erros:**

| Status | Descrição |
|--------|-----------|
| 400 | Campos obrigatórios faltando |
| 401 | Credenciais inválidas |
| 500 | Erro interno do servidor |

---

### Tarefas

> ⚠️ Todos os endpoints de tarefas requerem autenticação.

#### GET /tasks

Lista todas as tarefas do usuário autenticado.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Finalizar relatório",
      "description": "Relatório mensal de vendas",
      "status": "pending",
      "userId": 1,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "title": "Reunião com cliente",
      "description": "Apresentar proposta comercial",
      "status": "in_progress",
      "userId": 1,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T14:00:00.000Z"
    }
  ]
}
```

**Erros:**

| Status | Descrição |
|--------|-----------|
| 401 | Token ausente ou inválido |
| 500 | Erro interno do servidor |

---

#### POST /tasks

Cria uma nova tarefa.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Nova tarefa",
  "description": "Descrição opcional",
  "status": "pending"
}
```

**Campos:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| title | string | Sim | Título da tarefa |
| description | string | Não | Descrição detalhada |
| status | string | Não | Status inicial (default: "pending") |

**Status válidos:**
- `pending` - Pendente
- `in_progress` - Em progresso
- `completed` - Concluída

**Response (201 Created):**

```json
{
  "message": "Tarefa criada com sucesso.",
  "task": {
    "id": 3,
    "title": "Nova tarefa",
    "description": "Descrição opcional",
    "status": "pending",
    "userId": 1,
    "createdAt": "2024-01-15T15:00:00.000Z",
    "updatedAt": "2024-01-15T15:00:00.000Z"
  }
}
```

**Erros:**

| Status | Descrição |
|--------|-----------|
| 400 | Título não informado ou status inválido |
| 401 | Token ausente ou inválido |
| 500 | Erro interno do servidor |

---

#### PUT /tasks/:id

Atualiza uma tarefa existente.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (todos opcionais):**

```json
{
  "title": "Título atualizado",
  "description": "Nova descrição",
  "status": "completed"
}
```

**Response (200 OK):**

```json
{
  "message": "Tarefa atualizada com sucesso.",
  "task": {
    "id": 3,
    "title": "Título atualizado",
    "description": "Nova descrição",
    "status": "completed",
    "userId": 1,
    "createdAt": "2024-01-15T15:00:00.000Z",
    "updatedAt": "2024-01-15T16:00:00.000Z"
  }
}
```

**Erros:**

| Status | Descrição |
|--------|-----------|
| 400 | Status inválido |
| 401 | Token ausente ou inválido |
| 403 | Tarefa pertence a outro usuário |
| 404 | Tarefa não encontrada |
| 500 | Erro interno do servidor |

---

#### DELETE /tasks/:id

Remove uma tarefa.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "message": "Tarefa excluída com sucesso."
}
```

**Erros:**

| Status | Descrição |
|--------|-----------|
| 401 | Token ausente ou inválido |
| 403 | Tarefa pertence a outro usuário |
| 404 | Tarefa não encontrada |
| 500 | Erro interno do servidor |

---

## Exemplos com cURL

### Registrar usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@exemplo.com","password":"senha123456"}'
```

### Fazer login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@exemplo.com","password":"senha123456"}'
```

### Listar tarefas

```bash
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <seu-token>"
```

### Criar tarefa

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{"title":"Minha tarefa","description":"Descrição","status":"pending"}'
```

### Atualizar tarefa

```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{"status":"completed"}'
```

### Deletar tarefa

```bash
curl -X DELETE http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer <seu-token>"
```

---

## Códigos de Status

| Código | Significado |
|--------|-------------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Acesso negado |
| 404 | Recurso não encontrado |
| 409 | Conflito (recurso já existe) |
| 500 | Erro interno do servidor |
