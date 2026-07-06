import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function ConfiguracoesPage() {
  const sb = await createClient()
  
  const { data: precos, error } = await sb
    .from('configuracoes_precos')
    .select('*')
    .order('chave', { ascending: true })
    
  async function savePrice(formData: FormData) {
    'use server'
    const sb = await createClient()
    const chave = formData.get('chave') as string
    const valor = Number(formData.get('valor'))
    
    await sb.from('configuracoes_precos').update({ valor }).eq('chave', chave)
    revalidatePath('/painel/configuracoes')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="display text-3xl">Configurações</h1>
      </div>
      
      <div className="card p-6">
        <h2 className="font-display text-xl mb-4 text-gold">Tabela de Preços (Calculadora)</h2>
        <p className="text-muted text-sm mb-6">Estes valores alimentam a calculadora de estimativas no site público. Ao alterar aqui, os orçamentos mudarão imediatamente.</p>
        
        {error ? (
          <div className="text-red-400 p-4 bg-red-400/10 border border-red-500/30">Erro ao carregar tabela: {error.message}</div>
        ) : (
          <div className="space-y-4">
            {precos?.map((p) => (
              <form action={savePrice} key={p.chave} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-line bg-panel-2 rounded-sm hover:border-gold/50 transition-colors">
                <div className="flex-1">
                  <div className="font-mono text-xs text-gold/80 mb-1">{p.chave}</div>
                  <div className="text-sm">{p.descricao}</div>
                </div>
                
                <input type="hidden" name="chave" value={p.chave} />
                
                <div className="flex items-center gap-2">
                  <span className="text-muted font-mono text-sm">{p.chave === 'desconto_combo' ? '%' : 'R$'}</span>
                  <input 
                    type="number" 
                    name="valor" 
                    defaultValue={p.valor} 
                    step={p.chave === 'desconto_combo' ? '0.01' : '1'} 
                    className="form-input w-28 text-right font-mono text-sm" 
                  />
                  <button type="submit" className="btn-outline py-2 px-4 whitespace-nowrap">
                    Salvar
                  </button>
                </div>
              </form>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
