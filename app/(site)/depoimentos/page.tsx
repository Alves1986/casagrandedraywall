import type { Metadata } from 'next'
import { MOCK_DEPOIMENTOS } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Depoimentos de Clientes',
  description: 'Veja o que nossos clientes falam sobre os serviços da Casa Grande Drywall.',
}

export default async function DepoimentosPage() {
  let depoimentos = MOCK_DEPOIMENTOS

  try {
    const sb = await createClient()
    const { data } = await sb.from('depoimentos').select('*').order('nota', { ascending: false })
    if (data?.length) depoimentos = data as typeof depoimentos
  } catch { /* usa mock */ }

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="section-label animate-fade-up">A voz do cliente</span>
          <h1 className="display text-4xl md:text-5xl animate-fade-up delay-100">Depoimentos</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up delay-200">
          {depoimentos.map(d => (
            <div key={d.id} className="card p-8 flex flex-col h-full">
              <div className="flex gap-1 mb-6">
                {Array.from({ length: d.nota }).map((_, i) => (
                  <span key={i} className="text-gold text-lg">★</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-8 flex-grow text-muted">
                "{d.texto}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-panel-3 border border-line flex items-center justify-center font-display text-gold">
                  {d.nome_cliente.charAt(0)}
                </div>
                <div className="font-display text-sm">{d.nome_cliente}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
