import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Casa Grande Drywall',
    default: 'Casa Grande Drywall — Drywall, Elétrica e Steel Frame em Telêmaco Borba, PR',
  },
  description: 'Especialistas em Drywall, Elétrica e Steel Frame em Telêmaco Borba, PR. Construção rápida, eficiente e de alta qualidade. Orçamento gratuito.',
  keywords: ['drywall', 'steel frame', 'elétrica', 'Telêmaco Borba', 'construção', 'reforma'],
  authors: [{ name: 'Casa Grande Drywall' }],
  creator: 'Casa Grande Drywall',
  openGraph: {
    siteName: 'Casa Grande Drywall',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
