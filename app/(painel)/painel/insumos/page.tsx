import Link from 'next/link'
import { Plus, Search, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Insumo } from '@/types'

export default async function InsumosPage() {
  const sb = await createClient()
  const { data: dbInsumos } = await sb.from('insumos').select('*').order('nome', { ascending: true })
  const insumos = (dbInsumos || []) as Insumo[]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="display text-3xl">Estoque e Insumos</h1>
        <div className="flex gap-4">
          <button className="btn-outline text-gold border-line hover:border-gold">Nova Compra</button>
          <Link href="/painel/insumos/novo" className="btn-gold">
            <Plus size={16} /> Novo Insumo
          </Link>
        </div>
      </div>

      <div className="card mb-8">
        <div className="p-4 border-b border-line flex gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input type="text" placeholder="Buscar insumos..." className="form-input pl-12 bg-transparent border-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted uppercase font-mono bg-panel-2 border-b border-line">
              <tr>
                <th className="px-6 py-4 font-normal">Nome</th>
                <th className="px-6 py-4 font-normal">Categoria</th>
                <th className="px-6 py-4 font-normal">Em Estoque</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {insumos.map(ins => {
                const baixoEstoque = ins.estoque_atual <= ins.estoque_minimo
                return (
                  <tr key={ins.id} className="hover:bg-panel-2/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{ins.nome}</td>
                    <td className="px-6 py-4 capitalize text-muted">{ins.categoria.replace('_', ' ')}</td>
                    <td className="px-6 py-4 font-mono font-medium">
                      {ins.estoque_atual} <span className="text-muted text-xs">{ins.unidade}</span>
                    </td>
                    <td className="px-6 py-4">
                      {baixoEstoque ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-red-400/10 text-red-400 text-xs font-mono border border-red-400/20">
                          <AlertTriangle size={12} /> Repor
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-green-400/10 text-green-400 text-xs font-mono border border-green-400/20">
                          OK
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gold text-xs font-mono hover:underline">
                        Ajustar
                      </button>
                    </td>
                  </tr>
                )
              })}
              {insumos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted">Nenhum insumo encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
