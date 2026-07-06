import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Printer, Send, FileCheck2 } from 'lucide-react'
import { fmtDate, fmtBRL } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import type { Orcamento, Lead } from '@/types'

export default async function OrcamentoDetailPage({ params }: { params: { id: string } }) {
  const sb = await createClient()
  const { data: dbOrcamento, error } = await sb.from('orcamentos').select('*').eq('id', params.id).single()
  
  if (error || !dbOrcamento) notFound()
  const orcamento = dbOrcamento as Orcamento

  let lead = null
  if (orcamento.lead_id) {
    const { data: dbLead } = await sb.from('leads').select('*').eq('id', orcamento.lead_id).single()
    if (dbLead) lead = dbLead as Lead
  }

  return (
    <div>
      <Link href="/painel/orcamentos" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted hover:text-gold transition-colors mb-8">
        <ArrowLeft size={14} /> Voltar para Orçamentos
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="display text-3xl">Orçamento {orcamento.id.split('-')[0]}</h1>
            <span className={`badge-proposta`}>
              {orcamento.status}
            </span>
          </div>
          <div className="text-muted text-sm">
            Para: {lead ? <Link href={`/painel/leads/${lead.id}`} className="text-gold hover:underline">{lead.nome}</Link> : 'N/A'}
          </div>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline"><Printer size={16} /> Imprimir / PDF</button>
          <button className="btn-gold"><Send size={16} /> Enviar ao Cliente</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card p-8">
            <div className="flex justify-between items-start border-b border-line pb-6 mb-6">
              <div>
                <h2 className="font-display text-xl mb-1">Casa Grande Drywall</h2>
                <div className="text-sm text-muted font-mono">CNPJ: 00.000.000/0000-00</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono text-muted uppercase">Data</div>
                <div className="font-medium">{fmtDate(orcamento.criado_em)}</div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="text-xs font-mono text-muted uppercase mb-2">Itens do Orçamento (Versão {orcamento.versao_atual})</div>
              <table className="w-full text-sm">
                <thead className="bg-panel-2 border-y border-line text-left font-mono text-xs uppercase text-muted">
                  <tr>
                    <th className="p-3 font-normal">Descrição</th>
                    <th className="p-3 font-normal text-right">Qtd</th>
                    <th className="p-3 font-normal text-right">Valor Un.</th>
                    <th className="p-3 font-normal text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  <tr className="hover:bg-panel-2/30">
                    <td className="p-3">Estrutura em Light Steel Frame (1 Pavimento)</td>
                    <td className="p-3 text-right">150 m²</td>
                    <td className="p-3 text-right">{fmtBRL(875)}</td>
                    <td className="p-3 text-right font-medium">{fmtBRL(131250)}</td>
                  </tr>
                  <tr className="hover:bg-panel-2/30">
                    <td className="p-3">Serviço de elétrica integrado</td>
                    <td className="p-3 text-right">1</td>
                    <td className="p-3 text-right">{fmtBRL(8750)}</td>
                    <td className="p-3 text-right font-medium">{fmtBRL(8750)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end border-t border-line pt-6">
              <div className="w-64">
                <div className="flex justify-between text-sm mb-2 text-muted">
                  <span>Subtotal</span>
                  <span>{fmtBRL(140000)}</span>
                </div>
                <div className="flex justify-between font-display text-2xl text-gold pt-2 border-t border-line">
                  <span>Total</span>
                  <span>{fmtBRL(orcamento.valor_total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card p-6">
            <h2 className="font-display text-lg mb-4 flex items-center gap-2">
              <FileCheck2 size={18} className="text-gold" /> Ações do Orçamento
            </h2>
            <div className="space-y-4">
              <button className="w-full text-left p-3 border border-green-500/30 hover:border-green-500 transition-colors bg-green-500/5">
                <div className="text-sm font-medium mb-1 text-green-400">Marcar como Aprovado</div>
                <div className="text-xs text-muted">Inicia o projeto automaticamente</div>
              </button>
              <button className="w-full text-left p-3 border border-line hover:border-gold transition-colors bg-panel-2">
                <div className="text-sm font-medium mb-1">Criar Nova Versão</div>
                <div className="text-xs text-muted">Mantém histórico da negociação</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
