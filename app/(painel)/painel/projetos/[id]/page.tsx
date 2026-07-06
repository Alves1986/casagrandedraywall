import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, Users, FileText, AlertTriangle } from 'lucide-react'
import { fmtDate, fmtDateShort } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import type { Projeto, Lead } from '@/types'

export default async function ProjetoDetailPage({ params }: { params: { id: string } }) {
  const sb = await createClient()
  const { data: dbProjeto, error } = await sb.from('projetos').select('*').eq('id', params.id).single()
  
  if (error || !dbProjeto) notFound()
  const projeto = dbProjeto as Projeto

  let lead = null
  if (projeto.lead_id) {
    const { data: dbLead } = await sb.from('leads').select('*').eq('id', projeto.lead_id).single()
    if (dbLead) lead = dbLead as Lead
  }

  return (
    <div>
      <Link href="/painel/projetos" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted hover:text-gold transition-colors mb-8">
        <ArrowLeft size={14} /> Voltar para Projetos
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="display text-3xl">{projeto.nome}</h1>
            <span className={`badge-ganho`}>
              {projeto.status.replace('_', ' ')}
            </span>
          </div>
          <div className="text-muted text-sm flex items-center gap-4">
            {lead && <span>Cliente: <Link href={`/painel/leads/${lead.id}`} className="text-gold hover:underline">{lead.nome}</Link></span>}
            <span>Previsão: {projeto.data_fim_prevista ? fmtDate(projeto.data_fim_prevista) : 'N/A'}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline">Editar Projeto</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* CRONOGRAMA */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg flex items-center gap-2">
                <Clock size={18} className="text-gold" /> Cronograma de Execução
              </h2>
              <button className="text-xs font-mono text-gold hover:underline">Atualizar</button>
            </div>
            
            <div className="space-y-4">
              {[
                { etapa: 'Limpeza do terreno e Fundação', status: 'concluida', data: '2024-05-10' },
                { etapa: 'Montagem da Estrutura (Steel Frame)', status: 'em_andamento', data: '2024-05-25' },
                { etapa: 'Instalação Elétrica (Infra)', status: 'pendente', data: null },
                { etapa: 'Fechamento com placas e Drywall', status: 'pendente', data: null },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-line bg-panel-2 rounded-sm">
                  <div className="flex items-center gap-3">
                    {c.status === 'concluida' ? <CheckCircle2 size={16} className="text-green-400" /> : 
                     c.status === 'em_andamento' ? <Clock size={16} className="text-gold" /> : 
                     <div className="w-4 h-4 rounded-full border border-muted" />}
                    <span className={c.status === 'concluida' ? 'line-through text-muted' : 'text-text'}>{c.etapa}</span>
                  </div>
                  <div className="text-xs font-mono text-muted">
                    {c.data ? fmtDateShort(c.data) : 'Aguardando'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LOGS */}
          <div className="card p-6">
            <h2 className="font-display text-lg mb-6 flex items-center gap-2">
              <FileText size={18} className="text-gold" /> Diário de Obra
            </h2>
            <div className="space-y-6">
              <div className="relative pl-6 border-l border-line">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-gold"></div>
                <div className="text-xs font-mono text-muted mb-1">Hoje, 10:00 - por Sandro</div>
                <div className="text-sm">Estrutura metálica das paredes externas finalizada. Solicitado material elétrico para amanhã.</div>
              </div>
              <div className="relative pl-6 border-l border-line">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-panel-3 border border-muted"></div>
                <div className="text-xs font-mono text-muted mb-1">2 dias atrás - por Sistema</div>
                <div className="text-sm">Projeto alterado para "Em Andamento".</div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-line">
              <div className="flex gap-2">
                <input type="text" placeholder="Adicionar nota ao diário..." className="form-input flex-1" />
                <button className="btn-outline">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          
          {/* EQUIPE */}
          <div className="card p-6">
            <h2 className="font-display text-lg mb-4 flex items-center gap-2">
              <Users size={18} className="text-gold" /> Equipe
            </h2>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-panel-3 border border-line flex items-center justify-center text-xs font-display text-gold">S</div>
                <div>
                  <div className="text-sm">Sandro Gomes</div>
                  <div className="text-xs font-mono text-muted uppercase">Responsável Técnico</div>
                </div>
              </div>
            </div>
            <button className="text-xs font-mono text-gold hover:underline w-full text-left">+ Alocar funcionário</button>
          </div>

          {/* MATERIAIS / ESTOQUE ALERTA */}
          <div className="card p-6 bg-red-400/5 border-red-400/20">
            <h2 className="font-display text-lg mb-4 flex items-center gap-2 text-red-400">
              <AlertTriangle size={18} /> Insumos Pendentes
            </h2>
            <p className="text-sm text-muted mb-4">
              Faltam materiais em estoque para a próxima etapa deste projeto:
            </p>
            <ul className="text-sm space-y-2 mb-4">
              <li className="flex justify-between">
                <span>Placa OSB 11mm</span>
                <span className="font-mono text-red-400">Faltam 12 un</span>
              </li>
            </ul>
            <Link href="/painel/insumos" className="text-xs font-mono text-red-400 hover:underline">
              Ir para Compras →
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
