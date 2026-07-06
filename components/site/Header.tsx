'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { WA_SANDRO } from '@/lib/utils'

const NAV = [
  { label: 'Serviços', href: '/servicos' },
  { label: 'Portfólio', href: '/portfolio' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contato', href: '/contato' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header style={{ background: 'var(--panel)', borderBottom: '1px solid var(--line)' }}
      className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/branding/logo.webp" alt="Casa Grande Drywall" width={56} height={56}
            className="object-contain" />
          <div>
            <div className="font-display text-lg font-medium leading-none" style={{ color: 'var(--text)' }}>
              Casa Grande
            </div>
            <div className="font-mono text-[10px] tracking-widest uppercase mt-1" style={{ color: 'var(--gold)' }}>
              Drywall • Elétrica • Steel Frame
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className="text-sm transition-colors duration-200 text-muted hover:text-text"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/painel" className="text-sm font-medium transition-colors" style={{ color: 'var(--muted)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--text)'} onMouseOut={e => e.currentTarget.style.color = 'var(--muted)'}>
            Área Admin
          </Link>
          <Link href="/orcamento" className="btn-gold text-xs">
            Orçamento grátis
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" style={{ color: 'var(--muted)' }}
          onClick={() => setOpen(o => !o)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: 'var(--panel)', borderBottom: '1px solid var(--line)' }}
          className="md:hidden px-6 pb-6">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className="block py-3 text-sm border-b"
              style={{ color: 'var(--muted)', borderColor: 'var(--line)' }}
              onClick={() => setOpen(false)}
            >
              {n.label}
            </Link>
          ))}
          <Link href="/painel" 
            className="block py-3 text-sm border-b"
            style={{ color: 'var(--text)', borderColor: 'var(--line)' }}
            onClick={() => setOpen(false)}
          >
            Área Admin (CRM)
          </Link>
          <Link href="/orcamento" className="btn-gold w-full text-center mt-4 block">
            Orçamento grátis
          </Link>
        </div>
      )}
    </header>
  )
}
