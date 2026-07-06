import { NextResponse } from 'next/server'
import { calcularEstimativa } from '@/lib/calculadora/regras'
import { createClient } from '@/lib/supabase/server'
import type { LeadServico } from '@/types'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { servico, quantidade, detalhes, contato } = body

    if (!servico || !quantidade || !contato?.nome || !contato?.telefone) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    // 1. Calcular a estimativa
    const estimativa = calcularEstimativa({
      servico: servico as LeadServico,
      quantidade: Number(quantidade),
      unidade: (servico === 'eletrica' ? 'pontos' : 'm2') as 'm2' | 'pontos',
      detalhes,
    })

    // 2. Tentar salvar o Lead no Supabase
    try {
      const supabase = await createClient()
      
      // Inserir Lead
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .insert([{
          nome: contato.nome,
          telefone: contato.telefone,
          origem: 'calculadora',
          servico_interesse: servico,
          estagio_funil: 'novo',
          valor_estimado_min: estimativa.valor_minimo,
          valor_estimado_max: estimativa.valor_maximo,
          obs: `Gerado pela calculadora. Detalhes: ${JSON.stringify(detalhes)}`
        }])
        .select('id')
        .single()

      // Registrar interação
      if (lead && !leadError) {
        await supabase.from('lead_interacoes').insert([{
          lead_id: lead.id,
          tipo: 'whatsapp',
          nota: 'Lead gerou estimativa pela calculadora web.',
          criado_por: 'Sistema'
        }])
      }
    } catch (dbError) {
      // Falha no DB não deve quebrar a UI da calculadora.
      // Em Fase 1 (sem keys), o createClient vai falhar ou retornar null silenciosamente.
      console.warn('Não foi possível salvar lead no DB:', dbError)
    }

    // 3. Retornar estimativa para a UI
    return NextResponse.json({ success: true, estimativa })

  } catch (err: any) {
    console.error('Erro /api/v1/orcamento-estimativa:', err)
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}
