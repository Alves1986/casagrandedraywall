'use client'
import { WA_SANDRO } from '@/lib/utils'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppFloat() {
  return (
    <a
      href={`${WA_SANDRO}?text=${encodeURIComponent('Olá! Vim pelo site da Casa Grande Drywall e gostaria de um orçamento.')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-110 animate-pulse-gold"
      style={{ background: '#25d366' }}
      aria-label="Falar pelo WhatsApp"
    >
      <MessageCircle fill="white" color="white" size={26} />
    </a>
  )
}
