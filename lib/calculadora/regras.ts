// Regras de cálculo da Calculadora de Orçamento
// Baseado em: Guia_Precificacao_Calculadora_Casa_Grande.md
// ⚠️ Validar valores com Sandro antes do lançamento em produção

import type { EstimativaInput, EstimativaResult, BreakdownItem } from '@/types'

import { createClient } from '@/lib/supabase/server'

// Fallback local se o banco falhar
export const DEFAULT_PRECOS = {
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
}

export async function getTabelaPrecos() {
  try {
    const sb = await createClient()
    const { data } = await sb.from('configuracoes_precos').select('chave, valor')
    
    if (data && data.length > 0) {
      // Clonar os padrões e injetar os valores do banco
      const p = JSON.parse(JSON.stringify(DEFAULT_PRECOS))
      for (const row of data) {
        const val = Number(row.valor)
        if (row.chave === 'drywall.simples') p.drywall.simples.preco = val
        if (row.chave === 'drywall.dupla') p.drywall.dupla.preco = val
        if (row.chave === 'drywall.forro') p.drywall.forro.preco = val
        if (row.chave === 'eletrica.residencial') p.eletrica.residencial.preco = val
        if (row.chave === 'eletrica.comercial') p.eletrica.comercial.preco = val
        if (row.chave === 'eletrica.ac_unit') p.eletrica.ac_unit.preco = val
        if (row.chave === 'steel.1') p.steel['1'].preco = val
        if (row.chave === 'steel.2') p.steel['2'].preco = val
        if (row.chave === 'steel.3') p.steel['3'].preco = val
        if (row.chave === 'steel.vedacao') p.steel.vedacao.preco = val
        if (row.chave === 'desconto_combo') p.desconto_combo = val
      }
      return p as typeof DEFAULT_PRECOS
    }
  } catch (e) {
    console.warn("Erro ao buscar preços do supabase, usando defaults", e)
  }
  return DEFAULT_PRECOS
}

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v)
}

export async function calcularEstimativa(input: EstimativaInput): Promise<EstimativaResult> {
  const { servico, quantidade, detalhes = {} } = input
  let base = 0
  const breakdown: BreakdownItem[] = []
  
  const tabela = await getTabelaPrecos()

  if (servico === 'drywall') {
    const tipo = (detalhes.tipo as keyof typeof tabela.drywall) || 'simples'
    const t = tabela.drywall[tipo]
    base = quantidade * t.preco
    breakdown.push({ descricao: `${t.label} — ${quantidade} m²`, valor: base })
  }

  else if (servico === 'eletrica') {
    const tOp = (detalhes.tipo_obra === 'comercial') ? 'comercial' : 'residencial'
    const rateP = tabela.eletrica[tOp].preco
    const pontosCost = quantidade * rateP
    base += pontosCost
    breakdown.push({ descricao: `${quantidade} pontos (${tOp}) × ${fmt(rateP)}`, valor: pontosCost })
    const ac = detalhes.ac_units || 0
    if (ac > 0) {
      const acCost = ac * tabela.eletrica.ac_unit.preco
      base += acCost
      breakdown.push({ descricao: `${ac} circuito(s) dedicado(s) AC`, valor: acCost })
    }
  }

  else if (servico === 'steel_frame') {
    const pavKey = String(Math.min(detalhes.pavimentos || 1, 3)) as '1' | '2' | '3'
    const rateS = tabela.steel[pavKey].preco
    const sfCost = quantidade * rateS
    base += sfCost
    breakdown.push({ descricao: `Estrutura SF ${pavKey} pav. × ${quantidade} m²`, valor: sfCost })
    if (detalhes.com_vedacao) {
      const dwCost = quantidade * tabela.steel.vedacao.preco
      base += dwCost
      breakdown.push({ descricao: `Vedação Drywall × ${quantidade} m²`, valor: dwCost })
    }
  }

  else if (servico === 'combinado') {
    // quantidade = sf_area; detalhes deve conter dw_area e el_pontos
    const sfCost = quantidade * tabela.steel['1'].preco
    breakdown.push({ descricao: `Steel Frame (${quantidade} m²)`, valor: sfCost })
    base += sfCost

    // extra fields passed via detalhes (custom)
    const dwArea = (detalhes as unknown as Record<string, number>).dw_area || 0
    const elPontos = (detalhes as unknown as Record<string, number>).el_pontos || 0
    if (dwArea) {
      const d = dwArea * tabela.drywall.simples.preco
      base += d
      breakdown.push({ descricao: `Drywall (${dwArea} m²)`, valor: d })
    }
    if (elPontos) {
      const e = elPontos * tabela.eletrica.residencial.preco
      base += e
      breakdown.push({ descricao: `Elétrica (${elPontos} pts)`, valor: e })
    }
    const desconto = base * tabela.desconto_combo
    base -= desconto
    breakdown.push({ descricao: 'Desconto integração (−' + (tabela.desconto_combo*100) + '%)', valor: -desconto })
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
