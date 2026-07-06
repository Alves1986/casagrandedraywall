'use client'
import { useState } from 'react'
import { ArrowRight, Loader2, Mail, MapPin, Phone, CheckCircle2 } from 'lucide-react'
import { WA_SANDRO, waMessage } from '@/lib/utils'

export default function ContatoPage() {
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErro('')
    
    const fd = new FormData(e.currentTarget)
    const payload = {
      nome: fd.get('nome'),
      telefone: fd.get('telefone'),
      email: fd.get('email'),
      mensagem: fd.get('mensagem'),
    }

    try {
      const res = await fetch('/api/v1/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      if (!res.ok) throw new Error('Erro ao enviar mensagem')
      
      setSucesso(true)
      ;(e.target as HTMLFormElement).reset()
    } catch (err) {
      setErro('Não foi possível enviar a mensagem no momento. Por favor, tente via WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="section-label animate-fade-up">Fale conosco</span>
          <h1 className="display text-4xl md:text-5xl animate-fade-up delay-100">Contato</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-fade-up delay-200">
          
          {/* INFOS */}
          <div>
            <h2 className="display text-2xl mb-8">Informações de Contato</h2>
            
            <div className="space-y-8 mb-12">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-panel-2 border border-line flex items-center justify-center text-gold flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="font-display text-lg mb-1">Telefone / WhatsApp</div>
                  <a href={WA_SANDRO} target="_blank" rel="noopener" className="text-muted hover:text-gold transition-colors">
                    (42) 99817-7777
                  </a>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-panel-2 border border-line flex items-center justify-center text-gold flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="font-display text-lg mb-1">E-mail</div>
                  <a href="mailto:contato@casagrandedrywall.com.br" className="text-muted hover:text-gold transition-colors">
                    contato@casagrandedrywall.com.br
                  </a>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-panel-2 border border-line flex items-center justify-center text-gold flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="font-display text-lg mb-1">Endereço</div>
                  <p className="text-muted">
                    Av. Euclides Bonifácio Londres, 360<br/>
                    Centro, Telêmaco Borba - PR<br/>
                    CEP: 84264-010
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-panel-2">
              <h3 className="font-display text-lg mb-2">Quer um orçamento rápido?</h3>
              <p className="text-sm text-muted mb-4">
                Para estimativas de valores, utilize nossa calculadora online. É rápido e sem compromisso.
              </p>
              <a href="/orcamento" className="btn-outline w-full justify-center">
                Acessar Calculadora
              </a>
            </div>
          </div>

          {/* FORMULÁRIO */}
          <div className="card p-8 md:p-12 relative overflow-hidden">
            {loading && (
              <div className="absolute inset-0 bg-panel/80 backdrop-blur-sm flex items-center justify-center z-10">
                <Loader2 className="animate-spin text-gold" size={40} />
              </div>
            )}
            
            <h2 className="display text-2xl mb-6">Envie uma mensagem</h2>
            
            {sucesso ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="display text-xl mb-2">Mensagem enviada!</h3>
                <p className="text-muted mb-8">Retornaremos o contato o mais breve possível.</p>
                <button onClick={() => setSucesso(false)} className="btn-outline">
                  Enviar nova mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {erro && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 text-sm">
                    {erro}
                  </div>
                )}
                
                <div>
                  <label className="form-label">Nome Completo</label>
                  <input type="text" name="nome" required className="form-input" placeholder="Seu nome" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">WhatsApp</label>
                    <input type="tel" name="telefone" required className="form-input" placeholder="(42) 99999-9999" />
                  </div>
                  <div>
                    <label className="form-label">E-mail</label>
                    <input type="email" name="email" className="form-input" placeholder="seu@email.com" />
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Como podemos ajudar?</label>
                  <textarea name="mensagem" required rows={4} className="form-input resize-none" placeholder="Descreva brevemente seu projeto ou dúvida..."></textarea>
                </div>
                
                <button type="submit" className="btn-gold w-full justify-center">
                  Enviar mensagem <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
          
        </div>
      </div>
    </div>
  )
}
