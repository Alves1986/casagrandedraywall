import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { MOCK_PORTFOLIO } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Portfólio de Obras',
  description: 'Conheça nossos projetos concluídos de Drywall, Elétrica e Steel Frame em Telêmaco Borba e região.',
}

export default async function PortfolioPage() {
  let portfolio = MOCK_PORTFOLIO

  try {
    const sb = await createClient()
    const { data } = await sb.from('portfolio_projetos').select('*').order('publicado_em', { ascending: false })
    if (data?.length) portfolio = data as typeof portfolio
  } catch { /* usa mock */ }

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="section-label animate-fade-up">Obras realizadas</span>
          <h1 className="display text-4xl md:text-5xl animate-fade-up delay-100">Nosso Portfólio</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-up delay-200">
          {portfolio.map(p => (
            <Link key={p.id} href={`/portfolio/${p.slug}`} className="card group overflow-hidden block flex flex-col h-full">
              <div className="h-48 flex items-center justify-center relative"
                style={{ background: 'var(--panel-2)', borderBottom: '1px solid var(--line)' }}>
                {p.imagens_json && p.imagens_json.length > 0 ? (
                  // Se tiver imagem real, exibiremos aqui (fase 2)
                  // <img src={p.imagens_json[0]} alt={p.titulo} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"></div>
                ) : null}
                <div className="text-center relative z-20">
                  <div className="font-mono text-xs mb-2" style={{ color: 'var(--gold)' }}>
                    {p.servico.replace('_', ' ').toUpperCase()}
                  </div>
                  <div className="font-display text-4xl" style={{ color: 'var(--gold)', opacity: 0.15 }}>
                    {p.servico === 'drywall' ? '▪' : p.servico === 'eletrica' ? '⚡' : '⬡'}
                  </div>
                  {p.area && <div className="font-mono text-sm mt-2" style={{ color: 'var(--muted)' }}>{p.area}</div>}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-display text-xl mb-3">{p.titulo}</h3>
                <p className="text-sm leading-relaxed mb-6 flex-grow" style={{ color: 'var(--muted)' }}>
                  {p.descricao}
                </p>
                <div className="font-mono text-xs flex items-center gap-1 group-hover:gap-2 transition-all"
                  style={{ color: 'var(--gold)' }}>
                  Ver detalhes <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
