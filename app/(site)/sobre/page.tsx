import type { Metadata } from 'next'
import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre a Empresa',
  description: 'Conheça a história da Casa Grande Drywall. Tradição, qualidade e inovação na construção a seco em Telêmaco Borba.',
}

export default function SobrePage() {
  return (
    <div className="min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="section-label animate-fade-up">Nossa História</span>
          <h1 className="display text-4xl md:text-5xl mb-6 animate-fade-up delay-100">
            Casa Grande Drywall
          </h1>
          <p className="text-lg text-muted animate-fade-up delay-200">
            Mais de 8 anos transformando a forma como se constrói e reforma em Telêmaco Borba e região.
          </p>
        </div>

        <div className="prose prose-invert prose-gold max-w-none animate-fade-up delay-300">
          <p className="text-lg leading-relaxed text-muted mb-8">
            A Casa Grande Drywall nasceu com um propósito claro: trazer a eficiência e a tecnologia da construção a seco para Telêmaco Borba. Liderada por Sandro Casa Grande Gomes, a empresa se consolidou como referência técnica em Drywall, Instalações Elétricas (NBR 5410) e, mais recentemente, no revolucionário sistema Light Steel Frame.
          </p>
          
          <h2 className="display text-2xl text-gold mt-12 mb-4">Nossa Missão</h2>
          <p className="text-muted leading-relaxed mb-8">
            Entregar obras rápidas, limpas e com acabamento impecável, respeitando prazos e orçamentos. Acreditamos que a construção civil não precisa ser sinônimo de dor de cabeça, atrasos e desperdício.
          </p>

          <h2 className="display text-2xl text-gold mt-12 mb-6">Por que somos diferentes?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-3 font-display text-lg">
                <CheckCircle2 size={20} className="text-gold" /> Especialização Técnica
              </div>
              <p className="text-sm text-muted">
                Não somos "faz-tudo". Somos especialistas formados e certificados em nossas áreas de atuação (Drywall estrutural, Elétrica predial e Steel Frame).
              </p>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-3 font-display text-lg">
                <CheckCircle2 size={20} className="text-gold" /> Integração de Serviços
              </div>
              <p className="text-sm text-muted">
                Nossa equipe executa tanto a estrutura quanto a elétrica. Isso elimina o conflito entre gesseiro e eletricista, garantindo que nenhum perfil seja cortado indevidamente.
              </p>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-2 mb-3 font-display text-lg">
                <CheckCircle2 size={20} className="text-gold" /> Orçamento Transparente
              </div>
              <p className="text-sm text-muted">
                Trabalhamos com preços justos e orçamentos detalhados. O que é combinado antes do início da obra é exatamente o que será cobrado no final.
              </p>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-2 mb-3 font-display text-lg">
                <CheckCircle2 size={20} className="text-gold" /> Prazo é Prazo
              </div>
              <p className="text-sm text-muted">
                Sistemas industrializados como Drywall e Steel Frame permitem um cronograma matemático. Se dissemos que leva 10 dias, levará 10 dias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
