import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Steel Frame',
  description: 'Construção em Light Steel Frame. Rápido, sustentável e resistente. A melhor tecnologia construtiva disponível em Telêmaco Borba.',
}

export default function SteelFramePage() {
  return (
    <div className="min-h-screen">
      <section className="py-24" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="section-label animate-fade-up">O Futuro da Construção</span>
          <h1 className="display text-4xl md:text-5xl lg:text-6xl mb-6 animate-fade-up delay-100">
            Light Steel Frame
          </h1>
          <p className="text-lg text-muted animate-fade-up delay-200">
            Construa sua casa, ampliação ou galpão comercial até 4x mais rápido que na alvenaria tradicional, com conforto térmico e acústico superior.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-6">
        <div className="prose prose-invert prose-gold max-w-none">
          <h2 className="display text-2xl text-gold mb-4">O que é Steel Frame?</h2>
          <p className="text-muted leading-relaxed mb-8">
            O Light Steel Frame (LSF) é um sistema construtivo industrializado amplamente utilizado nos EUA e Europa, e que agora domina o mercado brasileiro de alto padrão. Ele substitui tijolos e cimento por perfis de aço galvanizado estrutural, revestidos por placas cimentícias (externas) e drywall (internas), recheados com isolamento termoacústico.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { t: '4x Mais Rápido', d: 'Como é uma montagem a seco, as etapas não dependem de tempo de cura. Uma casa fica pronta em meses, não anos.' },
              { t: 'Preço Fechado', d: 'Por ser um sistema calculado milimetricamente em projeto, não há "surpresas" na compra de material.' },
              { t: 'Fundações mais baratas', d: 'A obra em Steel Frame pesa em média 70% menos que a alvenaria, barateando a fundação (radier).' },
              { t: 'Conforto Superior', d: 'O sanduíche de placas + manta acústica proporciona um isolamento térmico e acústico inigualável pela alvenaria comum.' },
            ].map(b => (
              <div key={b.t} className="card p-5">
                <div className="flex items-center gap-2 mb-2 font-display text-lg text-gold">
                  <CheckCircle2 size={18} /> {b.t}
                </div>
                <p className="text-sm text-muted">{b.d}</p>
              </div>
            ))}
          </div>

          <div className="card p-8 bg-panel-2 text-center mt-12">
            <h3 className="display text-2xl mb-4">Construa seu futuro hoje</h3>
            <p className="text-muted mb-6">Saiba o custo aproximado do metro quadrado para obras em Steel Frame com nossa calculadora.</p>
            <Link href="/orcamento" className="btn-gold inline-flex">
              Simular Custo do m² <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
