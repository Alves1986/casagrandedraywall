import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react'
import { fmtDate, fmtBRL } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import type { Lead } from '@/types'

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const sb = await createClient()
  const { data: lead, error } = await sb.from('leads').select('*').eq('id', params.id).single()
  
  if (error || !lead) notFound()

  return (
    <div>
      <Link href="/painel/leads" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted hover:text-gold transition-colors mb-8">
        <ArrowLeft size={14} /> Voltar para o Funil
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="display text-3xl">{lead.nome}</h1>
            <span className={`badge-${lead.estagio_funil}`}>
              {lead.estagio_funil.replace('_', ' ')}
            </span>
          </div>
          <div className="text-muted text-sm flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone size={14}/> {lead.telefone}</span>
            {lead.email && <span className="flex items-center gap-1"><Mail size={14}/> {lead.email}</span>}
          </div>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline">Editar Lead</button>
          <button className="btn-gold">Gerar Orçamento</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card p-6">
            <h2 className="font-display text-lg mb-4 flex items-center gap-2">
              <FileText size={18} className="text-gold" /> Detalhes do Pedido
            </h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-xs font-mono text-muted uppercase mb-1">Serviço de Interesse</div>
                <div className="capitalize">{lead.servico_interesse.replace('_', ' ')}</div>
              </div>
              <div>
                <div className="text-xs font-mono text-muted uppercase mb-1">Origem</div>
                <div className="capitalize">{lead.origem}</div>
              </div>
              <div>
                <div className="text-xs font-mono text-muted uppercase mb-1">Estimativa Mínima</div>
                <div className="font-mono text-green-400">{lead.valor_estimado_min ? fmtBRL(lead.valor_estimado_min) : 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs font-mono text-muted uppercase mb-1">Estimativa Máxima</div>
                <div className="font-mono text-green-400">{lead.valor_estimado_max ? fmtBRL(lead.valor_estimado_max) : 'N/A'}</div>
              </div>
            </div>
            
            <div className="text-xs font-mono text-muted uppercase mb-1">Observações / Histórico de IA</div>
            <div className="bg-panel-2 p-4 text-sm text-muted rounded-sm border border-line whitespace-pre-wrap">
              {lead.obs || 'Nenhuma observação registrada.'}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card p-6">
            <h2 className="font-display text-lg mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-gold" /> Próxima Ação
            </h2>
            <div className="space-y-4">
              <button className="w-full text-left p-3 border border-line hover:border-gold transition-colors bg-panel-2">
                <div className="text-sm font-medium mb-1">Registrar Contato</div>
                <div className="text-xs text-muted">Anotar ligação, e-mail ou WhatsApp</div>
              </button>
              <button className="w-full text-left p-3 border border-line hover:border-gold transition-colors bg-panel-2">
                <div className="text-sm font-medium mb-1">Agendar Visita Técnica</div>
                <div className="text-xs text-muted">Definir data para ir ao local da obra</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
