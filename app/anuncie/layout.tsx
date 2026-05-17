import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anuncie no Pesca Local | Guia de Pesca da Baixada Santista',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
