import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Previsão do Tempo para Pesca | Pesca Local',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
