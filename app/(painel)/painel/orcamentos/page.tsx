import { fmtDateShort, fmtBRL } from '@/lib/utils'
import Link from 'next/link'
import { FilePlus, Plus, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Orcamento } from '@/types'

export default async function OrcamentosPage() {
  const sb = await createClient()
  const { data: dbOrcamentos } = await sb.from('orcamentos').select('*').order('criado_em', { ascending: false })
  const orcamentos = (dbOrcamentos || []) as Orcamento[]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="display text-3xl">Orçamentos</h1>
        <Link href="/painel/orcamentos/novo" className="btn-gold">
          <Plus size={16} /> Novo Orçamento
        </Link>
      </div>

      <div className="card mb-8">
        <div className="p-4 border-b border-line flex gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input type="text" placeholder="Buscar orçamentos..." className="form-input pl-12 bg-transparent border-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted uppercase font-mono bg-panel-2 border-b border-line">
              <tr>
                <th className="px-6 py-4 font-normal">ID / Ref</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Valor Total</th>
                <th className="px-6 py-4 font-normal">Data</th>
                <th className="px-6 py-4 font-normal text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orcamentos.map(orc => (
                <tr key={orc.id} className="hover:bg-panel-2/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-text">{orc.id.split('-')[0]}</div>
                    <div className="text-xs text-muted">V{orc.versao_atual}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge-proposta`}>
                      {orc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-green-400">
                    {fmtBRL(orc.valor_total)}
                  </td>
                  <td className="px-6 py-4 text-muted font-mono text-xs">
                    {fmtDateShort(orc.criado_em)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/painel/orcamentos/${orc.id}`} className="text-gold text-xs font-mono hover:underline">
                      Abrir →
                    </Link>
                  </td>
                </tr>
              ))}
              {orcamentos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted">Nenhum orçamento encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
