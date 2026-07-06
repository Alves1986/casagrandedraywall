import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Nossos Serviços',
  description: 'Conheça nossos serviços especializados em Drywall, Elétrica e Steel Frame. Construção moderna e rápida.',
}

export default function ServicosPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="section-label animate-fade-up">O que fazemos</span>
          <h1 className="display text-4xl md:text-5xl animate-fade-up delay-100">Soluções Completas</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-up delay-200">
          {/* DRYWALL */}
          <div className="card p-8 flex flex-col h-full">
            <h2 className="display text-3xl mb-4 text-gold">Drywall</h2>
            <p className="text-muted mb-6 flex-grow">
              Construção a seco para paredes, forros e divisórias. Rápido, limpo e com excelente isolamento acústico e térmico.
            </p>
            <ul className="space-y-3 mb-8 text-sm text-muted">
              <li className="flex gap-2"><CheckCircle size={16} className="text-gold flex-shrink-0" /> Paredes divisórias simples e duplas</li>
              <li className="flex gap-2"><CheckCircle size={16} className="text-gold flex-shrink-0" /> Forros rebaixados e estruturados</li>
              <li className="flex gap-2"><CheckCircle size={16} className="text-gold flex-shrink-0" /> Nichos, sancas e projetos especiais</li>
              <li className="flex gap-2"><CheckCircle size={16} className="text-gold flex-shrink-0" /> Isolamento termoacústico</li>
            </ul>
            <Link href="/servicos/drywall" className="btn-outline justify-center w-full">
              Detalhes de Drywall
            </Link>
          </div>

          {/* ELÉTRICA */}
          <div className="card p-8 flex flex-col h-full">
            <h2 className="display text-3xl mb-4 text-gold">Elétrica</h2>
            <p className="text-muted mb-6 flex-grow">
              Instalações residenciais e comerciais seguras, seguindo rigorosamente a NBR 5410. Integrado perfeitamente com Drywall.
            </p>
            <ul className="space-y-3 mb-8 text-sm text-muted">
              <li className="flex gap-2"><CheckCircle size={16} className="text-gold flex-shrink-0" /> Projetos elétricos completos</li>
              <li className="flex gap-2"><CheckCircle size={16} className="text-gold flex-shrink-0" /> Montagem de quadros de distribuição</li>
              <li className="flex gap-2"><CheckCircle size={16} className="text-gold flex-shrink-0" /> Circuitos dedicados (Ar condicionado)</li>
              <li className="flex gap-2"><CheckCircle size={16} className="text-gold flex-shrink-0" /> Iluminação decorativa em gesso</li>
            </ul>
            <Link href="/servicos/eletrica" className="btn-outline justify-center w-full">
              Detalhes de Elétrica
            </Link>
          </div>

          {/* STEEL FRAME */}
          <div className="card p-8 flex flex-col h-full">
            <h2 className="display text-3xl mb-4 text-gold">Steel Frame</h2>
            <p className="text-muted mb-6 flex-grow">
              O futuro da construção. Estruturas metálicas leves para casas e galpões. Obra até 4 vezes mais rápida.
            </p>
            <ul className="space-y-3 mb-8 text-sm text-muted">
              <li className="flex gap-2"><CheckCircle size={16} className="text-gold flex-shrink-0" /> Casas térreas e sobrados</li>
              <li className="flex gap-2"><CheckCircle size={16} className="text-gold flex-shrink-0" /> Ampliações sem sobrecarga estrutural</li>
              <li className="flex gap-2"><CheckCircle size={16} className="text-gold flex-shrink-0" /> Galpões comerciais</li>
              <li className="flex gap-2"><CheckCircle size={16} className="text-gold flex-shrink-0" /> Fachadas modernas</li>
            </ul>
            <Link href="/servicos/steel-frame" className="btn-outline justify-center w-full">
              Detalhes de Steel Frame
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
