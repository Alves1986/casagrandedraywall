# Casa Grande Drywall - Sistema e CRM Integrado

Este é o repositório oficial do sistema web e CRM da **Casa Grande Drywall**. O projeto inclui um site público focado em alta conversão e um painel administrativo (CRM) completo, ambos integrados com o backend no **Supabase**.

## 🚀 Arquitetura e Tecnologias

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Linguagem**: TypeScript
- **Estilização**: TailwindCSS 4 (Utility-first e globals.css com variáveis CSS)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Ícones**: Lucide React
- **Hospedagem Recomendada**: Vercel

## 🏗️ Estrutura do Projeto

O projeto está estruturado utilizando Route Groups do Next.js App Router para separar os contextos:

- `app/(site)/`: Contém as rotas do site público (Home, Serviços, Blog, Contato, Calculadora).
- `app/(painel)/`: Contém as rotas do CRM privado (Dashboard, Leads, Orçamentos, Projetos, Insumos).
- `app/api/`: Endpoints de API para servir as lógicas de servidor e integração com o Supabase de forma segura.
- `lib/`: Utilitários compartilhados, clientes Supabase, e lógica de negócios (regras da calculadora).
- `components/`: Componentes modulares, divididos entre `site/`, `painel/` e `ui/`.

## 🔒 Segurança (Variáveis de Ambiente e Frontend)

Para garantir a máxima segurança dos dados do Supabase, este projeto adota uma abordagem de segurança **exclusivamente Server-Side**.

1. **Variáveis Sem Prefixo Público**:
   As chaves de API não possuem o prefixo `NEXT_PUBLIC_` no arquivo `.env.local`. Isso garante que elas nunca sejam empacotadas (bundled) no JavaScript enviado ao navegador.
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

2. **Arquitetura Server Components**:
   Todas as leituras de banco (como renderizar a lista de Leads) acontecem no backend via Server Components. O navegador do cliente não recebe nenhuma chave e não se conecta diretamente ao banco de dados.

## 💾 Banco de Dados (Supabase)

O esquema relacional robusto (18 tabelas) está documentado no arquivo `supabase/schema.sql`. Ele inclui:
- **Tabelas de Gestão**: `leads`, `orcamentos`, `projetos`, `insumos`, `movimentacoes_estoque`, `fornecedores`.
- **Conteúdo Público**: `portfolio_projetos`, `blog_posts`, `depoimentos`.
- **Views e Triggers**: Atualizações automáticas de estoque e sumários de KPIs.
- **Row Level Security (RLS)**: Totalmente configurado para proteger os dados por padrão.

## 📦 Supabase Storage & Edge Functions

- **Storage**: O script `supabase/storage.sql` define a criação dos buckets `portfolio` (Público) e `projetos` (Privado), juntamente com todas as regras RLS para garantir que apenas administradores façam upload de arquivos.
- **Edge Functions**: Um template de notificação está configurado em `supabase/functions/notification-webhook/`. Pode ser usado para integração via Database Webhooks (ex: Disparar zapier/mensagem quando um lead cair na base).

## 💻 Como Rodar o Projeto Localmente

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente:
   Crie um arquivo `.env.local` na raiz contendo as seguintes variáveis:
   ```env
   SUPABASE_URL=sua_url_do_supabase
   SUPABASE_ANON_KEY=sua_anon_key_do_supabase
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_WHATSAPP_SANDRO=55429...
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---
*Este sistema foi gerado em 2026 como base sólida, expansível e de alto desempenho para modernizar a gestão de obras e captura de clientes no setor de Drywall e LSF.*
