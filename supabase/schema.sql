-- ============================================================
-- SCHEMA COMPLETO — Casa Grande Drywall
-- Executar no Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- ─── Extensões ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── ENUMS ───────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('admin', 'vendedor', 'gestor_projeto');
CREATE TYPE lead_origem AS ENUM ('calculadora', 'contato', 'instagram', 'indicacao', 'whatsapp', 'manual');
CREATE TYPE lead_estagio AS ENUM ('novo', 'contato', 'qualificado', 'proposta', 'negociacao', 'ganho', 'perdido');
CREATE TYPE lead_servico AS ENUM ('drywall', 'eletrica', 'steel_frame', 'combinado', '');
CREATE TYPE interacao_tipo AS ENUM ('ligacao', 'email', 'whatsapp', 'reuniao');
CREATE TYPE orcamento_status AS ENUM ('rascunho', 'enviado', 'aprovado', 'recusado');
CREATE TYPE proposta_status AS ENUM ('negociacao', 'ganha', 'perdida');
CREATE TYPE projeto_status AS ENUM ('planejamento', 'em_andamento', 'concluido', 'pausado');
CREATE TYPE insumo_categoria AS ENUM ('drywall', 'perfis', 'eletrica', 'steel_frame', 'outros');
CREATE TYPE movimentacao_tipo AS ENUM ('entrada', 'saida');
CREATE TYPE compra_status AS ENUM ('pendente', 'recebido', 'cancelado');
CREATE TYPE portfolio_servico AS ENUM ('drywall', 'eletrica', 'steel_frame');

-- ─── 1. USUÁRIOS ──────────────────────────────────────────────
-- Complementa auth.users do Supabase
CREATE TABLE IF NOT EXISTS usuarios (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  papel       user_role NOT NULL DEFAULT 'vendedor',
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 2. LEADS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome                  TEXT NOT NULL,
  email                 TEXT DEFAULT '',
  telefone              TEXT NOT NULL,
  origem                lead_origem NOT NULL DEFAULT 'manual',
  servico_interesse     lead_servico DEFAULT '',
  estagio_funil         lead_estagio NOT NULL DEFAULT 'novo',
  valor_estimado_min    NUMERIC(12,2),
  valor_estimado_max    NUMERIC(12,2),
  obs                   TEXT DEFAULT '',
  criado_em             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_estagio   ON leads(estagio_funil);
CREATE INDEX IF NOT EXISTS idx_leads_origem    ON leads(origem);
CREATE INDEX IF NOT EXISTS idx_leads_criado    ON leads(criado_em DESC);

-- ─── 3. LEAD INTERAÇÕES ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS lead_interacoes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id     UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  tipo        interacao_tipo NOT NULL,
  nota        TEXT DEFAULT '',
  criado_por  TEXT NOT NULL DEFAULT 'Sandro',
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_int_lead ON lead_interacoes(lead_id);

-- ─── 4. CATÁLOGO DE SERVIÇOS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS servicos_catalogo (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome            TEXT NOT NULL,
  categoria       lead_servico NOT NULL,
  unidade_medida  TEXT NOT NULL DEFAULT 'm²',
  custo_base      NUMERIC(10,2) NOT NULL DEFAULT 0,
  preco_base      NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- ─── 5. ORÇAMENTOS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orcamentos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id       UUID NOT NULL REFERENCES leads(id) ON DELETE RESTRICT,
  projeto_id    UUID,  -- referência circular — adicionada depois
  status        orcamento_status NOT NULL DEFAULT 'rascunho',
  valor_total   NUMERIC(12,2) NOT NULL DEFAULT 0,
  versao_atual  INTEGER NOT NULL DEFAULT 1,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orc_lead   ON orcamentos(lead_id);
CREATE INDEX IF NOT EXISTS idx_orc_status ON orcamentos(status);

-- ─── 6. ORÇAMENTO REVISÕES ────────────────────────────────────
CREATE TABLE IF NOT EXISTS orcamento_revisoes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orcamento_id  UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
  versao        INTEGER NOT NULL DEFAULT 1,
  valor_total   NUMERIC(12,2) NOT NULL DEFAULT 0,
  itens_json    JSONB NOT NULL DEFAULT '[]',
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 7. ORÇAMENTO ITENS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS orcamento_itens (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orcamento_id          UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
  servico_catalogo_id   UUID REFERENCES servicos_catalogo(id),
  descricao             TEXT NOT NULL,
  quantidade            NUMERIC(10,2) NOT NULL DEFAULT 1,
  valor_unitario        NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- ─── 8. PROPOSTAS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS propostas (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orcamento_id    UUID NOT NULL REFERENCES orcamentos(id) ON DELETE RESTRICT,
  status          proposta_status NOT NULL DEFAULT 'negociacao',
  responsavel_id  UUID REFERENCES usuarios(id),
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 9. PROJETOS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projetos (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id           UUID NOT NULL REFERENCES leads(id),
  orcamento_id      UUID REFERENCES orcamentos(id),
  nome              TEXT NOT NULL,
  status            projeto_status NOT NULL DEFAULT 'planejamento',
  data_inicio       DATE,
  data_fim_prevista DATE,
  endereco          TEXT DEFAULT '',
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_proj_status ON projetos(status);

-- Agora pode adicionar FK circular
ALTER TABLE orcamentos ADD COLUMN IF NOT EXISTS
  projeto_id_fk UUID REFERENCES projetos(id);

-- ─── 10. PROJETO CRONOGRAMA ───────────────────────────────────
CREATE TABLE IF NOT EXISTS projeto_cronograma (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  projeto_id  UUID NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  etapa       TEXT NOT NULL,
  data_inicio DATE,
  data_fim    DATE,
  status      TEXT NOT NULL DEFAULT 'pendente'
    CHECK (status IN ('pendente','em_andamento','concluida'))
);

-- ─── 11. PROJETO EQUIPE ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS projeto_equipe (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  projeto_id  UUID NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  usuario_id  UUID REFERENCES usuarios(id),
  funcao      TEXT NOT NULL DEFAULT 'Técnico'
);

-- ─── 12. PROJETO DOCUMENTOS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS projeto_documentos (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  projeto_id     UUID NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  nome_arquivo   TEXT NOT NULL,
  url            TEXT NOT NULL,
  tipo           TEXT NOT NULL DEFAULT 'documento',
  enviado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 13. PROJETO STATUS LOG ───────────────────────────────────
CREATE TABLE IF NOT EXISTS projeto_status_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  projeto_id  UUID NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  descricao   TEXT NOT NULL,
  criado_por  TEXT NOT NULL DEFAULT 'Sandro',
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 14. INSUMOS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS insumos (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome            TEXT NOT NULL,
  categoria       insumo_categoria NOT NULL DEFAULT 'outros',
  unidade         TEXT NOT NULL DEFAULT 'unidade',
  estoque_atual   NUMERIC(12,2) NOT NULL DEFAULT 0,
  estoque_minimo  NUMERIC(12,2) NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_insumos_cat ON insumos(categoria);

-- ─── 15. INSUMO MOVIMENTAÇÕES ─────────────────────────────────
CREATE TABLE IF NOT EXISTS insumo_movimentacoes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  insumo_id   UUID NOT NULL REFERENCES insumos(id) ON DELETE CASCADE,
  tipo        movimentacao_tipo NOT NULL,
  quantidade  NUMERIC(12,2) NOT NULL,
  projeto_id  UUID REFERENCES projetos(id),
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 16. FORNECEDORES ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fornecedores (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome              TEXT NOT NULL,
  contato           TEXT DEFAULT '',
  telefone          TEXT DEFAULT '',
  email             TEXT DEFAULT '',
  categoria_insumos insumo_categoria NOT NULL DEFAULT 'outros'
);

-- ─── 17. COMPRAS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS compras (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fornecedor_id   UUID NOT NULL REFERENCES fornecedores(id),
  status          compra_status NOT NULL DEFAULT 'pendente',
  valor_total     NUMERIC(12,2) NOT NULL DEFAULT 0,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 18. COMPRA ITENS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS compra_itens (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  compra_id       UUID NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
  insumo_id       UUID NOT NULL REFERENCES insumos(id),
  quantidade      NUMERIC(12,2) NOT NULL,
  valor_unitario  NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- ─── 19. PORTFÓLIO ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolio_projetos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo        TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  servico       portfolio_servico NOT NULL,
  descricao     TEXT DEFAULT '',
  area          TEXT DEFAULT '',
  imagens_json  JSONB NOT NULL DEFAULT '[]',
  video_url     TEXT,
  publicado_em  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 20. BLOG POSTS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo        TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  resumo        TEXT DEFAULT '',
  conteudo      TEXT NOT NULL DEFAULT '',
  capa_url      TEXT,
  categoria     TEXT NOT NULL DEFAULT 'geral',
  publicado_em  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 21. DEPOIMENTOS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS depoimentos (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome_cliente            TEXT NOT NULL,
  texto                   TEXT NOT NULL,
  nota                    INTEGER NOT NULL DEFAULT 5 CHECK (nota BETWEEN 1 AND 5),
  foto_url                TEXT,
  projeto_relacionado_id  UUID REFERENCES projetos(id)
);

-- ─── 22. METAS DE VENDAS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS metas_vendas (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  periodo         TEXT NOT NULL,  -- YYYY-MM
  valor_meta      NUMERIC(12,2) NOT NULL DEFAULT 0,
  responsavel_id  UUID REFERENCES usuarios(id)
);

-- ─── 23. WHATSAPP SESSÕES (IA) ────────────────────────────────
CREATE TABLE IF NOT EXISTS whatsapp_sessoes (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telefone              TEXT NOT NULL,
  lead_id               UUID REFERENCES leads(id),
  status                TEXT NOT NULL DEFAULT 'ativa'
    CHECK (status IN ('ativa','qualificada','escalada','encerrada')),
  historico_json        JSONB NOT NULL DEFAULT '[]',
  servico_identificado  lead_servico DEFAULT '',
  dados_coletados_json  JSONB NOT NULL DEFAULT '{}',
  criado_em             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS whatsapp_escalacoes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sessao_id     UUID NOT NULL REFERENCES whatsapp_sessoes(id),
  motivo        TEXT NOT NULL
    CHECK (motivo IN ('lead_quente','pediu_humano','duvida_complexa','reclamacao')),
  notificado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atendido_em   TIMESTAMPTZ
);

-- ─── TRIGGER: atualiza atualizado_em automaticamente ──────────
CREATE OR REPLACE FUNCTION update_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_leads_updated
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();

CREATE TRIGGER trg_wa_sessoes_updated
  BEFORE UPDATE ON whatsapp_sessoes
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();

-- ─── SEED: catálogo de serviços ───────────────────────────────
INSERT INTO servicos_catalogo (nome, categoria, unidade_medida, custo_base, preco_base) VALUES
  ('Divisória simples (parede única)',     'drywall',     'm²',     90,  135),
  ('Parede dupla (insonorização)',         'drywall',     'm²',    140,  200),
  ('Forro de drywall',                    'drywall',     'm²',     80,  115),
  ('Ponto elétrico residencial',          'eletrica',    'ponto',   60,   90),
  ('Ponto elétrico comercial',            'eletrica',    'ponto',   80,  115),
  ('Circuito dedicado (AC/alta carga)',   'eletrica',    'unidade', 280, 400),
  ('Steel Frame — 1 pavimento',           'steel_frame', 'm²',     600,  875),
  ('Steel Frame — 2 pavimentos',          'steel_frame', 'm²',     720, 1025),
  ('Steel Frame — 3+ pavimentos',         'steel_frame', 'm²',     850, 1200),
  ('Vedação em Drywall (para SF)',        'steel_frame', 'm²',     240,  350)
ON CONFLICT DO NOTHING;

-- ─── SEED: portfólio inicial ──────────────────────────────────
INSERT INTO portfolio_projetos (titulo, slug, servico, area, descricao) VALUES
  ('Apartamento Alto do Cristo',   'apartamento-alto-do-cristo',  'drywall',     '85 m²',              'Divisórias em drywall duplo com isolamento acústico. Acabamento premium pronto para pintura. Prazo: 18 dias.'),
  ('Residência Gralha Azul',       'residencia-gralha-azul',      'steel_frame', '160 m²',             'Casa térrea em steel frame com 2 suítes e sala integrada. Entregue em 90 dias, contra 8 meses em alvenaria.'),
  ('Galpão Comercial Norte',       'galpao-comercial-norte',      'eletrica',    '48 pontos elétricos','Instalação elétrica completa. 3 circuitos dedicados, iluminação LED integrada. Norma NBR 5410.'),
  ('Studio Corporativo Centro',    'studio-corporativo-centro',   'drywall',     '120 m²',             'Divisórias e forro rebaixado com iluminação integrada. Acabamento corporativo premium.'),
  ('Casa Jardim Paraná',           'casa-jardim-parana',          'steel_frame', '200 m² · 2 pavimentos','Residência dois pavimentos em steel frame + drywall + elétrica integrada. Entregue em 110 dias.'),
  ('Retrofit Predial',             'retrofit-predial',            'eletrica',    '30 pontos comerciais','Retrofit elétrico em prédio comercial. Adequação NBR 5410 sem interromper funcionamento.')
ON CONFLICT (slug) DO NOTHING;

-- ─── SEED: depoimentos ────────────────────────────────────────
INSERT INTO depoimentos (nome_cliente, texto, nota) VALUES
  ('Lorena Salem Ribeiro', 'Super recomendo! Toda reforma da minha casa foi realizada por esta equipe, profissionais especializados e com um preço acessível. Souberam utilizar as minhas ideias e combiná-las com a expertise da empresa! Adorei!', 5),
  ('Carlos Eduardo Martins', 'Prazo cumprido à risca e acabamento impecável. A elétrica já saiu planejada junto com o drywall. Equipe respeitosa e atenta aos detalhes.', 5),
  ('Ana Paula Souza', 'Orçamento claro, sem surpresas na obra. Recomendo para quem quer previsibilidade. O steel frame acelerou muito nosso cronograma.', 5)
ON CONFLICT DO NOTHING;

-- ─── SEED: blog posts ─────────────────────────────────────────
INSERT INTO blog_posts (titulo, slug, resumo, conteudo, categoria) VALUES
  (
    'Drywall aguenta quadro pesado na parede?',
    'drywall-aguenta-quadro-pesado',
    'O que muda com parafusos e buchas certas — e quando você precisa de reforço estrutural.',
    E'## Drywall aguenta quadro pesado?\n\nSim — com as fixações certas. A placa de drywall padrão (12,5mm) suporta até **40kg por parafuso** quando fixado diretamente em um montante metálico.\n\n### Regras práticas\n\n- **Até 5kg:** Parafuso self-drilling direto na placa\n- **5–15kg:** Bucha de nylon específica para drywall\n- **15–40kg:** Parafuso fixado no montante metálico\n- **Acima de 40kg:** Reforço estrutural necessário',
    'drywall'
  ),
  (
    'Steel Frame x Alvenaria: o que pesa na decisão',
    'steel-frame-vs-alvenaria',
    'Prazo, custo e conforto térmico comparados de forma objetiva para ajudar na sua escolha.',
    E'## Steel Frame ou Alvenaria?\n\n| Critério | Steel Frame | Alvenaria |\n|----------|------------|----------|\n| **Prazo** | 60–120 dias | 8–18 meses |\n| **Peso estrutural** | −30 a 40% | Referência |\n| **Desperdício** | Até 5% | 15–25% |',
    'steel_frame'
  ),
  (
    'Quando planejar a elétrica na obra',
    'quando-planejar-eletrica-na-obra',
    'Evite quebrar parede pronta por ponto esquecido. O momento certo faz toda a diferença.',
    E'## O momento certo para a elétrica\n\nNa construção em drywall e steel frame, a elétrica é planejada **antes** de fechar as placas. Isso elimina toda a necessidade de cortes e recomposição.\n\n### Sequência ideal\n\n1. Estrutura metálica\n2. Passagem de eletrodutos\n3. Fechamento das placas\n4. Acabamento final',
    'eletrica'
  )
ON CONFLICT (slug) DO NOTHING;

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────
-- Habilitar RLS nas tabelas sensíveis
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_interacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE insumos ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;

-- Políticas: usuários autenticados têm acesso total (CRM interno)
CREATE POLICY "auth_full_access_leads" ON leads
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_full_access_interacoes" ON lead_interacoes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_full_access_orcamentos" ON orcamentos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_full_access_orcamento_itens" ON orcamento_itens
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_full_access_projetos" ON projetos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_full_access_insumos" ON insumos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_full_access_compras" ON compras
  FOR ALL USING (auth.role() = 'authenticated');

-- Tabelas públicas (leitura anônima para o site)
ALTER TABLE portfolio_projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE depoimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos_catalogo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_portfolio" ON portfolio_projetos FOR SELECT USING (true);
CREATE POLICY "public_read_blog"      ON blog_posts        FOR SELECT USING (true);
CREATE POLICY "public_read_deps"      ON depoimentos       FOR SELECT USING (true);
CREATE POLICY "public_read_catalogo"  ON servicos_catalogo FOR SELECT USING (true);

-- Inserção de leads e formulário de contato (via service_role no backend)
CREATE POLICY "anon_insert_leads" ON leads
  FOR INSERT WITH CHECK (true);
