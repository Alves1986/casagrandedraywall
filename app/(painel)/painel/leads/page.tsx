import { fmtDateShort, fmtBRL } from '@/lib/utils'
import Link from 'next/link'
import { Plus, Search, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Lead } from '@/types'

export default async function LeadsPage() {
  const estagios = ['novo', 'contato', 'qualificado', 'proposta', 'negociacao', 'ganho', 'perdido']
  
  const sb = await createClient()
  const { data: dbLeads, error } = await sb.from('leads').select('*').order('criado_em', { ascending: false })
  const leads = (dbLeads || []) as Lead[]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="display text-3xl">Funil de Vendas (Leads)</h1>
        <Link href="/painel/leads/novo" className="btn-gold">
          <Plus size={16} /> Novo Lead
        </Link>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" placeholder="Buscar leads..." className="form-input pl-12" />
        </div>
        <button className="btn-outline">
          <Filter size={16} /> Filtrar
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 border border-red-500/50 bg-red-500/10 text-red-500 text-sm">
          Erro ao carregar leads: {error.message}
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4 items-start">
        {['novo', 'contato', 'qualificado', 'proposta', 'negociacao'].map(estagio => {
          const leadsEstagio = leads.filter(l => l.estagio_funil === estagio)
          return (
            <div key={estagio} className="bg-panel-2 border border-line rounded-sm min-w-[280px] w-[280px] flex-shrink-0">
              <div className="p-4 border-b border-line flex justify-between items-center">
                <div className="font-mono text-xs uppercase tracking-widest text-muted font-medium">
                  {estagio.replace('_', ' ')}
                </div>
                <div className="bg-panel-3 px-2 py-0.5 rounded-sm text-xs font-mono text-muted">{leadsEstagio.length}</div>
              </div>
              <div className="p-3 space-y-3">
                {leadsEstagio.map(lead => (
                  <Link key={lead.id} href={`/painel/leads/${lead.id}`} className="block card p-4 hover:border-gold transition-colors cursor-pointer group">
                    <div className="font-display text-base mb-1 group-hover:text-gold transition-colors">{lead.nome}</div>
                    <div className="text-xs text-muted capitalize mb-3">{lead.servico_interesse.replace('_', ' ')}</div>
                    
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="text-muted">{fmtDateShort(lead.criado_em)}</div>
                      {lead.valor_estimado_min && (
                        <div className="text-gold/80">{fmtBRL(lead.valor_estimado_min)}</div>
                      )}
                    </div>
                  </Link>
                ))}
                {leadsEstagio.length === 0 && (
                  <div className="text-center p-4 text-xs text-muted/50 border border-dashed border-line">
                    Vazio
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
