import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NovoInsumoPage() {
  async function saveInsumo(formData: FormData) {
    'use server'
    const nome = formData.get('nome') as string
    const categoria = formData.get('categoria') as string
    const unid = formData.get('unidade_medida') as string
    const qtd = Number(formData.get('quantidade_estoque')) || 0
    const qtd_min = Number(formData.get('quantidade_minima')) || 0
    const custo = Number(formData.get('custo_unitario')) || 0

    const sb = await createClient()
    const { error } = await sb.from('insumos').insert([{
      nome,
      categoria,
      unidade_medida: unid,
      quantidade_estoque: qtd,
      quantidade_minima: qtd_min,
      custo_unitario: custo
    }])

    if (!error) {
      redirect('/painel/insumos')
    } else {
      console.error(error)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/painel/insumos" className="text-muted hover:text-text flex items-center gap-2 text-sm transition-colors">
          <ArrowLeft size={16} /> Voltar para Insumos
        </Link>
      </div>

      <h1 className="display text-3xl mb-8">Novo Insumo</h1>

      <div className="card p-6">
        <form action={saveInsumo} className="space-y-6">
          
          <div>
            <label className="form-label">Nome do Material/Insumo</label>
            <input type="text" name="nome" required className="form-input" placeholder="Ex: Placa de Drywall ST" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Categoria</label>
              <select name="categoria" required className="form-input bg-panel">
                <option value="drywall">Drywall (Placas, perfis)</option>
                <option value="eletrica">Elétrica (Fios, caixas)</option>
                <option value="ferragens">Ferragens e Parafusos</option>
                <option value="outros">Outros</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">Unidade de Medida</label>
              <select name="unidade_medida" required className="form-input bg-panel">
                <option value="un">Unidade (un)</option>
                <option value="m">Metros (m)</option>
                <option value="m2">Metros Quadrados (m²)</option>
                <option value="kg">Quilos (kg)</option>
                <option value="cx">Caixa (cx)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="form-label">Quantidade em Estoque</label>
              <input type="number" step="0.01" name="quantidade_estoque" className="form-input" defaultValue={0} />
            </div>

            <div>
              <label className="form-label">Alerta (Qtd Mínima)</label>
              <input type="number" step="0.01" name="quantidade_minima" className="form-input" defaultValue={5} />
            </div>
            
            <div>
              <label className="form-label">Custo Unitário (R$)</label>
              <input type="number" step="0.01" name="custo_unitario" className="form-input" placeholder="0.00" />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Link href="/painel/insumos" className="btn-outline">Cancelar</Link>
            <button type="submit" className="btn-gold">Cadastrar Insumo</button>
          </div>
        </form>
      </div>
    </div>
  )
}
