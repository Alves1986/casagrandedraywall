import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Maximize, Target } from 'lucide-react'
import { MOCK_PORTFOLIO } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'
import { fmtDateShort } from '@/lib/utils'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = MOCK_PORTFOLIO.find(p => p.slug === params.slug)
  if (!p) return { title: 'Projeto não encontrado' }
  return {
    title: p.titulo,
    description: p.descricao,
  }
}

export default async function PortfolioItemPage({ params }: { params: { slug: string } }) {
  let projeto = MOCK_PORTFOLIO.find(p => p.slug === params.slug)

  try {
    const sb = await createClient()
    const { data } = await sb.from('portfolio_projetos').select('*').eq('slug', params.slug).single()
    if (data) projeto = data as typeof projeto
  } catch { /* mock */ }

  if (!projeto) notFound()

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/portfolio" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted hover:text-gold transition-colors mb-12">
          <ArrowLeft size={14} /> Voltar para o portfólio
        </Link>

        <span className="section-label">{projeto.servico.replace('_', ' ').toUpperCase()}</span>
        <h1 className="display text-4xl md:text-5xl mb-8">{projeto.titulo}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {projeto.area && (
            <div className="card p-4 flex items-center gap-3">
              <Maximize size={18} className="text-gold" />
              <div>
                <div className="text-xs text-muted font-mono uppercase">Área</div>
                <div className="text-sm">{projeto.area}</div>
              </div>
            </div>
          )}
          <div className="card p-4 flex items-center gap-3">
            <Target size={18} className="text-gold" />
            <div>
              <div className="text-xs text-muted font-mono uppercase">Serviço</div>
              <div className="text-sm capitalize">{projeto.servico.replace('_', ' ')}</div>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <Calendar size={18} className="text-gold" />
            <div>
              <div className="text-xs text-muted font-mono uppercase">Data</div>
              <div className="text-sm">{fmtDateShort(projeto.publicado_em)}</div>
            </div>
          </div>
        </div>

        <div className="prose prose-invert prose-gold max-w-none">
          <p className="text-lg leading-relaxed text-muted mb-12">
            {projeto.descricao}
          </p>

          {projeto.video_url && (
            <div className="mb-12">
              <h2 className="display text-2xl mb-4">Vídeo do Projeto</h2>
              <div className="aspect-video bg-panel-2 border border-line flex items-center justify-center">
                <span className="text-muted font-mono text-sm">[{projeto.video_url}]</span>
              </div>
            </div>
          )}

          {projeto.imagens_json && projeto.imagens_json.length > 0 && (
            <div>
              <h2 className="display text-2xl mb-4">Galeria de Fotos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projeto.imagens_json.map((img, i) => (
                  <div key={i} className="aspect-[4/3] bg-panel-2 border border-line flex items-center justify-center">
                    <span className="text-muted font-mono text-xs">[Imagem: {img}]</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
