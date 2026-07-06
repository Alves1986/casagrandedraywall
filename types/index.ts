// Tipos TypeScript completos — schema do Documento Técnico Base
// Casa Grande Drywall

export type UserRole = 'admin' | 'vendedor' | 'gestor_projeto'

export interface Usuario {
  id: string
  nome: string
  email: string
  papel: UserRole
  criado_em: string
}

// ──────────────────────────────────────────────
// LEADS & CRM
// ──────────────────────────────────────────────
export type LeadOrigem = 'calculadora' | 'contato' | 'instagram' | 'indicacao' | 'whatsapp' | 'manual'
export type LeadEstagio =
  | 'novo'
  | 'contato'
  | 'qualificado'
  | 'proposta'
  | 'negociacao'
  | 'ganho'
  | 'perdido'
export type LeadServico = 'drywall' | 'eletrica' | 'steel_frame' | 'combinado' | ''

export interface Lead {
  id: string
  nome: string
  email: string
  telefone: string
  origem: LeadOrigem
  servico_interesse: LeadServico
  estagio_funil: LeadEstagio
  valor_estimado_min?: number
  valor_estimado_max?: number
  obs?: string
  criado_em: string
  atualizado_em: string
}

export interface LeadInteracao {
  id: string
  lead_id: string
  tipo: 'ligacao' | 'email' | 'whatsapp' | 'reuniao'
  nota: string
  criado_por: string
  criado_em: string
}

export interface FunilAgregado {
  estagio: LeadEstagio
  count: number
  valor_total: number
}

// ──────────────────────────────────────────────
// ORÇAMENTOS
// ──────────────────────────────────────────────
export type OrcamentoStatus = 'rascunho' | 'enviado' | 'aprovado' | 'recusado'

export interface Orcamento {
  id: string
  lead_id: string
  projeto_id?: string
  status: OrcamentoStatus
  valor_total: number
  versao_atual: number
  criado_em: string
  lead?: Lead
}

export interface OrcamentoRevisao {
  id: string
  orcamento_id: string
  versao: number
  valor_total: number
  itens_json: OrcamentoItem[]
  criado_em: string
}

export interface OrcamentoItem {
  id: string
  orcamento_id: string
  servico_catalogo_id?: string
  descricao: string
  quantidade: number
  valor_unitario: number
  valor_total: number
}

// ──────────────────────────────────────────────
// PROPOSTAS & VENDAS
// ──────────────────────────────────────────────
export type PropostaStatus = 'negociacao' | 'ganha' | 'perdida'

export interface Proposta {
  id: string
  orcamento_id: string
  status: PropostaStatus
  responsavel_id: string
  criado_em: string
  orcamento?: Orcamento
}

export interface MetaVendas {
  id: string
  periodo: string // YYYY-MM
  valor_meta: number
  responsavel_id: string
}

// ──────────────────────────────────────────────
// PROJETOS
// ──────────────────────────────────────────────
export type ProjetoStatus = 'planejamento' | 'em_andamento' | 'concluido' | 'pausado'

export interface Projeto {
  id: string
  lead_id: string
  orcamento_id: string
  nome: string
  status: ProjetoStatus
  data_inicio?: string
  data_fim_prevista?: string
  endereco?: string
  criado_em: string
  lead?: Lead
}

export interface ProjetoCronograma {
  id: string
  projeto_id: string
  etapa: string
  data_inicio: string
  data_fim: string
  status: 'pendente' | 'em_andamento' | 'concluida'
}

export interface ProjetoEquipe {
  id: string
  projeto_id: string
  usuario_id: string
  funcao: string
  usuario?: Usuario
}

export interface ProjetoDocumento {
  id: string
  projeto_id: string
  nome_arquivo: string
  url: string
  tipo: string
  enviado_em: string
}

export interface ProjetoStatusLog {
  id: string
  projeto_id: string
  descricao: string
  criado_por: string
  criado_em: string
}

// ──────────────────────────────────────────────
// INSUMOS & FORNECEDORES
// ──────────────────────────────────────────────
export type InsumoCategoria = 'drywall' | 'perfis' | 'eletrica' | 'steel_frame' | 'outros'

export interface Insumo {
  id: string
  nome: string
  categoria: InsumoCategoria
  unidade: string
  estoque_atual: number
  estoque_minimo: number
}

export interface InsumoMovimentacao {
  id: string
  insumo_id: string
  tipo: 'entrada' | 'saida'
  quantidade: number
  projeto_id?: string
  criado_em: string
}

export interface Fornecedor {
  id: string
  nome: string
  contato: string
  telefone: string
  email: string
  categoria_insumos: InsumoCategoria
}

export type CompraStatus = 'pendente' | 'recebido' | 'cancelado'

export interface Compra {
  id: string
  fornecedor_id: string
  status: CompraStatus
  valor_total: number
  criado_em: string
  fornecedor?: Fornecedor
  itens?: CompraItem[]
}

export interface CompraItem {
  id: string
  compra_id: string
  insumo_id: string
  quantidade: number
  valor_unitario: number
  insumo?: Insumo
}

// ──────────────────────────────────────────────
// CATÁLOGO DE SERVIÇOS
// ──────────────────────────────────────────────
export interface ServicoCatalogo {
  id: string
  nome: string
  categoria: LeadServico
  unidade_medida: string // m², pontos, etc.
  custo_base: number
  preco_base: number
}

// ──────────────────────────────────────────────
// CONTEÚDO (SITE)
// ──────────────────────────────────────────────
export type PortfolioServico = 'drywall' | 'eletrica' | 'steel_frame'

export interface PortfolioProjeto {
  id: string
  titulo: string
  slug: string
  servico: PortfolioServico
  descricao: string
  imagens_json: string[]
  video_url?: string
  area?: string
  publicado_em: string
}

export interface BlogPost {
  id: string
  titulo: string
  slug: string
  conteudo: string
  capa_url?: string
  resumo?: string
  categoria: PortfolioServico | 'geral'
  publicado_em: string
}

export interface Depoimento {
  id: string
  nome_cliente: string
  texto: string
  nota: number // 1-5
  foto_url?: string
  projeto_relacionado_id?: string
}

// ──────────────────────────────────────────────
// CALCULADORA
// ──────────────────────────────────────────────
export interface EstimativaInput {
  servico: LeadServico
  quantidade: number
  unidade: 'm2' | 'pontos'
  detalhes?: {
    tipo?: string
    pavimentos?: number
    com_vedacao?: boolean
    tipo_obra?: string
    ac_units?: number
  }
}

export interface EstimativaResult {
  id: string
  servico: LeadServico
  quantidade: number
  valor_minimo: number
  valor_maximo: number
  valor_medio: number
  moeda: 'BRL'
  vigencia_dias: number
  breakdown: BreakdownItem[]
  obs: string
  criado_em: string
}

export interface BreakdownItem {
  descricao: string
  valor: number
}

// ──────────────────────────────────────────────
// API REQUEST/RESPONSE HELPERS
// ──────────────────────────────────────────────
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
}

export interface LeadFormData {
  nome: string
  email: string
  telefone: string
  origem: LeadOrigem
  servico_interesse?: LeadServico
  estimativa_id?: string
  detalhes_projeto?: {
    quantidade?: number
    unidade?: string
    valor_estimado_minimo?: number
    valor_estimado_maximo?: number
  }
}

export interface ContatoFormData {
  nome: string
  email: string
  telefone?: string
  mensagem: string
}
