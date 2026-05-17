import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Busca | Pesca Local',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
