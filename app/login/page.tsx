'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowRight, Lock } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const fd = new FormData(e.currentTarget)
    const { login } = await import('./actions')
    const res = await login(fd)
    
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-bg">
      {/* Bg FX */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 60%)' }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Image src="/branding/logo.webp" alt="Logo" width={96} height={96} className="mx-auto mb-4" />
          <h1 className="display text-4xl mb-1">Acesso ao CRM</h1>
          <p className="text-muted text-base">Casa Grande Drywall</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="form-label">E-mail</label>
              <input type="email" name="email" required className="form-input" placeholder="Seu e-mail de acesso" />
            </div>
            
            <div>
              <label className="form-label flex justify-between">
                Senha
                <a href="#" className="text-gold hover:underline">Esqueceu?</a>
              </label>
              <input type="password" name="password" required className="form-input" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full justify-center disabled:opacity-50">
              {loading ? 'Entrando...' : (
                <>Entrar no sistema <ArrowRight size={14} /></>
              )}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-8 text-xs font-mono text-muted flex items-center justify-center gap-2">
          <Lock size={12} /> Acesso restrito a funcionários
        </div>
      </div>
    </div>
  )
}
