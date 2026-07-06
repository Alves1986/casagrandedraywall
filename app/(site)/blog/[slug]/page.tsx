import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import { MOCK_BLOG } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'
import { fmtDate } from '@/lib/utils'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = MOCK_BLOG.find(p => p.slug === params.slug)
  if (!p) return { title: 'Post não encontrado' }
  return {
    title: p.titulo,
    description: p.resumo,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  let post = MOCK_BLOG.find(p => p.slug === params.slug)

  try {
    const sb = await createClient()
    const { data } = await sb.from('blog_posts').select('*').eq('slug', params.slug).single()
    if (data) post = data as typeof post
  } catch { /* mock */ }

  if (!post) notFound()

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted hover:text-gold transition-colors mb-12">
          <ArrowLeft size={14} /> Voltar para o blog
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase">
            <Tag size={14} className="text-gold" /> {post.categoria.replace('_', ' ')}
          </div>
          <div className="w-1 h-1 rounded-full bg-line"></div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase">
            <Calendar size={14} className="text-gold" /> {fmtDate(post.publicado_em)}
          </div>
        </div>

        <h1 className="display text-4xl md:text-5xl mb-8 leading-tight">{post.titulo}</h1>
        
        <p className="text-xl text-muted leading-relaxed mb-12 border-l-2 border-gold pl-6">
          {post.resumo}
        </p>

        {post.capa_url && (
          <div className="aspect-video bg-panel-2 border border-line mb-12 flex items-center justify-center">
             <span className="text-muted font-mono text-sm">[Imagem: {post.capa_url}]</span>
          </div>
        )}

        <article 
          className="prose prose-invert prose-gold max-w-none prose-headings:font-display prose-headings:font-medium prose-p:text-muted prose-p:leading-relaxed prose-li:text-muted prose-strong:text-text"
          dangerouslySetInnerHTML={{ __html: post.conteudo.replace(/\n/g, '<br/>') }}
        />

        <div className="mt-16 pt-8 border-t border-line text-center">
          <h3 className="display text-2xl mb-4">Ficou com alguma dúvida?</h3>
          <p className="text-muted mb-6">Fale diretamente com nossa equipe técnica.</p>
          <Link href="/contato" className="btn-gold inline-flex">
            Entrar em Contato
          </Link>
        </div>
      </div>
    </div>
  )
}
