import { NextResponse } from 'next/server'
import { calcularEstimativa } from '@/lib/calculadora/regras'
import type { LeadServico } from '@/types'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { servico, quantidade, detalhes, contato } = body

    if (!servico || !quantidade || !contato?.nome || !contato?.telefone) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    // 1. Calcular a estimativa
    const estimativa = await calcularEstimativa({
      servico: servico as LeadServico,
      quantidade: Number(quantidade),
      unidade: (servico === 'eletrica' ? 'pontos' : 'm2') as 'm2' | 'pontos',
      detalhes,
    })

    // 2. Tentar salvar o Lead no Supabase e disparar WPP
    try {
      // Usar a chave SERVICE_ROLE para bypass de RLS na inserção via API
      const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
      
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      
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

      // Disparo de notificação será feito pelo Supabase Edge Functions (via Database Webhook)

    } catch (dbError) {
      console.warn('Não foi possível salvar lead no DB:', dbError)
    }

    // 4. Retornar estimativa para a UI
    return NextResponse.json({ success: true, estimativa })

  } catch (err: any) {
    console.error('Erro /api/v1/orcamento-estimativa:', err)
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}


