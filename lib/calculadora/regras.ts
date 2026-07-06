// Regras de cálculo da Calculadora de Orçamento
// Baseado em: Guia_Precificacao_Calculadora_Casa_Grande.md
// ⚠️ Validar valores com Sandro antes do lançamento em produção

import type { EstimativaInput, EstimativaResult, BreakdownItem } from '@/types'

// Tabela de preços base (por unidade)
export const TABELA_PRECOS = {
  drywall: {
    simples: { label: 'Divisória simples (parede única)', preco: 135, min_mult: 0.9, max_mult: 1.25 },
    dupla:   { label: 'Parede dupla (insonorização)',     preco: 200, min_mult: 0.9, max_mult: 1.25 },
    forro:   { label: 'Forro de drywall',                 preco: 115, min_mult: 0.9, max_mult: 1.25 },
  },
  eletrica: {
    residencial: { label: 'Ponto elétrico residencial', preco: 90 },
    comercial:   { label: 'Ponto elétrico comercial',   preco: 115 },
    ac_unit:     { label: 'Circuito dedicado AC/alta carga', preco: 400 },
  },
  steel: {
    '1': { label: 'Steel Frame — 1 pavimento',    preco: 875 },
    '2': { label: 'Steel Frame — 2 pavimentos',   preco: 1025 },
    '3': { label: 'Steel Frame — 3+ pavimentos',  preco: 1200 },
    vedacao: { label: 'Vedação em Drywall',       preco: 350 },
  },
  desconto_combo: 0.15,
} as const

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v)
}

export function calcularEstimativa(input: EstimativaInput): EstimativaResult {
  const { servico, quantidade, detalhes = {} } = input
  let base = 0
  const breakdown: BreakdownItem[] = []

  if (servico === 'drywall') {
    const tipo = (detalhes.tipo as keyof typeof TABELA_PRECOS.drywall) || 'simples'
    const t = TABELA_PRECOS.drywall[tipo]
    base = quantidade * t.preco
    breakdown.push({ descricao: `${t.label} — ${quantidade} m²`, valor: base })
  }

  else if (servico === 'eletrica') {
    const tOp = (detalhes.tipo_obra === 'comercial') ? 'comercial' : 'residencial'
    const rateP = TABELA_PRECOS.eletrica[tOp].preco
    const pontosCost = quantidade * rateP
    base += pontosCost
    breakdown.push({ descricao: `${quantidade} pontos (${tOp}) × ${fmt(rateP)}`, valor: pontosCost })
    const ac = detalhes.ac_units || 0
    if (ac > 0) {
      const acCost = ac * TABELA_PRECOS.eletrica.ac_unit.preco
      base += acCost
      breakdown.push({ descricao: `${ac} circuito(s) dedicado(s) AC`, valor: acCost })
    }
  }

  else if (servico === 'steel_frame') {
    const pavKey = String(Math.min(detalhes.pavimentos || 1, 3)) as '1' | '2' | '3'
    const rateS = TABELA_PRECOS.steel[pavKey].preco
    const sfCost = quantidade * rateS
    base += sfCost
    breakdown.push({ descricao: `Estrutura SF ${pavKey} pav. × ${quantidade} m²`, valor: sfCost })
    if (detalhes.com_vedacao) {
      const dwCost = quantidade * TABELA_PRECOS.steel.vedacao.preco
      base += dwCost
      breakdown.push({ descricao: `Vedação Drywall × ${quantidade} m²`, valor: dwCost })
    }
  }

  else if (servico === 'combinado') {
    // quantidade = sf_area; detalhes deve conter dw_area e el_pontos
    const sfCost = quantidade * TABELA_PRECOS.steel['1'].preco
    breakdown.push({ descricao: `Steel Frame (${quantidade} m²)`, valor: sfCost })
    base += sfCost

    // extra fields passed via detalhes (custom)
    const dwArea = (detalhes as unknown as Record<string, number>).dw_area || 0
    const elPontos = (detalhes as unknown as Record<string, number>).el_pontos || 0
    if (dwArea) {
      const d = dwArea * TABELA_PRECOS.drywall.simples.preco
      base += d
      breakdown.push({ descricao: `Drywall (${dwArea} m²)`, valor: d })
    }
    if (elPontos) {
      const e = elPontos * TABELA_PRECOS.eletrica.residencial.preco
      base += e
      breakdown.push({ descricao: `Elétrica (${elPontos} pts)`, valor: e })
    }
    const desconto = base * TABELA_PRECOS.desconto_combo
    base -= desconto
    breakdown.push({ descricao: 'Desconto integração (−15%)', valor: -desconto })
  }

  const min = Math.round(base * 0.9)
  const max = Math.round(base * 1.25)
  const medio = Math.round((min + max) / 2)

  return {
    id: `est_${Date.now()}`,
    servico,
    quantidade,
    valor_minimo: min,
    valor_maximo: max,
    valor_medio: medio,
    moeda: 'BRL',
    vigencia_dias: 7,
    breakdown,
    obs: 'Estimativa válida por 7 dias. Preço final definido após visita técnica gratuita.',
    criado_em: new Date().toISOString(),
  }
}
