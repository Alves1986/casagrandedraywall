import { ArrowRight, BarChart3, Users, DollarSign, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { fmtDateShort } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import type { Lead, Orcamento, Projeto } from '@/types'

export default async function DashboardPage() {
  const sb = await createClient()
  
  const [
    { data: dbLeads },
    { data: dbOrcamentos },
    { data: dbProjetos }
  ] = await Promise.all([
    sb.from('leads').select('*').order('criado_em', { ascending: false }),
    sb.from('orcamentos').select('*'),
    sb.from('projetos').select('*')
  ])

  const leads = (dbLeads || []) as Lead[]
  const orcamentos = (dbOrcamentos || []) as Orcamento[]
  const projetos = (dbProjetos || []) as Projeto[]

  const kpis = [
    { title: 'Novos Leads (Total)', value: leads.length, desc: 'Cadastrados na base', icon: Users, color: 'text-blue-400' },
    { title: 'Orçamentos Ativos', value: orcamentos.filter(o=>o.status==='enviado').length, desc: 'Aguardando aprovação', icon: DollarSign, color: 'text-gold' },
    { title: 'Projetos em Andamento', value: projetos.filter(p=>p.status==='em_andamento').length, desc: 'Foco da equipe', icon: BarChart3, color: 'text-green-400' },
    { title: 'Taxa de Conversão', value: leads.length ? Math.round((projetos.length / leads.length) * 100) + '%' : '0%', desc: 'De Lead para Projeto Ganho', icon: TrendingUp, color: 'text-purple-400' },
  ]

  const recentLeads = leads.slice(0, 5)

  return (
    <div>
      <h1 className="display text-3xl mb-8">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map(k => (
          <div key={k.title} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 bg-panel-2 border border-line rounded-lg ${k.color}`}>
                <k.icon size={20} />
              </div>
            </div>
            <div className="font-display text-3xl mb-1">{k.value}</div>
            <div className="text-sm font-medium mb-1">{k.title}</div>
            <div className="text-xs text-muted">{k.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Atividade Recente (Leads) */}
        <div className="lg:col-span-2 card">
          <div className="p-6 border-b border-line flex items-center justify-between">
            <h2 className="font-display text-lg">Leads Recentes</h2>
            <Link href="/painel/leads" className="text-xs font-mono text-gold hover:underline flex items-center gap-1">
              Ver Funil <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted uppercase font-mono bg-panel-2 border-b border-line">
                <tr>
                  <th className="px-6 py-4 font-normal">Nome</th>
                  <th className="px-6 py-4 font-normal">Serviço</th>
                  <th className="px-6 py-4 font-normal">Estágio</th>
                  <th className="px-6 py-4 font-normal">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {recentLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-panel-2/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{lead.nome}</td>
                    <td className="px-6 py-4 capitalize text-muted">{lead.servico_interesse.replace('_', ' ')}</td>
                    <td className="px-6 py-4">
                      <span className={`badge-${lead.estagio_funil}`}>
                        {lead.estagio_funil.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted font-mono text-xs">{fmtDateShort(lead.criado_em)}</td>
                  </tr>
                ))}
                {recentLeads.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted">Nenhum lead encontrado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumo Financeiro / Alertas */}
        <div className="space-y-8">
          <div className="card p-6">
            <h2 className="font-display text-lg mb-6">Próximos Passos</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gold/10 border border-gold/30 rounded-sm">
                <div className="flex items-center gap-2 text-gold font-medium mb-1">
                  <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                  Retornar Orçamento
                </div>
                <div className="text-sm text-muted">João Silva aguarda orçamento de Steel Frame. Recebido há 2h.</div>
              </div>
              <div className="p-4 bg-red-400/10 border border-red-400/30 rounded-sm">
                <div className="flex items-center gap-2 text-red-400 font-medium mb-1">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  Estoque Baixo
                </div>
                <div className="text-sm text-muted">Perfis Montante 90mm abaixo do mínimo de segurança.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
