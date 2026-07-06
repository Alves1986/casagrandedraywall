import { BarChart3, TrendingUp, DollarSign } from 'lucide-react'
import { fmtBRL } from '@/lib/utils'

export default function RelatoriosPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="display text-3xl">Relatórios e Metas</h1>
        <div className="flex gap-4">
          <select className="form-input w-40 text-sm py-2">
            <option>Este Mês</option>
            <option>Mês Passado</option>
            <option>Este Ano</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 border-gold/30 bg-gold/5">
          <div className="flex items-center gap-2 mb-2 text-gold">
            <TrendingUp size={20} />
            <h2 className="font-display text-lg">Receita Projetada</h2>
          </div>
          <div className="font-mono text-3xl mb-1">{fmtBRL(350000)}</div>
          <p className="text-xs text-muted">Baseado em orçamentos aprovados</p>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-2 text-green-400">
            <DollarSign size={20} />
            <h2 className="font-display text-lg">Custo Estimado</h2>
          </div>
          <div className="font-mono text-3xl mb-1">{fmtBRL(185000)}</div>
          <p className="text-xs text-muted">Mão de obra e materiais</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <BarChart3 size={20} />
            <h2 className="font-display text-lg">Meta de Vendas</h2>
          </div>
          <div className="font-mono text-3xl mb-1">70%</div>
          <div className="w-full bg-panel-3 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-400 h-full" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>

      <div className="card p-8 text-center bg-panel-2 border-dashed">
        <BarChart3 size={48} className="mx-auto text-muted/30 mb-4" />
        <h3 className="font-display text-xl mb-2">Módulo de Relatórios em Desenvolvimento</h3>
        <p className="text-muted text-sm max-w-md mx-auto">
          A visualização avançada com gráficos (Recharts) será ativada na Fase 2, após a conexão real com os dados históricos do banco de dados.
        </p>
      </div>
    </div>
  )
}
