import { fmtDateShort } from '@/lib/utils'
import Link from 'next/link'
import { Briefcase, Plus, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Projeto } from '@/types'

export default async function ProjetosPage() {
  const sb = await createClient()
  const { data: dbProjetos } = await sb.from('projetos').select('*').order('criado_em', { ascending: false })
  const projetos = (dbProjetos || []) as Projeto[]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="display text-3xl">Projetos</h1>
        <button className="btn-gold">
          <Plus size={16} /> Novo Projeto
        </button>
      </div>

      <div className="card mb-8">
        <div className="p-4 border-b border-line flex gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input type="text" placeholder="Buscar projetos..." className="form-input pl-12 bg-transparent border-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted uppercase font-mono bg-panel-2 border-b border-line">
              <tr>
                <th className="px-6 py-4 font-normal">Nome do Projeto</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Previsão Fim</th>
                <th className="px-6 py-4 font-normal text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {projetos.map(proj => (
                <tr key={proj.id} className="hover:bg-panel-2/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-text flex items-center gap-2">
                      <Briefcase size={14} className="text-muted" /> {proj.nome}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge-ganho`}>
                      {proj.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted font-mono text-xs">
                    {proj.data_fim_prevista ? fmtDateShort(proj.data_fim_prevista) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/painel/projetos/${proj.id}`} className="text-gold text-xs font-mono hover:underline">
                      Gerenciar →
                    </Link>
                  </td>
                </tr>
              ))}
              {projetos.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted">Nenhum projeto encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
