import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pesqueiros na Baixada Santista e Litoral Sul | Pesca Local',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
