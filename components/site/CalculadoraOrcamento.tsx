'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, ChevronLeft, Loader2 } from 'lucide-react'
import { waMessage, fmtBRL } from '@/lib/utils'
import type { LeadServico, EstimativaResult } from '@/types'

const SERVICOS: { id: LeadServico; title: string; desc: string; icon: string }[] = [
  { id: 'drywall', title: 'Drywall', desc: 'Paredes, forros e divisórias', icon: '▪' },
  { id: 'eletrica', title: 'Elétrica', desc: 'Instalações residenciais/comerciais', icon: '⚡' },
  { id: 'steel_frame', title: 'Steel Frame', desc: 'Construção rápida e limpa', icon: '⬡' },
  { id: 'combinado', title: 'Projeto Combinado', desc: 'Múltiplos serviços integrados', icon: '⊞' },
]

export default function CalculadoraOrcamento() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [servico, setServico] = useState<LeadServico | ''>('')
  
  // Detalhes
  const [quantidade, setQuantidade] = useState('')
  const [tipoDrywall, setTipoDrywall] = useState('simples')
  const [tipoEletrica, setTipoEletrica] = useState('residencial')
  const [pavimentos, setPavimentos] = useState('1')
  
  // Contato
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  
  // Result
  const [estimativa, setEstimativa] = useState<EstimativaResult | null>(null)

  const handleNext = () => setStep(s => s + 1)
  const handlePrev = () => setStep(s => Math.max(1, s - 1))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome || !telefone || !servico || !quantidade) return
    
    setLoading(true)
    setError('')
    
    try {
      const payload = {
        servico,
        quantidade: Number(quantidade),
        detalhes: {
          tipo: tipoDrywall,
          tipo_obra: tipoEletrica,
          pavimentos: Number(pavimentos),
        },
        contato: { nome, telefone }
      }

      // Chama a API route que vai calcular, criar o lead e retornar a estimativa
      const res = await fetch('/api/v1/orcamento-estimativa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Erro ao calcular orçamento')
      
      setEstimativa(data.estimativa)
      setStep(4)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-3 mb-10">
      {[1, 2, 3].map(s => (
        <div key={s} className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm border-2 transition-colors
            ${step === s ? 'border-gold text-gold bg-gold/10' : 
              step > s ? 'border-gold bg-gold text-black' : 'border-line text-muted'}`}>
            {step > s ? <CheckCircle2 size={16} /> : s}
          </div>
          {s < 3 && <div className={`w-12 h-[2px] ${step > s ? 'bg-gold' : 'bg-line'}`} />}
        </div>
      ))}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto w-full">
      {step < 4 && renderStepIndicator()}

      <div className="card p-8 md:p-12 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-panel/80 backdrop-blur-sm flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-gold" size={40} />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* STEP 1: Serviço */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="display text-2xl mb-2">O que você precisa construir ou reformar?</h2>
              <p className="text-muted mb-8">Selecione o serviço principal para iniciarmos o cálculo.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {SERVICOS.map(s => (
                  <button key={s.id} type="button"
                    onClick={() => { setServico(s.id); handleNext() }}
                    className={`p-6 text-left border rounded-none transition-all
                      ${servico === s.id ? 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'border-line bg-panel-2 hover:border-line-hard'}`}
                  >
                    <div className="text-3xl mb-4 text-gold opacity-80">{s.icon}</div>
                    <div className="font-display text-lg mb-1">{s.title}</div>
                    <div className="text-sm text-muted">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Detalhes */}
          {step === 2 && (
            <div className="animate-fade-in">
              <button type="button" onClick={handlePrev} className="flex items-center gap-2 text-xs font-mono text-muted hover:text-gold mb-6 uppercase tracking-widest">
                <ChevronLeft size={14} /> Voltar
              </button>

              <h2 className="display text-2xl mb-2">Detalhes do projeto</h2>
              <p className="text-muted mb-8">Forneça os parâmetros básicos para uma estimativa precisa.</p>

              <div className="space-y-6">
                {/* DRYWALL */}
                {servico === 'drywall' && (
                  <>
                    <div>
                      <label className="form-label">Tipo de aplicação</label>
                      <select value={tipoDrywall} onChange={e => setTipoDrywall(e.target.value)} className="form-input">
                        <option value="simples">Divisória Simples (Padrão)</option>
                        <option value="dupla">Parede Dupla (Isolamento acústico)</option>
                        <option value="forro">Forro de Teto</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Área estimada (m²)</label>
                      <input type="number" min="1" required value={quantidade} onChange={e => setQuantidade(e.target.value)}
                        className="form-input" placeholder="Ex: 25" />
                    </div>
                  </>
                )}

                {/* ELÉTRICA */}
                {servico === 'eletrica' && (
                  <>
                    <div>
                      <label className="form-label">Tipo de imóvel</label>
                      <select value={tipoEletrica} onChange={e => setTipoEletrica(e.target.value)} className="form-input">
                        <option value="residencial">Residencial</option>
                        <option value="comercial">Comercial / Industrial</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Quantidade de pontos elétricos</label>
                      <input type="number" min="1" required value={quantidade} onChange={e => setQuantidade(e.target.value)}
                        className="form-input" placeholder="Ex: 12" />
                      <p className="text-xs text-muted mt-2">Tomadas, interruptores e pontos de luz contam como 1 ponto cada.</p>
                    </div>
                  </>
                )}

                {/* STEEL FRAME */}
                {servico === 'steel_frame' && (
                  <>
                    <div>
                      <label className="form-label">Número de pavimentos</label>
                      <select value={pavimentos} onChange={e => setPavimentos(e.target.value)} className="form-input">
                        <option value="1">1 Pavimento (Térrea)</option>
                        <option value="2">2 Pavimentos (Sobrado)</option>
                        <option value="3">3 ou mais pavimentos</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Área total construída (m²)</label>
                      <input type="number" min="1" required value={quantidade} onChange={e => setQuantidade(e.target.value)}
                        className="form-input" placeholder="Ex: 150" />
                    </div>
                  </>
                )}

                {/* COMBINADO */}
                {servico === 'combinado' && (
                  <div>
                    <label className="form-label">Área total do projeto (m²)</label>
                    <input type="number" min="1" required value={quantidade} onChange={e => setQuantidade(e.target.value)}
                      className="form-input" placeholder="Ex: 200" />
                    <p className="text-xs text-muted mt-2">Nossa equipe entrará em contato para detalhar as necessidades exatas (alvenaria leve + instalações).</p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button type="button" onClick={() => { if(quantidade) handleNext() }} 
                  disabled={!quantidade}
                  className="btn-gold disabled:opacity-50">
                  Avançar <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Contato */}
          {step === 3 && (
            <div className="animate-fade-in">
              <button type="button" onClick={handlePrev} className="flex items-center gap-2 text-xs font-mono text-muted hover:text-gold mb-6 uppercase tracking-widest">
                <ChevronLeft size={14} /> Voltar
              </button>

              <h2 className="display text-2xl mb-2">Para onde enviamos o resultado?</h2>
              <p className="text-muted mb-8">Deixe seu contato para visualizar a estimativa na hora.</p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 text-sm mb-6">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="form-label">Seu Nome</label>
                  <input type="text" required value={nome} onChange={e => setNome(e.target.value)}
                    className="form-input" placeholder="Como podemos te chamar?" />
                </div>
                <div>
                  <label className="form-label">WhatsApp</label>
                  <input type="tel" required value={telefone} onChange={e => setTelefone(e.target.value)}
                    className="form-input" placeholder="(42) 9 9999-9999" />
                </div>
              </div>

              <div className="mt-8">
                <button type="submit" className="btn-gold w-full justify-center">
                  Ver estimativa agora
                </button>
              </div>
            </div>
          )}
        </form>

        {/* STEP 4: Resultado */}
        {step === 4 && estimativa && (
          <div className="animate-fade-up text-center">
            <div className="w-16 h-16 bg-gold/10 border border-gold rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
              <CheckCircle2 size={32} />
            </div>
            
            <span className="section-label">Estimativa calculada</span>
            <h2 className="display text-3xl mb-8">Olá, {nome.split(' ')[0]}!</h2>
            
            <div className="bg-panel-2 border border-line p-8 mb-8">
              <div className="text-muted text-sm mb-2">Investimento estimado:</div>
              <div className="font-display text-4xl text-green-400 mb-2">
                {fmtBRL(estimativa.valor_minimo)} <span className="text-xl text-muted font-body">a</span> {fmtBRL(estimativa.valor_maximo)}
              </div>
              <div className="font-mono text-xs text-muted uppercase tracking-wider">
                {estimativa.breakdown[0]?.descricao}
              </div>
            </div>

            <p className="text-sm text-muted mb-8 max-w-md mx-auto">
              {estimativa.obs}
            </p>

            <a href={waMessage(`Olá! Fiz uma simulação no site para ${SERVICOS.find(s=>s.id===servico)?.title} e a estimativa ficou entre ${fmtBRL(estimativa.valor_minimo)} e ${fmtBRL(estimativa.valor_maximo)}. Podemos conversar sobre o projeto?`)}
              target="_blank" rel="noopener"
              className="btn-gold w-full justify-center text-[13px] py-4 shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]">
              Falar com o Sandro no WhatsApp <ArrowRight size={16} />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
