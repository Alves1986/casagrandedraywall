import Sidebar from '@/components/painel/Sidebar'

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        <header className="h-16 bg-panel border-b border-line flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="font-mono text-xs text-muted uppercase tracking-widest">
            Visão Geral
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium">Sandro Gomes</div>
              <div className="text-xs text-gold font-mono">Administrador</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-panel-2 border border-line flex items-center justify-center font-display text-gold">
              S
            </div>
          </div>
        </header>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
