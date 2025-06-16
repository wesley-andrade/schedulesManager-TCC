# API do TimeWise

Este é o backend do TimeWise, uma API RESTful desenvolvida em Node.js com TypeScript para gerenciamento de horários acadêmicos.

## 🎯 Sobre o Backend

O TimeWise é um sistema de gerenciamento de horários acadêmicos que permite:
- Gerenciar cursos, disciplinas e módulos
- Controlar disponibilidade de professores
- Gerenciar salas de aula e seus tipos (Comum, Laboratório, Auditório)
- Criar e gerenciar horários de aulas
- Controlar períodos acadêmicos
- Gerenciar usuários com diferentes níveis de acesso (admin e standard)

## 🚀 Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- Prisma (ORM)
- MySQL
- JWT para autenticação
- Zod para validação de dados

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- MySQL
- npm ou yarn

## 🔧 Instalação

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
DATABASE_URL="mysql://user:password@localhost:3306/timewise"
JWT_SECRET="seu_segredo_jwt"
```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

## 🚀 Executando o Projeto

Para desenvolvimento:
```bash
npm run dev
```

Para produção:
```bash
npm run build
npm start
```

## 📚 Endpoints da API

### Autenticação

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "Senha#123"
}
```

Resposta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Usuário Exemplo",
    "email": "usuario@exemplo.com",
    "role": "admin"
  }
}
```

#### Registro
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Novo Usuário",
  "email": "novo@exemplo.com",
  "password": "Senha#123",
  "role": "standard"
}
```

### Usuários

#### Listar Usuários
```http
GET /users
Authorization: Bearer seu_token_jwt
```

#### Criar Usuário
```http
POST /users
Authorization: Bearer seu_token_jwt
Content-Type: application/json

{
  "name": "Novo Usuário",
  "email": "novo@exemplo.com",
  "password": "Senha#123",
  "role": "standard"
}
```

### Cursos

#### Listar Cursos
```http
GET /courses
Authorization: Bearer seu_token_jwt
```

#### Criar Curso
```http
POST /courses
Authorization: Bearer seu_token_jwt
Content-Type: application/json

{
  "name": "Medicina"
}
```

### Disciplinas

#### Listar Disciplinas
```http
GET /disciplines
Authorization: Bearer seu_token_jwt
```

#### Criar Disciplina
```http
POST /disciplines
Authorization: Bearer seu_token_jwt
Content-Type: application/json

{
  "name": "Anatomia",
  "totalHours": 60,
  "requiredRoomType": "Comum"
}
```

### Professores

#### Listar Professores
```http
GET /teachers
Authorization: Bearer seu_token_jwt
```

#### Criar Professor
```http
POST /teachers
Authorization: Bearer seu_token_jwt
Content-Type: application/json

{
  "name": "Professor Exemplo",
  "email": "professor@exemplo.com",
  "password": "Senha#123",
  "phone": "11999999999"
}
```

### Disponibilidade dos Professores

#### Listar Disponibilidades
```http
GET /teacher-availability
Authorization: Bearer seu_token_jwt
```

#### Criar Disponibilidade
```http
POST /teacher-availability
Authorization: Bearer seu_token_jwt
Content-Type: application/json

{
  "teacherId": 1,
  "scheduleId": 1,
  "status": true
}
```

### Salas

#### Listar Salas
```http
GET /rooms
Authorization: Bearer seu_token_jwt
```

#### Criar Sala
```http
POST /rooms
Authorization: Bearer seu_token_jwt
Content-Type: application/json

{
  "name": "Sala 101",
  "seatsAmount": 30,
  "type": "Comum"
}
```

### Horários

#### Listar Horários
```http
GET /schedules
Authorization: Bearer seu_token_jwt
```

#### Criar Horário
```http
POST /schedules
Authorization: Bearer seu_token_jwt
Content-Type: application/json

{
  "dayOfWeek": "Segunda",
  "timeSlotId": 1
}
```

### Períodos Acadêmicos

#### Listar Períodos Acadêmicos
```http
GET /academic-periods
Authorization: Bearer seu_token_jwt
```

#### Criar Período Acadêmico
```http
POST /academic-periods
Authorization: Bearer seu_token_jwt
Content-Type: application/json

{
  "name": "2025.1",
  "startDate": "2025-02-01T00:00:00.000Z",
  "endDate": "2025-07-31T23:59:59.999Z"
}
```

## 🔒 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Para acessar endpoints protegidos, inclua o token no header da requisição:

```
Authorization: Bearer seu_token_jwt
```

## 📝 Validação de Dados

A API utiliza o Zod para validação de dados. Todos os dados de entrada são validados antes de serem processados. Exemplos de validações:

- Email deve ser um endereço válido
- Senha deve ter no mínimo 6 caracteres
- Números de telefone devem seguir o formato brasileiro
- Datas devem estar em formato ISO
- Enums devem corresponder aos valores permitidos

## 🔄 Relacionamentos Principais

- Um Usuário pode ser um Professor
- Um Professor pode ter múltiplas Disponibilidades
- Uma Disciplina pode estar associada a múltiplos Cursos
- Uma Disciplina pode ter múltiplos Professores
- Um Horário pode ter múltiplas Salas associadas
- Um Módulo pode ter múltiplas Disciplinas
- Um Período Acadêmico pode ter múltiplos Módulos

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request