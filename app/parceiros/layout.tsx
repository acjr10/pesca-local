import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Parceiros e Lojas de Pesca na Baixada Santista | Pesca Local',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
