import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NovoOrcamentoPage() {
  const sb = await createClient()
  const { data: leads } = await sb.from('leads').select('id, nome, estagio_funil')

  async function saveOrcamento(formData: FormData) {
    'use server'
    const lead_id = formData.get('lead_id') as string
    const valor_total = Number(formData.get('valor_total'))
    const data_validade = formData.get('data_validade') as string
    const status = formData.get('status') as string
    const notas = formData.get('notas') as string

    const sb = await createClient()
    const { error } = await sb.from('orcamentos').insert([{
      lead_id,
      valor_total,
      data_validade: data_validade || null,
      status,
      notas: notas || null,
    }])

    if (!error) {
      redirect('/painel/orcamentos')
    } else {
      console.error(error)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/painel/orcamentos" className="text-muted hover:text-text flex items-center gap-2 text-sm transition-colors">
          <ArrowLeft size={16} /> Voltar para Orçamentos
        </Link>
      </div>

      <h1 className="display text-3xl mb-8">Novo Orçamento</h1>

      <div className="card p-6">
        <form action={saveOrcamento} className="space-y-6">
          
          <div>
            <label className="form-label">Selecionar Cliente (Lead)</label>
            <select name="lead_id" required className="form-input bg-panel">
              <option value="">-- Selecione o Lead --</option>
              {leads?.map(lead => (
                <option key={lead.id} value={lead.id}>{lead.nome} ({lead.estagio_funil})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Valor Total (R$)</label>
              <input type="number" step="0.01" name="valor_total" required className="form-input" placeholder="Ex: 5000.00" />
            </div>
            
            <div>
              <label className="form-label">Status do Orçamento</label>
              <select name="status" required className="form-input bg-panel">
                <option value="enviado">Enviado para o Cliente</option>
                <option value="aprovado">Aprovado</option>
                <option value="rejeitado">Rejeitado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Data de Validade</label>
            <input type="date" name="data_validade" required className="form-input" />
          </div>

          <div>
            <label className="form-label">Notas e Condições</label>
            <textarea name="notas" rows={4} className="form-input" placeholder="Ex: Pagamento 50% na entrada. Restante no final da obra."></textarea>
          </div>

          <div className="pt-4 flex gap-4">
            <Link href="/painel/orcamentos" className="btn-outline">Cancelar</Link>
            <button type="submit" className="btn-gold">Registrar Orçamento</button>
          </div>
        </form>
      </div>
    </div>
  )
}
