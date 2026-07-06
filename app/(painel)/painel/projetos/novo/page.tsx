import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NovoProjetoPage() {
  const sb = await createClient()
  const { data: leads } = await sb.from('leads').select('id, nome, estagio_funil').eq('estagio_funil', 'ganho')

  async function saveProjeto(formData: FormData) {
    'use server'
    const nome = formData.get('nome') as string
    const lead_id = formData.get('lead_id') as string || null
    const status = formData.get('status') as string
    const data_fim = formData.get('data_fim_prevista') as string
    
    const sb = await createClient()
    const { error } = await sb.from('projetos').insert([{
      nome,
      lead_id: lead_id === 'none' ? null : lead_id,
      status,
      data_fim_prevista: data_fim || null,
    }])

    if (!error) {
      redirect('/painel/projetos')
    } else {
      console.error(error)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/painel/projetos" className="text-muted hover:text-text flex items-center gap-2 text-sm transition-colors">
          <ArrowLeft size={16} /> Voltar para Projetos
        </Link>
      </div>

      <h1 className="display text-3xl mb-8">Novo Projeto</h1>

      <div className="card p-6">
        <form action={saveProjeto} className="space-y-6">
          
          <div>
            <label className="form-label">Nome do Projeto</label>
            <input type="text" name="nome" required className="form-input" placeholder="Ex: Reforma Comercial Centro" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Status Inicial</label>
              <select name="status" required className="form-input bg-panel">
                <option value="em_planejamento">Em Planejamento</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
                <option value="pausado">Pausado</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">Previsão de Fim</label>
              <input type="date" name="data_fim_prevista" className="form-input" />
            </div>
          </div>

          <div>
            <label className="form-label">Vincular a um Cliente (Lead Ganho)</label>
            <select name="lead_id" className="form-input bg-panel">
              <option value="none">-- Nenhum (Projeto Independente) --</option>
              {leads?.map(lead => (
                <option key={lead.id} value={lead.id}>{lead.nome}</option>
              ))}
            </select>
            <p className="text-xs text-muted mt-2">Apenas leads com estágio "Ganho" aparecem nesta lista.</p>
          </div>

          <div className="pt-4 flex gap-4">
            <Link href="/painel/projetos" className="btn-outline">Cancelar</Link>
            <button type="submit" className="btn-gold">Criar Projeto</button>
          </div>
        </form>
      </div>
    </div>
  )
}
