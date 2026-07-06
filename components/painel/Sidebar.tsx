'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  Box,
  TrendingUp,
  Settings,
  LogOut,
  Calculator
} from 'lucide-react'

const MENU = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/painel' },
  { icon: Users, label: 'Leads (Funil)', href: '/painel/leads' },
  { icon: Calculator, label: 'Orçamentos', href: '/painel/orcamentos' },
  { icon: Briefcase, label: 'Projetos', href: '/painel/projetos' },
  { icon: Box, label: 'Insumos', href: '/painel/insumos' },
  { icon: TrendingUp, label: 'Relatórios', href: '/painel/relatorios' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-panel border-r border-line flex flex-col z-40">
      <div className="h-16 flex items-center px-6 border-b border-line">
        <Link href="/painel" className="font-display text-lg">
          Casa Grande <span className="text-gold">CRM</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {MENU.map(item => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-sm transition-colors font-mono text-xs uppercase tracking-wider
                ${active ? 'bg-gold/10 text-gold font-medium' : 'text-muted hover:text-text hover:bg-panel-2'}`}
            >
              <item.icon size={16} /> {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-line space-y-2">
        <Link href="/painel/configuracoes" className="w-full flex items-center gap-3 px-4 py-2.5 text-muted hover:text-text hover:bg-panel-2 rounded-sm transition-colors font-mono text-xs uppercase tracking-wider text-left">
          <Settings size={16} /> Configurações
        </Link>
        <button 
          onClick={async () => {
            const { logout } = await import('@/app/login/actions')
            await logout()
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-sm transition-colors font-mono text-xs uppercase tracking-wider text-left">
          <LogOut size={16} /> Sair
        </button>
      </div>
    </aside>
  )
}
