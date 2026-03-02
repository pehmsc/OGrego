# OGrego 🫒

> *"Aqui, come-se devagar, conversa-se mais e volta-se sempre."*

Aplicação web full-stack moderna para o restaurante **O Grego** — sistema completo de gestão de encomendas, reservas e clientes, com painel administrativo, programa de fidelidade e integração de pagamentos.

---

## Funcionalidades

### Área Pública
- Página principal com hero section dinâmico
- Menu do restaurante com categorias
- Galeria de fotos com carrossel
- Secção de promoções (imagens geridas via Cloudflare R2)
- Sistema de reservas (nome, email, telefone, data, hora, número de pessoas)
- Página de contactos

### Área do Utilizador (autenticado)
- Histórico de encomendas com detalhes
- Programa de fidelidade por níveis: **Bronze → Prata → Ouro → Platina**
  - 1 ponto por cada euro gasto
  - Descontos progressivos: 5%, 8%, 10%, 15%
- Carrinho de compras com drawer interativo
- Checkout com opção de **entrega** ou **takeaway**
- Gestão de endereço de entrega
- Emails de confirmação de encomenda
- Geração de recibo em PDF
- Sistema de feedback e avaliações

### Painel Administrativo
- Dashboard com métricas em tempo real (hoje, semana, mês, 6 meses, 12 meses)
- Gráficos de vendas por categoria e período
- Gestão de encomendas e estados
- Gestão de reservas
- Gestão de utilizadores
- Gestão de recibos
- Feed de atividade recente

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js + React 19 |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS 4 + shadcn/ui |
| Base de Dados | PostgreSQL (Neon Cloud) |
| Autenticação | Clerk |
| Pagamentos | Stripe |
| Armazenamento | Cloudflare R2 (S3-compatible) |
| Email | Nodemailer + Resend |
| PDF | jsPDF |
| Validação | Zod + React Hook Form |
| Package Manager | pnpm |

---

## Pré-requisitos

- Node.js 20+
- pnpm 10+
- Conta [Neon](https://neon.tech) (PostgreSQL)
- Conta [Clerk](https://clerk.com) (autenticação)
- Conta [Stripe](https://stripe.com) (pagamentos)
- Conta [Cloudflare R2](https://www.cloudflare.com/products/r2/) (armazenamento)
- Conta [Resend](https://resend.com) (email) — opcional

---

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/pehmsc/OGrego.git
cd OGrego

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Preencher as variáveis (ver secção abaixo)

# Iniciar em modo desenvolvimento
pnpm dev
Variáveis de Ambiente
Criar um ficheiro .env.local na raiz do projeto com as seguintes variáveis:


# Base de Dados (Neon PostgreSQL)
DATABASE_URL=
POSTGRES_URL=
POSTGRES_URL_NON_POOLING=
PGHOST=
PGUSER=
PGPASSWORD=
PGDATABASE=

# Clerk (Autenticação)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/entrar
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/criar-conta
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Stripe (Pagamentos)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Cloudflare R2 (Armazenamento)
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# Email
EMAIL_USER=
EMAIL_PASS=
RESEND_API_KEY=
Scripts Disponíveis

pnpm dev        # Servidor de desenvolvimento (Webpack)
pnpm build      # Build de produção
pnpm start      # Iniciar servidor de produção
pnpm lint       # Verificar erros de linting
pnpm typecheck  # Verificar tipos TypeScript
Estrutura do Projeto

/app
  /(site)          # Páginas públicas (menu, galeria, promos, contactos)
  /(auth)          # Páginas de autenticação
  /admin           # Painel administrativo
  /user            # Área do utilizador autenticado
  /api             # API Routes (reservas, stripe, clerk webhooks...)
  /lib             # Utilitários e server actions
  /ui              # Componentes e secções reutilizáveis
/public            # Assets estáticos
Webhooks
Para desenvolvimento local, utilizar o Stripe CLI e o Clerk Dashboard para reencaminhar webhooks:


# Stripe
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Clerk — configurar endpoint no dashboard:
# https://your-app.vercel.app/api/webhooks/clerk
Equipa
Projeto desenvolvido em equipa como projeto académico de desenvolvimento web com Next.js.

Licença
Este projeto é de carácter académico/educativo.


