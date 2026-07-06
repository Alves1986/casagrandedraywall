import type { Metadata } from 'next'
import CalculadoraOrcamento from '@/components/site/CalculadoraOrcamento'

export const metadata: Metadata = {
  title: 'Calculadora de Orçamento Grátis',
  description: 'Descubra quanto vai custar a sua obra ou reforma. Simulador online de preços para Drywall, Elétrica e Steel Frame em Telêmaco Borba.',
}

export default function OrcamentoPage() {
  return (
    <div className="min-h-screen pt-24 pb-32" style={{ background: 'var(--bg)' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 top-0 h-[50vh] opacity-30 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'linear-gradient(to bottom, black, transparent)' }} />
      
      <div className="relative max-w-4xl mx-auto px-6 text-center mb-16">
        <span className="section-label animate-fade-up">Sem compromisso</span>
        <h1 className="display text-4xl md:text-5xl mb-6 animate-fade-up delay-100">
          Orçamento Online
        </h1>
        <p className="text-lg text-muted animate-fade-up delay-200">
          Nossa calculadora utiliza os preços reais praticados hoje. <br className="hidden md:block"/>
          Obtenha uma estimativa confiável em menos de 1 minuto.
        </p>
      </div>

      <div className="relative z-10 px-6 animate-fade-up delay-300">
        <CalculadoraOrcamento />
      </div>
    </div>
  )
}
