import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Instalação Elétrica',
  description: 'Projetos e instalações elétricas residenciais e comerciais. Padrão NBR 5410, segurança e integração perfeita com Drywall.',
}

export default function EletricaPage() {
  return (
    <div className="min-h-screen">
      <section className="py-24" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="section-label animate-fade-up">Segurança em 1º Lugar</span>
          <h1 className="display text-4xl md:text-5xl lg:text-6xl mb-6 animate-fade-up delay-100">
            Instalações Elétricas
          </h1>
          <p className="text-lg text-muted animate-fade-up delay-200">
            Execução de projetos elétricos com rigor técnico (NBR 5410). Da infraestrutura básica ao quadro de distribuição final, com especialidade em integração com Drywall e Steel Frame.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-6">
        <div className="prose prose-invert prose-gold max-w-none">
          <h2 className="display text-2xl text-gold mb-4">Elétrica Inteligente e Segura</h2>
          <p className="text-muted leading-relaxed mb-8">
            Uma instalação elétrica mal feita não apenas causa dor de cabeça com manutenções frequentes, mas representa um risco real de incêndio e perda de equipamentos. Nós garantimos dimensionamento correto e materiais de primeira linha.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { t: 'Norma NBR 5410', d: 'Todas as nossas instalações seguem rigorosamente a norma brasileira para instalações elétricas de baixa tensão.' },
              { t: 'Quadros de Carga', d: 'Montagem e balanceamento de QDCs, DRs (proteção contra choque) e DPS (proteção contra surtos).' },
              { t: 'Sem Quebra-Quebra', d: 'Nossa expertise em drywall permite passar toda a fiação nova sem precisar quebrar alvenaria.' },
              { t: 'Circuitos Dedicados', d: 'Instalação correta para equipamentos pesados: ar condicionado, chuveiros e fornos.' },
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
            <h3 className="display text-2xl mb-4">Simule o custo da sua instalação</h3>
            <p className="text-muted mb-6">Nossa calculadora estima o valor com base na quantidade de pontos (tomadas, interruptores) e circuitos dedicados.</p>
            <Link href="/orcamento" className="btn-gold inline-flex">
              Calculadora de Orçamento <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
