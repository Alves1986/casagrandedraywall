import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NovoLeadPage() {
  async function saveLead(formData: FormData) {
    'use server'
    const nome = formData.get('nome') as string
    const telefone = formData.get('telefone') as string
    const servico_interesse = formData.get('servico_interesse') as string
    const origem = formData.get('origem') as string
    const obs = formData.get('obs') as string

    const sb = await createClient()
    const { error } = await sb.from('leads').insert([{
      nome,
      telefone,
      servico_interesse,
      origem,
      obs,
      estagio_funil: 'novo'
    }])

    if (!error) {
      redirect('/painel/leads')
    } else {
      console.error(error)
      // Simples fallback em caso de erro, num app complexo usaríamos useFormState
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/painel/leads" className="text-muted hover:text-text flex items-center gap-2 text-sm transition-colors">
          <ArrowLeft size={16} /> Voltar para o Funil
        </Link>
      </div>

      <h1 className="display text-3xl mb-8">Novo Lead</h1>

      <div className="card p-6">
        <form action={saveLead} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Nome do Cliente</label>
              <input type="text" name="nome" required className="form-input" placeholder="João da Silva" />
            </div>
            
            <div>
              <label className="form-label">Telefone / WhatsApp</label>
              <input type="tel" name="telefone" required className="form-input" placeholder="(00) 00000-0000" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Serviço de Interesse</label>
              <select name="servico_interesse" required className="form-input bg-panel">
                <option value="drywall">Drywall</option>
                <option value="eletrica">Elétrica</option>
                <option value="steel_frame">Steel Frame</option>
                <option value="combinado">Múltiplos (Combinado)</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">Origem do Contato</label>
              <select name="origem" required className="form-input bg-panel">
                <option value="manual">Cadastro Manual</option>
                <option value="whatsapp">WhatsApp Direto</option>
                <option value="instagram">Instagram</option>
                <option value="indicacao">Indicação</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Observações Adicionais</label>
            <textarea name="obs" rows={4} className="form-input" placeholder="Detalhes do pedido, endereço, etc..."></textarea>
          </div>

          <div className="pt-4 flex gap-4">
            <Link href="/painel/leads" className="btn-outline">Cancelar</Link>
            <button type="submit" className="btn-gold">Criar Lead</button>
          </div>
        </form>
      </div>
    </div>
  )
}
