import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle, Clock, DollarSign, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { MOCK_PORTFOLIO, MOCK_DEPOIMENTOS } from '@/lib/mock-data'
import { waMessage } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Casa Grande Drywall — Drywall, Elétrica e Steel Frame em Telêmaco Borba, PR',
  description: 'Especialistas em Drywall, Elétrica e Steel Frame em Telêmaco Borba. Orçamento gratuito. Mais de 8 anos de experiência e +150 projetos concluídos.',
}

const STATS = [
  { value: '8+', label: 'Anos de experiência' },
  { value: '150+', label: 'Projetos concluídos' },
  { value: '100%', label: 'Satisfação garantida' },
  { value: '4×', label: 'Mais rápido que alvenaria' },
]

const SERVICOS = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="6" y="8" width="36" height="32" rx="1" stroke="#d4af37" strokeWidth="2"/>
        <line x1="24" y1="8" x2="24" y2="40" stroke="#d4af37" strokeWidth="2"/>
        <line x1="6" y1="24" x2="42" y2="24" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="3 3"/>
      </svg>
    ),
    title: 'Drywall',
    desc: 'Divisórias, forros e paredes em gesso acartonado. Mais rápido, mais limpo e com acabamento premium.',
    items: ['Parede simples e dupla', 'Forro rebaixado', 'Isolamento acústico', 'Acabamento premium'],
    href: '/servicos/drywall',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M24 6v36M18 12l6-6 6 6" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="24" cy="30" r="6" stroke="#d4af37" strokeWidth="2"/>
        <path d="M12 30h6M30 30h6" stroke="#d4af37" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Elétrica',
    desc: 'Instalações elétricas residenciais e comerciais com total segurança e conformidade com a NBR 5410.',
    items: ['Pontos elétricos', 'Quadros e disjuntores', 'Circuitos dedicados', 'NBR 5410'],
    href: '/servicos/eletrica',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M8 38 L8 22 L24 8 L40 22 L40 38" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 38V28h16v10" stroke="#d4af37" strokeWidth="2"/>
        <path d="M8 22 L24 8 L40 22" stroke="#d4af37" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'Steel Frame',
    desc: 'Construção em estrutura metálica leve. 4× mais rápido que alvenaria, com conforto e durabilidade superiores.',
    items: ['Estrutura metálica leve', 'Até 3 pavimentos', 'Maior velocidade de obra', 'Menos desperdício'],
    href: '/servicos/steel-frame',
  },
]

export default async function HomePage() {
  // Tenta buscar dados reais do Supabase
  let portfolio = MOCK_PORTFOLIO.slice(0, 3)
  let depoimentos = MOCK_DEPOIMENTOS

  try {
    const sb = await createClient()
    const { data: pData } = await sb.from('portfolio_projetos').select('*').limit(3).order('publicado_em', { ascending: false })
    if (pData?.length) portfolio = pData as typeof portfolio

    const { data: dData } = await sb.from('depoimentos').select('*').limit(3)
    if (dData?.length) depoimentos = dData as typeof depoimentos
  } catch { /* usa mock */ }

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden"
        style={{ background: 'var(--bg)' }}>
        {/* Background grid */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(212,175,55,0.07) 0%, transparent 70%)' }} />

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="section-label animate-fade-up">Telêmaco Borba · PR · Desde 2016</span>
            <h1 className="display text-5xl lg:text-7xl mb-6 animate-fade-up delay-100"
              style={{ lineHeight: '1.1' }}>
              Construção que{' '}
              <span style={{ color: 'var(--gold)' }}>respeita</span>{' '}
              seu tempo
            </h1>
            <p className="text-lg mb-8 animate-fade-up delay-200" style={{ color: 'var(--muted)' }}>
              Drywall, Elétrica e Steel Frame com o acabamento que você merece.
              Obra limpa, prazo cumprido e sem surpresas no orçamento.
            </p>
            <div className="flex flex-wrap gap-4 mb-12 animate-fade-up delay-300">
              <Link href="/orcamento" className="btn-gold">
                Calculadora de orçamento <ArrowRight size={14} />
              </Link>
              <Link href="/portfolio" className="btn-outline">
                Ver portfólio
              </Link>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 animate-fade-up delay-400">
              {STATS.map(s => (
                <div key={s.label}>
                  <div className="font-display text-3xl" style={{ color: 'var(--gold)' }}>{s.value}</div>
                  <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="hidden lg:flex justify-center items-center animate-fade-in delay-200">
            <div className="relative">
              {/* SVG Casa */}
              <svg viewBox="0 0 300 280" fill="none" className="w-80 h-80" style={{ filter: 'drop-shadow(0 0 40px rgba(212,175,55,0.2))' }}>
                <g stroke="#d4af37" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M30 200 L30 110 L70 70 L110 110 L110 200"/>
                  <path d="M110 220 L110 80 L150 40 L190 80 L190 220"/>
                  <path d="M190 200 L190 110 L230 70 L270 110 L270 200"/>
                  <line x1="30" y1="200" x2="270" y2="200" stroke="#d4af37" strokeWidth="2" opacity="0.4"/>
                  <rect x="55" y="155" width="30" height="45" stroke="#d4af37" strokeWidth="2" opacity="0.5"/>
                  <rect x="135" y="140" width="30" height="80" stroke="#d4af37" strokeWidth="2" opacity="0.5"/>
                  <rect x="215" y="155" width="30" height="45" stroke="#d4af37" strokeWidth="2" opacity="0.5"/>
                  <rect x="60" y="105" width="20" height="20" stroke="#d4af37" strokeWidth="1.5" opacity="0.6"/>
                  <rect x="220" y="105" width="20" height="20" stroke="#d4af37" strokeWidth="1.5" opacity="0.6"/>
                </g>
              </svg>

              {/* Badge flutuante */}
              <div className="absolute -top-4 -right-4 card p-3 text-center" style={{ minWidth: 120 }}>
                <div className="font-mono text-xs mb-1" style={{ color: 'var(--muted)' }}>Steel Frame</div>
                <div className="font-display text-2xl" style={{ color: 'var(--gold)' }}>4×</div>
                <div className="font-mono text-[10px]" style={{ color: 'var(--muted)' }}>mais rápido</div>
              </div>
              <div className="absolute -bottom-4 -left-4 card p-3 text-center">
                <div className="font-mono text-xs mb-1" style={{ color: 'var(--muted)' }}>Desperdício</div>
                <div className="font-display text-2xl" style={{ color: 'var(--green)' }}>−30%</div>
                <div className="font-mono text-[10px]" style={{ color: 'var(--muted)' }}>vs alvenaria</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VANTAGENS ── */}
      <section className="py-16" style={{ background: 'var(--panel)', borderTop: '1px solid var(--line)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Clock size={20} />, title: '4× mais rápido', desc: 'Obra em dias, não meses. Steel frame e drywall são tecnologias industrializadas.' },
              { icon: <DollarSign size={20} />, title: 'Sem surpresas', desc: 'Orçamento detalhado e fixo. Você sabe exatamente o que vai pagar antes de começar.' },
              { icon: <Zap size={20} />, title: 'Menos desperdício', desc: 'Até 5% de sobra de material vs 25% na alvenaria. Mais sustentável e econômico.' },
            ].map(v => (
              <div key={v.title} className="flex gap-4">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center"
                  style={{ color: 'var(--gold)' }}>
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-display text-lg mb-2">{v.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVIÇOS ── */}
      <section className="py-24" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="section-label">O que fazemos</span>
            <h2 className="display text-4xl">Nossos serviços</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICOS.map(s => (
              <Link key={s.title} href={s.href}
                className="card p-8 block group">
                <div className="mb-5">{s.icon}</div>
                <h3 className="font-display text-2xl mb-3">{s.title}</h3>
                <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--muted)' }}>{s.desc}</p>
                <ul className="space-y-2 mb-6">
                  {s.items.map(i => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
                      <CheckCircle size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                      {i}
                    </li>
                  ))}
                </ul>
                <span className="font-mono text-xs flex items-center gap-1 group-hover:gap-2 transition-all"
                  style={{ color: 'var(--gold)' }}>
                  Saiba mais <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALCULADORA CTA ── */}
      <section className="py-24" style={{ background: 'var(--panel)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="section-label">Calculadora inteligente</span>
            <h2 className="display text-4xl mb-4">Saiba o custo do seu projeto em 2 minutos</h2>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--muted)' }}>
              Nossa calculadora usa os preços reais praticados pela Casa Grande.
              Informe o serviço, a metragem e receba uma estimativa imediata.
              Sem compromisso, sem cadastro.
            </p>
            <Link href="/orcamento" className="btn-gold">
              Calcular agora <ArrowRight size={14} />
            </Link>
          </div>
          {/* Preview steps */}
          <div className="space-y-3">
            {[
              { step: '01', title: 'Escolha o serviço', desc: 'Drywall, Elétrica, Steel Frame ou combinado' },
              { step: '02', title: 'Informe a metragem', desc: 'Área, número de pontos ou pavimentos' },
              { step: '03', title: 'Receba a estimativa', desc: 'Faixa de preço min–max em segundos' },
              { step: '04', title: 'Fale com o Sandro', desc: 'WhatsApp com sua estimativa pré-preenchida' },
            ].map(s => (
              <div key={s.step} className="flex gap-5 p-4" style={{ background: 'var(--panel-2)', border: '1px solid var(--line)' }}>
                <div className="font-mono text-sm font-medium flex-shrink-0" style={{ color: 'var(--gold)' }}>{s.step}</div>
                <div>
                  <div className="text-sm font-medium mb-0.5">{s.title}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFÓLIO DESTAQUE ── */}
      <section className="py-24" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="section-label">Projetos realizados</span>
              <h2 className="display text-4xl">Portfólio</h2>
            </div>
            <Link href="/portfolio" className="btn-outline hidden md:inline-flex">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolio.map(p => (
              <Link key={p.id} href={`/portfolio/${p.slug}`} className="card group overflow-hidden block">
                <div className="h-48 flex items-center justify-center"
                  style={{ background: 'var(--panel-2)', borderBottom: '1px solid var(--line)' }}>
                  <div className="text-center">
                    <div className="font-mono text-xs mb-2" style={{ color: 'var(--gold)' }}>
                      {p.servico.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className="font-display text-4xl" style={{ color: 'var(--gold)', opacity: 0.15 }}>
                      {p.servico === 'drywall' ? '▪' : p.servico === 'eletrica' ? '⚡' : '⬡'}
                    </div>
                    {p.area && <div className="font-mono text-sm mt-2" style={{ color: 'var(--muted)' }}>{p.area}</div>}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg mb-2">{p.titulo}</h3>
                  <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
                    {p.descricao}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/portfolio" className="btn-outline">Ver todos os projetos</Link>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="py-24" style={{ background: 'var(--panel)', borderTop: '1px solid var(--line)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="section-label">Clientes satisfeitos</span>
            <h2 className="display text-4xl">O que dizem sobre nós</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {depoimentos.map(d => (
              <div key={d.id} className="card p-8">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: d.nota }).map((_, i) => (
                    <span key={i} style={{ color: 'var(--gold)' }}>★</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
                  "{d.texto}"
                </p>
                <div className="font-display text-sm">{d.nome_cliente}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="section-label">Pronto para começar?</span>
          <h2 className="display text-4xl mb-6">
            Seu projeto começa com uma{' '}
            <span style={{ color: 'var(--gold)' }}>conversa</span>
          </h2>
          <p className="mb-10" style={{ color: 'var(--muted)' }}>
            Orçamento gratuito e sem compromisso. Atendemos Telêmaco Borba e região.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/orcamento" className="btn-gold">
              Calcular orçamento <ArrowRight size={14} />
            </Link>
            <a href={waMessage('Olá! Vim pelo site e gostaria de um orçamento.')}
              target="_blank" rel="noopener" className="btn-outline">
              WhatsApp direto
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
