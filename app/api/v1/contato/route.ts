import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { nome, telefone, email, mensagem } = await req.json()

    if (!nome || !telefone || !mensagem) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    try {
      const supabase = await createClient()
      
      // Salvar como Lead (origem: contato manual)
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .insert([{
          nome,
          telefone,
          email: email || '',
          origem: 'contato',
          estagio_funil: 'novo',
          obs: `Mensagem via formulário de contato:\n\n${mensagem}`
        }])
        .select('id')
        .single()

      if (lead && !leadError) {
        await supabase.from('lead_interacoes').insert([{
          lead_id: lead.id,
          tipo: 'email',
          nota: 'Lead criado via formulário de contato do site.',
          criado_por: 'Sistema'
        }])
      }
    } catch (dbError) {
      console.warn('Erro ao salvar contato no Supabase:', dbError)
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Erro /api/v1/contato:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
