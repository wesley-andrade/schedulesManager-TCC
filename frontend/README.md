# TimeWise Frontend

Este é o frontend do TimeWise, uma aplicação web moderna desenvolvida com React e TypeScript para gerenciamento de horários acadêmicos.

## 🎯 Sobre o Frontend

O TimeWise Frontend é uma interface moderna e intuitiva que permite:
- Gerenciar cursos, disciplinas e módulos
- Visualizar e gerenciar disponibilidade de professores
- Gerenciar salas de aula e seus tipos
- Criar e visualizar horários de aulas em um calendário interativo
- Controlar períodos acadêmicos
- Gerenciar usuários com diferentes níveis de acesso

## 🚀 Tecnologias Utilizadas

### Principais
- React 18
- TypeScript
- Vite
- React Router DOM
- React Query
- React Hook Form
- Zod

### UI/UX
- Tailwind CSS
- Radix UI
- Lucide Icons
- React Big Calendar
- React Day Picker
- Sonner (Toasts)

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
VITE_API_URL=http://localhost:3000
```

## 🚀 Executando o Projeto

Para desenvolvimento:
```bash
npm run dev
```

Para build de produção:
```bash
npm run build
```

Para preview do build:
```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
│   ├── ui/        # Componentes de UI base
│   ├── Header/    # Componentes do cabeçalho
│   ├── LoginForm/ # Componentes de autenticação
│   ├── ScheduleCalendar/ # Componentes do calendário
│   ├── academic-periods/ # Componentes de períodos acadêmicos
│   ├── disciplines/      # Componentes de disciplinas
│   ├── modules/         # Componentes de módulos
│   ├── rooms/          # Componentes de salas
│   ├── schedules/      # Componentes de horários
│   ├── teacher-availability/ # Componentes de disponibilidade
│   ├── teacher-disciplines/  # Componentes de disciplinas dos professores
│   └── users/          # Componentes de usuários
├── config/         # Configurações da aplicação
├── contexts/       # Contextos do React
├── hooks/          # Custom hooks
├── lib/           # Bibliotecas e utilitários
├── pages/         # Páginas da aplicação
│   ├── AcademicPeriodManagement.tsx
│   ├── DisciplineManagement.tsx
│   ├── Index.tsx
│   ├── Login.tsx
│   ├── ModuleManagement.tsx
│   ├── RoomManagement.tsx
│   ├── ScheduleManagement.tsx
│   ├── TeacherAvailabilityManagement.tsx
│   ├── TeacherDisciplineManagement.tsx
│   └── UserManagement.tsx
├── services/      # Serviços de API
│   ├── academicPeriodService.ts
│   ├── api.ts
│   ├── courseService.ts
│   ├── disciplineCourseService.ts
│   ├── disciplineModuleService.ts
│   ├── disciplineService.ts
│   ├── moduleService.ts
│   ├── roomService.ts
│   ├── scheduleService.ts
│   ├── teacherAvailabilityService.ts
│   ├── teacherDisciplineService.ts
│   ├── teacherService.ts
│   ├── timeSlotService.ts
│   └── userService.ts
└── utils/         # Funções utilitárias
```

## 🎨 Componentes Principais

### Layout
- `Header`: Cabeçalho com informações do usuário e ações globais
- `ProtectedRoute`: Componente para proteção de rotas autenticadas
- `Logo`: Componente do logo da aplicação

### Páginas
- `Login`: Página de autenticação
- `Index`: Dashboard principal
- `UserManagement`: Gerenciamento de usuários
- `DisciplineManagement`: Gerenciamento de disciplinas
- `ModuleManagement`: Gerenciamento de módulos
- `RoomManagement`: Gerenciamento de salas
- `ScheduleManagement`: Gerenciamento de horários
- `TeacherAvailabilityManagement`: Gerenciamento de disponibilidade
- `TeacherDisciplineManagement`: Gerenciamento de disciplinas dos professores
- `AcademicPeriodManagement`: Gerenciamento de períodos acadêmicos

### Serviços
- `api.ts`: Configuração base da API
- `userService.ts`: Serviços de usuário
- `disciplineService.ts`: Serviços de disciplina
- `moduleService.ts`: Serviços de módulo
- `roomService.ts`: Serviços de sala
- `scheduleService.ts`: Serviços de horário
- `teacherAvailabilityService.ts`: Serviços de disponibilidade
- `teacherDisciplineService.ts`: Serviços de disciplinas dos professores
- `academicPeriodService.ts`: Serviços de período acadêmico

## 🔄 Fluxo de Dados

1. **Autenticação**
   - Login com email e senha
   - Gerenciamento de tokens JWT
   - Proteção de rotas

2. **Gerenciamento de Estado**
   - React Query para cache e gerenciamento de estado do servidor
   - Context API para estado global
   - React Hook Form para formulários

3. **Validação**
   - Zod para validação de esquemas
   - Validação em tempo real nos formulários
   - Feedback visual de erros

## 🎯 Funcionalidades Principais

### Autenticação
- Login com email e senha
- Proteção de rotas baseada em permissões

### Gerenciamento de Usuários
- Listagem de usuários
- Criação e edição
- Definição de papéis (admin/standard)

### Gerenciamento de Disciplinas
- Listagem de disciplinas
- Criação e edição
- Configuração de requisitos
- Associação com cursos e professores

### Gerenciamento de Módulos
- Listagem de módulos
- Criação e edição
- Configuração de capacidade
- Associação com disciplinas

### Gerenciamento de Salas
- Listagem de salas
- Cadastro e edição
- Configuração de capacidade
- Definição de tipo (Comum, Laboratório, Auditório)

### Gerenciamento de Horários
- Visualização em calendário
- Criação de horários
- Drag and drop de eventos
- Conflitos de horário
- Filtros por curso/disciplina/professor

### Gerenciamento de Disponibilidade
- Visualização de disponibilidade dos professores
- Definição de horários disponíveis
- Conflitos de horário

### Gerenciamento de Períodos Acadêmicos
- Listagem de períodos
- Criação e edição
- Configuração de datas
- Associação com módulos

## 🎨 Temas e Estilização

- Design responsivo
- Componentes acessíveis
- Animações suaves
- Feedback visual consistente

## 📱 Responsividade

- Layout adaptativo
- Componentes responsivos
- Otimização para diferentes dispositivos

## 🔒 Segurança

- Validação de dados
- Sanitização de inputs
- Proteção contra XSS
- Gerenciamento seguro de tokens
- Timeout de sessão

## 📦 Build e Deploy

1. Build do projeto:
```bash
npm run build
```

2. Preview do build:
```bash
npm run preview
```

3. Deploy:
O projeto pode ser deployado em qualquer serviço de hospedagem estática como:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request