import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Instalação de Drywall',
  description: 'Serviço profissional de instalação de Drywall. Paredes, forros, divisórias e isolamento acústico em Telêmaco Borba.',
}

export default function DrywallPage() {
  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <section className="py-24" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="section-label animate-fade-up">Serviço Especializado</span>
          <h1 className="display text-4xl md:text-5xl lg:text-6xl mb-6 animate-fade-up delay-100">
            Sistemas de Drywall
          </h1>
          <p className="text-lg text-muted animate-fade-up delay-200">
            A solução inteligente para reformar e construir. Mais rapidez, menos sujeira e um acabamento perfeitamente liso pronto para pintura.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 max-w-4xl mx-auto px-6">
        <div className="prose prose-invert prose-gold max-w-none">
          <h2 className="display text-2xl text-gold mb-4">Por que escolher o Drywall?</h2>
          <p className="text-muted leading-relaxed mb-8">
            O drywall (gesso acartonado) revolucionou a construção civil. Ele substitui as paredes de alvenaria convencional (tijolos e cimento) por um sistema inteligente de perfis de aço galvanizado fechados com chapas de gesso.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { t: 'Velocidade', d: 'Uma parede de drywall é montada em algumas horas, contra dias da alvenaria.' },
              { t: 'Leveza', d: 'Pesa cerca de 15% do peso de uma parede de tijolos. Ideal para reformas e lajes.' },
              { t: 'Isolamento', d: 'Com adição de lã de vidro/rocha, supera o isolamento acústico da alvenaria.' },
              { t: 'Limpeza', d: 'Sistema "construção a seco". Gera pouquíssimo entulho e sujeira na obra.' },
            ].map(b => (
              <div key={b.t} className="card p-5">
                <div className="flex items-center gap-2 mb-2 font-display text-lg text-gold">
                  <CheckCircle2 size={18} /> {b.t}
                </div>
                <p className="text-sm text-muted">{b.d}</p>
              </div>
            ))}
          </div>

          <h2 className="display text-2xl text-gold mb-4">Aplicações Comuns</h2>
          <ul className="space-y-4 text-muted mb-12">
            <li><strong className="text-text">Divisórias de ambientes:</strong> Separe salas, crie novos quartos ou escritórios de forma rápida.</li>
            <li><strong className="text-text">Forros rebaixados:</strong> Perfeitos para embutir iluminação (spots, fitas LED) e esconder tubulações e fios.</li>
            <li><strong className="text-text">Isolamento acústico:</strong> Paredes duplas recheadas com manta acústica para estúdios, quartos ou salas de reunião.</li>
            <li><strong className="text-text">Móveis e nichos:</strong> Estantes, painéis de TV e guarda-roupas estruturados diretamente no drywall.</li>
          </ul>

          <div className="card p-8 bg-panel-2 text-center">
            <h3 className="display text-2xl mb-4">Quer saber o custo para o seu projeto?</h3>
            <p className="text-muted mb-6">Use nossa calculadora online e obtenha uma estimativa instantânea para instalação de drywall.</p>
            <Link href="/orcamento" className="btn-gold inline-flex">
              Simular Orçamento <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
