// Mock data — Casa Grande Drywall
// Usado na Fase 1 (sem banco real). Substitua por chamadas ao Supabase na Fase 2.

import type {
  Lead, LeadInteracao, Orcamento, Projeto, Insumo, Fornecedor,
  PortfolioProjeto, BlogPost, Depoimento, ServicoCatalogo, FunilAgregado
} from '@/types'

// ──────────────────────────────────────────────
// SERVIÇOS CATÁLOGO (base para calculadora)
// ──────────────────────────────────────────────
export const SERVICOS_CATALOGO: ServicoCatalogo[] = [
  { id: 'cat-1', nome: 'Divisória simples (parede única)', categoria: 'drywall', unidade_medida: 'm²', custo_base: 90, preco_base: 135 },
  { id: 'cat-2', nome: 'Parede dupla (insonorização)', categoria: 'drywall', unidade_medida: 'm²', custo_base: 140, preco_base: 200 },
  { id: 'cat-3', nome: 'Forro de drywall', categoria: 'drywall', unidade_medida: 'm²', custo_base: 80, preco_base: 115 },
  { id: 'cat-4', nome: 'Ponto elétrico residencial', categoria: 'eletrica', unidade_medida: 'ponto', custo_base: 60, preco_base: 90 },
  { id: 'cat-5', nome: 'Ponto elétrico comercial', categoria: 'eletrica', unidade_medida: 'ponto', custo_base: 80, preco_base: 115 },
  { id: 'cat-6', nome: 'Circuito dedicado ar-condicionado', categoria: 'eletrica', unidade_medida: 'unidade', custo_base: 280, preco_base: 400 },
  { id: 'cat-7', nome: 'Steel Frame 1 pavimento', categoria: 'steel_frame', unidade_medida: 'm²', custo_base: 600, preco_base: 875 },
  { id: 'cat-8', nome: 'Steel Frame 2 pavimentos', categoria: 'steel_frame', unidade_medida: 'm²', custo_base: 720, preco_base: 1025 },
  { id: 'cat-9', nome: 'Steel Frame 3+ pavimentos', categoria: 'steel_frame', unidade_medida: 'm²', custo_base: 850, preco_base: 1200 },
  { id: 'cat-10', nome: 'Vedação Steel Frame (drywall)', categoria: 'steel_frame', unidade_medida: 'm²', custo_base: 240, preco_base: 350 },
]

// ──────────────────────────────────────────────
// LEADS
// ──────────────────────────────────────────────
export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1', nome: 'Carlos Eduardo Martins', email: 'carlos@email.com',
    telefone: '(42) 9 9123-4567', origem: 'instagram', servico_interesse: 'steel_frame',
    estagio_funil: 'proposta', valor_estimado_min: 120000, valor_estimado_max: 180000,
    obs: 'Casa 2 pavimentos em Telêmaco Borba. Quer começar em agosto.',
    criado_em: new Date(Date.now() - 864e5 * 5).toISOString(),
    atualizado_em: new Date(Date.now() - 864e5 * 2).toISOString(),
  },
  {
    id: 'lead-2', nome: 'Fernanda Oliveira', email: 'fernanda@gmail.com',
    telefone: '(42) 9 8765-4321', origem: 'calculadora', servico_interesse: 'drywall',
    estagio_funil: 'contato', valor_estimado_min: 7200, valor_estimado_max: 10000,
    obs: 'Divisória sala/quarto, apartamento no centro',
    criado_em: new Date(Date.now() - 864e5 * 3).toISOString(),
    atualizado_em: new Date(Date.now() - 864e5 * 1).toISOString(),
  },
  {
    id: 'lead-3', nome: 'Marcelo Pereira', email: 'marcelo@empresa.com.br',
    telefone: '(42) 9 9876-5432', origem: 'indicacao', servico_interesse: 'eletrica',
    estagio_funil: 'novo', valor_estimado_min: 2500, valor_estimado_max: 3800,
    obs: 'Galpão comercial, ~30 pontos elétricos',
    criado_em: new Date(Date.now() - 864e5).toISOString(),
    atualizado_em: new Date(Date.now() - 864e5).toISOString(),
  },
  {
    id: 'lead-4', nome: 'Lorena Salem Ribeiro', email: 'lorena@email.com',
    telefone: '(42) 9 9000-0001', origem: 'whatsapp', servico_interesse: 'combinado',
    estagio_funil: 'ganho', valor_estimado_min: 140000, valor_estimado_max: 200000,
    obs: 'Reforma completa da casa — steel frame + drywall + elétrica. Projeto concluído.',
    criado_em: new Date(Date.now() - 864e5 * 30).toISOString(),
    atualizado_em: new Date(Date.now() - 864e5 * 5).toISOString(),
  },
  {
    id: 'lead-5', nome: 'Roberto Alves', email: '',
    telefone: '(42) 9 9111-2222', origem: 'manual', servico_interesse: 'drywall',
    estagio_funil: 'perdido', valor_estimado_min: 4500, valor_estimado_max: 6000,
    obs: 'Forro e divisórias para escritório. Optou por outro fornecedor.',
    criado_em: new Date(Date.now() - 864e5 * 15).toISOString(),
    atualizado_em: new Date(Date.now() - 864e5 * 10).toISOString(),
  },
  {
    id: 'lead-6', nome: 'Ana Paula Souza', email: 'ana@construtora.com',
    telefone: '(42) 9 7654-3210', origem: 'contato', servico_interesse: 'steel_frame',
    estagio_funil: 'qualificado', valor_estimado_min: 85000, valor_estimado_max: 110000,
    obs: 'Construtora parceira. Quer testar steel frame em projeto piloto.',
    criado_em: new Date(Date.now() - 864e5 * 2).toISOString(),
    atualizado_em: new Date(Date.now() - 864e5).toISOString(),
  },
]

export const MOCK_INTERACOES: LeadInteracao[] = [
  { id: 'int-1', lead_id: 'lead-1', tipo: 'whatsapp', nota: 'Primeiro contato. Enviou planta do terreno.', criado_por: 'Sandro', criado_em: new Date(Date.now() - 864e5 * 4).toISOString() },
  { id: 'int-2', lead_id: 'lead-1', tipo: 'reuniao', nota: 'Visita técnica realizada. Proposta em elaboração.', criado_por: 'Sandro', criado_em: new Date(Date.now() - 864e5 * 2).toISOString() },
  { id: 'int-3', lead_id: 'lead-2', tipo: 'ligacao', nota: 'Ligação de follow-up. Cliente quer ver amostras.', criado_por: 'Sandro', criado_em: new Date(Date.now() - 864e5).toISOString() },
]

export function getMockFunil(): FunilAgregado[] {
  const estagios = ['novo', 'contato', 'qualificado', 'proposta', 'negociacao', 'ganho', 'perdido'] as const
  return estagios.map(e => ({
    estagio: e,
    count: MOCK_LEADS.filter(l => l.estagio_funil === e).length,
    valor_total: MOCK_LEADS
      .filter(l => l.estagio_funil === e)
      .reduce((s, l) => s + (l.valor_estimado_min || 0), 0),
  }))
}

// ──────────────────────────────────────────────
// ORÇAMENTOS
// ──────────────────────────────────────────────
export const MOCK_ORCAMENTOS: Orcamento[] = [
  {
    id: 'orc-1', lead_id: 'lead-1', status: 'enviado',
    valor_total: 155000, versao_atual: 2,
    criado_em: new Date(Date.now() - 864e5 * 3).toISOString(),
    lead: MOCK_LEADS[0],
  },
  {
    id: 'orc-2', lead_id: 'lead-4', status: 'aprovado',
    valor_total: 178500, versao_atual: 1,
    criado_em: new Date(Date.now() - 864e5 * 25).toISOString(),
    lead: MOCK_LEADS[3],
  },
  {
    id: 'orc-3', lead_id: 'lead-2', status: 'rascunho',
    valor_total: 8400, versao_atual: 1,
    criado_em: new Date(Date.now() - 864e5).toISOString(),
    lead: MOCK_LEADS[1],
  },
]

// ──────────────────────────────────────────────
// PROJETOS
// ──────────────────────────────────────────────
export const MOCK_PROJETOS: Projeto[] = [
  {
    id: 'proj-1', lead_id: 'lead-4', orcamento_id: 'orc-2',
    nome: 'Residência Lorena Salem Ribeiro',
    status: 'concluido', data_inicio: '2026-01-10', data_fim_prevista: '2026-03-20',
    endereco: 'Telêmaco Borba, PR',
    criado_em: new Date(Date.now() - 864e5 * 90).toISOString(),
    lead: MOCK_LEADS[3],
  },
  {
    id: 'proj-2', lead_id: 'lead-1', orcamento_id: 'orc-1',
    nome: 'Casa Carlos Eduardo — Steel Frame',
    status: 'planejamento', data_inicio: '2026-08-01', data_fim_prevista: '2026-11-30',
    endereco: 'Telêmaco Borba, PR',
    criado_em: new Date(Date.now() - 864e5 * 2).toISOString(),
    lead: MOCK_LEADS[0],
  },
]

// ──────────────────────────────────────────────
// INSUMOS
// ──────────────────────────────────────────────
export const MOCK_INSUMOS: Insumo[] = [
  { id: 'ins-1', nome: 'Placa de Drywall Standard 12,5mm', categoria: 'drywall', unidade: 'm²', estoque_atual: 420, estoque_minimo: 100 },
  { id: 'ins-2', nome: 'Placa de Drywall RU (resistente umidade)', categoria: 'drywall', unidade: 'm²', estoque_atual: 85, estoque_minimo: 60 },
  { id: 'ins-3', nome: 'Perfil Guia 70mm (6m)', categoria: 'perfis', unidade: 'barra', estoque_atual: 200, estoque_minimo: 50 },
  { id: 'ins-4', nome: 'Perfil Montante 70mm (3m)', categoria: 'perfis', unidade: 'barra', estoque_atual: 310, estoque_minimo: 80 },
  { id: 'ins-5', nome: 'Fio Elétrico 2,5mm² (rolo 100m)', categoria: 'eletrica', unidade: 'rolo', estoque_atual: 8, estoque_minimo: 10 },
  { id: 'ins-6', nome: 'Caixa de Tomada Embutida', categoria: 'eletrica', unidade: 'unidade', estoque_atual: 245, estoque_minimo: 50 },
  { id: 'ins-7', nome: 'Perfil Ue 90 Steel Frame (6m)', categoria: 'steel_frame', unidade: 'barra', estoque_atual: 180, estoque_minimo: 40 },
  { id: 'ins-8', nome: 'Fita de papel microperfurada', categoria: 'drywall', unidade: 'rolo', estoque_atual: 42, estoque_minimo: 20 },
]

export const MOCK_FORNECEDORES: Fornecedor[] = [
  { id: 'forn-1', nome: 'Distribuidora Placo Paraná', contato: 'Gerência Comercial', telefone: '(42) 3210-0000', email: 'vendas@placo.com.br', categoria_insumos: 'drywall' },
  { id: 'forn-2', nome: 'Eletronorte Telêmaco', contato: 'João Barbosa', telefone: '(42) 9 8888-1234', email: 'joao@eletronorte.com', categoria_insumos: 'eletrica' },
  { id: 'forn-3', nome: 'AçoFlex Steel Components', contato: 'Paula Mendes', telefone: '(42) 3222-5555', email: 'paula@acoflex.com.br', categoria_insumos: 'steel_frame' },
]

// ──────────────────────────────────────────────
// PORTFÓLIO
// ──────────────────────────────────────────────
export const MOCK_PORTFOLIO: PortfolioProjeto[] = [
  {
    id: 'port-1', titulo: 'Apartamento Alto do Cristo', slug: 'apartamento-alto-do-cristo',
    servico: 'drywall', area: '85 m²',
    descricao: 'Divisórias em drywall duplo com isolamento acústico. Acabamento premium pronto para pintura. Projeto residencial de alto padrão em Telêmaco Borba. Prazo: 18 dias.',
    imagens_json: [], video_url: undefined,
    publicado_em: new Date(Date.now() - 864e5 * 60).toISOString(),
  },
  {
    id: 'port-2', titulo: 'Residência Gralha Azul', slug: 'residencia-gralha-azul',
    servico: 'steel_frame', area: '160 m²',
    descricao: 'Casa térrea em steel frame com 2 suítes e sala de estar integrada. Cronograma de 90 dias, contra 8 meses em alvenaria convencional. Redução de peso em 30%.',
    imagens_json: [], video_url: undefined,
    publicado_em: new Date(Date.now() - 864e5 * 90).toISOString(),
  },
  {
    id: 'port-3', titulo: 'Galpão Comercial Norte', slug: 'galpao-comercial-norte',
    servico: 'eletrica', area: '48 pontos',
    descricao: 'Instalação elétrica completa de galpão comercial. 48 pontos, 3 circuitos dedicados para equipamentos de alta carga, iluminação LED integrada. Norma NBR 5410.',
    imagens_json: [], video_url: undefined,
    publicado_em: new Date(Date.now() - 864e5 * 45).toISOString(),
  },
  {
    id: 'port-4', titulo: 'Studio Corporativo Centro', slug: 'studio-corporativo-centro',
    servico: 'drywall', area: '120 m²',
    descricao: 'Divisórias drywall para separação de ambientes em escritório. Forro rebaixado com iluminação integrada. Acabamento corporativo de alto padrão.',
    imagens_json: [], video_url: undefined,
    publicado_em: new Date(Date.now() - 864e5 * 120).toISOString(),
  },
  {
    id: 'port-5', titulo: 'Casa Jardim Paraná', slug: 'casa-jardim-parana',
    servico: 'steel_frame', area: '200 m² · 2 pavimentos',
    descricao: 'Residência dois pavimentos em steel frame. Estrutura + vedação drywall + instalação elétrica integrada. Entregue em 110 dias.',
    imagens_json: [], video_url: undefined,
    publicado_em: new Date(Date.now() - 864e5 * 150).toISOString(),
  },
  {
    id: 'port-6', titulo: 'Retrofit Predial', slug: 'retrofit-predial',
    servico: 'eletrica', area: '30 pontos · Comercial',
    descricao: 'Retrofit elétrico em prédio comercial. Adequação às normas NBR 5410. Troca de quadros, fiação e luminárias sem interromper funcionamento do prédio.',
    imagens_json: [], video_url: undefined,
    publicado_em: new Date(Date.now() - 864e5 * 30).toISOString(),
  },
]

// ──────────────────────────────────────────────
// BLOG
// ──────────────────────────────────────────────
export const MOCK_BLOG: BlogPost[] = [
  {
    id: 'blog-1', titulo: 'Drywall aguenta quadro pesado na parede?',
    slug: 'drywall-aguenta-quadro-pesado',
    resumo: 'O que muda com parafusos e buchas certas — e quando você precisa de reforço estrutural.',
    conteudo: `## Drywall aguenta quadro pesado?

Sim — com as fixações certas. A placa de drywall padrão (12,5mm) suporta até **40kg por parafuso** quando fixado diretamente em um montante metálico. Para quadros mais pesados, use bucha de expansão plástica ou buchas especiais para drywall.

### Regras práticas

- **Até 5kg:** Parafuso self-drilling direto na placa
- **5–15kg:** Bucha de nylon específica para drywall  
- **15–40kg:** Parafuso fixado no montante metálico
- **Acima de 40kg:** Reforço estrutural (chapas de madeirite ou perfis extras)

### Como identificar um montante

Bata levemente na parede com o nó dos dedos. Som mais sólido = há montante. Som oco = parede vazia entre montantes.

### Nossa recomendação

Sempre informe à equipe na hora da obra o que vai pendurar. Podemos prever reforços durante a montagem, sem custo extra.`,
    categoria: 'drywall', capa_url: undefined,
    publicado_em: new Date(Date.now() - 864e5 * 10).toISOString(),
  },
  {
    id: 'blog-2', titulo: 'Steel Frame x Alvenaria: o que pesa na decisão',
    slug: 'steel-frame-vs-alvenaria',
    resumo: 'Prazo, custo e conforto térmico comparados de forma objetiva para ajudar na sua escolha.',
    conteudo: `## Steel Frame ou Alvenaria?

Comparação direta entre os dois sistemas para quem está no momento de decidir.

| Critério | Steel Frame | Alvenaria |
|----------|------------|-----------|
| **Prazo** | 60–120 dias | 8–18 meses |
| **Peso estrutural** | −30 a 40% | Referência |
| **Desperdício de material** | Até 5% | 15–25% |
| **Conforto acústico** | Requer isolamento extra | Natural em paredes duplas |
| **Resistência ao fogo** | NBR 14432 compliant | Alta naturalmente |
| **Custo** | Similar ou até menor | Referência |

### Quando escolher Steel Frame

- Prazo é crítico (obra em menos de 4 meses)
- Terreno com capacidade portante reduzida
- Construção modular ou expansível no futuro
- Projeto com muitos vãos abertos`,
    categoria: 'steel_frame', capa_url: undefined,
    publicado_em: new Date(Date.now() - 864e5 * 20).toISOString(),
  },
  {
    id: 'blog-3', titulo: 'Quando planejar a elétrica na obra',
    slug: 'quando-planejar-eletrica-na-obra',
    resumo: 'Evite quebrar parede pronta por ponto esquecido. O momento certo faz toda a diferença.',
    conteudo: `## O momento certo para a elétrica

Na construção em drywall e steel frame, a elétrica é planejada **antes** de fechar as placas. Isso elimina toda a necessidade de cortes e recomposição.

### Sequência ideal

1. **Estrutura metálica:** montagem dos perfis
2. **Passagem de eletrodutos:** fixados nos perfis antes de qualquer placa
3. **Fechamento das placas:** drywall fecha por cima
4. **Acabamento:** apenas puxar os fios e instalar as peças

### O que sempre esquecem

- Tomada para aspirador de pó (chão, área de serviço)
- Ponto para câmera de segurança (sanca ou forro)
- Circuito dedicado para forno/lavadora
- Torneira elétrica (exige circuito próprio)

### Nossa abordagem

Fazemos um mapa de pontos junto com o cliente antes de começar. Nenhum retrabalho.`,
    categoria: 'eletrica', capa_url: undefined,
    publicado_em: new Date(Date.now() - 864e5 * 5).toISOString(),
  },
]

// ──────────────────────────────────────────────
// DEPOIMENTOS
// ──────────────────────────────────────────────
export const MOCK_DEPOIMENTOS: Depoimento[] = [
  {
    id: 'dep-1', nome_cliente: 'Lorena Salem Ribeiro', nota: 5,
    texto: 'Super recomendo! Toda reforma da minha casa foi realizada por esta equipe, profissionais especializados e com um preço acessível. Souberam utilizar as minhas ideias e combiná-las com a expertise da empresa! Adorei!',
    foto_url: undefined, projeto_relacionado_id: 'proj-1',
  },
  {
    id: 'dep-2', nome_cliente: 'Carlos Eduardo Martins', nota: 5,
    texto: 'Prazo cumprido à risca e acabamento impecável. A elétrica já saiu planejada junto com o drywall. Equipe respeitosa e atenta aos detalhes — trabalho de altíssima qualidade.',
    foto_url: undefined,
  },
  {
    id: 'dep-3', nome_cliente: 'Ana Paula Souza', nota: 5,
    texto: 'Orçamento claro, sem surpresas na obra. Recomendo para quem quer previsibilidade. O steel frame acelerou muito nosso cronograma e o resultado final ficou incrível.',
    foto_url: undefined,
  },
]

// ──────────────────────────────────────────────
// RELATÓRIOS HELPERS
// ──────────────────────────────────────────────
export function getMockKPIs() {
  const now = new Date()
  const mesAtual = MOCK_LEADS.filter(l => {
    const d = new Date(l.criado_em)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  return {
    total_leads: MOCK_LEADS.length,
    leads_mes: mesAtual.length,
    propostas_ativas: MOCK_LEADS.filter(l => l.estagio_funil === 'proposta').length,
    ganhos: MOCK_LEADS.filter(l => l.estagio_funil === 'ganho').length,
    valor_pipeline: MOCK_LEADS
      .filter(l => !['perdido', 'ganho'].includes(l.estagio_funil))
      .reduce((s, l) => s + (l.valor_estimado_min || 0), 0),
    orcamentos_pendentes: MOCK_ORCAMENTOS.filter(o => o.status === 'enviado').length,
    projetos_andamento: MOCK_PROJETOS.filter(p => p.status === 'em_andamento').length,
  }
}
