import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { MOCK_BLOG } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'
import { fmtDateShort } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Dicas, novidades e tudo o que você precisa saber sobre Drywall, Elétrica e Steel Frame.',
}

export default async function BlogPage() {
  let posts = MOCK_BLOG

  try {
    const sb = await createClient()
    const { data } = await sb.from('blog_posts').select('*').order('publicado_em', { ascending: false })
    if (data?.length) posts = data as typeof posts
  } catch { /* usa mock */ }

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="section-label animate-fade-up">Conhecimento e Dicas</span>
          <h1 className="display text-4xl md:text-5xl animate-fade-up delay-100">Nosso Blog</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-up delay-200">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="card group overflow-hidden block flex flex-col h-full">
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono px-2 py-1 bg-panel-3 border border-line text-muted capitalize">
                    {post.categoria.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-mono text-muted">
                    {fmtDateShort(post.publicado_em)}
                  </span>
                </div>
                
                <h3 className="display text-xl mb-3 group-hover:text-gold transition-colors">{post.titulo}</h3>
                
                <p className="text-sm leading-relaxed mb-6 flex-grow text-muted line-clamp-3">
                  {post.resumo}
                </p>
                
                <div className="font-mono text-xs flex items-center gap-1 group-hover:gap-2 transition-all"
                  style={{ color: 'var(--gold)' }}>
                  Ler artigo completo <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
