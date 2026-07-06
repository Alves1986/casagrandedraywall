import Link from 'next/link'
import Image from 'next/image'
import { WA_SANDRO } from '@/lib/utils'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--panel)', borderTop: '1px solid var(--line)' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <Image src="/branding/logo.webp" alt="Casa Grande Drywall" width={40} height={40} className="object-contain" />
              <div>
                <div className="font-display text-base font-medium">Casa Grande Drywall</div>
                <div className="font-mono text-[9px] tracking-widest uppercase" style={{ color: 'var(--gold)' }}>
                  Telêmaco Borba · PR
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--muted)' }}>
              Especialistas em Drywall, Elétrica e Steel Frame.
              Construção rápida, eficiente e de alta qualidade.
            </p>
            <a href={`${WA_SANDRO}?text=${encodeURIComponent('Olá! Vim pelo site e gostaria de um orçamento.')}`}
              target="_blank" rel="noopener"
              className="btn-gold inline-flex text-xs">
              WhatsApp → (42) 99817-7777
            </a>
          </div>

          {/* Serviços */}
          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: 'var(--muted)' }}>
              Serviços
            </div>
            {[
              ['Drywall', '/servicos/drywall'],
              ['Elétrica', '/servicos/eletrica'],
              ['Steel Frame', '/servicos/steel-frame'],
              ['Calculadora', '/orcamento'],
            ].map(([label, href]) => (
              <Link key={href} href={href}
                className="block text-sm py-1.5 transition-colors text-muted hover:text-text"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Links */}
          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: 'var(--muted)' }}>
              Empresa
            </div>
            {[
              ['Portfólio', '/portfolio'],
              ['Sobre nós', '/sobre'],
              ['Depoimentos', '/depoimentos'],
              ['Blog', '/blog'],
              ['Contato', '/contato'],
            ].map(([label, href]) => (
              <Link key={href} href={href}
                className="block text-sm py-1.5 transition-colors text-muted hover:text-text"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid var(--line)' }}>
          <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
            Av. Euclides Bonifácio Londres, 360 — Centro, Telêmaco Borba — PR · 84264-010
          </p>
          <div className="flex gap-6">
            <Link href="/politica-de-privacidade" className="text-xs font-mono transition-colors text-muted hover:text-text">Privacidade</Link>
            <Link href="/termos-de-uso" className="text-xs font-mono transition-colors text-muted hover:text-text">Termos</Link>
          </div>
          <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
            © {new Date().getFullYear()} Casa Grande Drywall
          </p>
        </div>
      </div>
    </footer>
  )
}
