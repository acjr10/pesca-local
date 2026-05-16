import type { Metadata } from 'next'
import './globals.css'
import MobileNav from './components/MobileNav'
import { SITE_URL } from '@/lib/config'

const TITLE       = 'Pesca Local | Guia de pesca da Baixada Santista'
const DESCRIPTION = 'Encontre pontos de pesca, espécies, iscas, clima, pesqueiros, lojas, guias e parceiros na Baixada Santista e litoral sul de São Paulo.'
const OG_IMAGE    = '/images/og/pesca-local-og.jpg'

export const metadata: Metadata = {
  title: {
    default:  TITLE,
    template: '%s | Pesca Local',
  },
  description: DESCRIPTION,
  robots: { index: true, follow: true },
  openGraph: {
    title:       TITLE,
    description: DESCRIPTION,
    type:        'website',
    locale:      'pt_BR',
    url:         SITE_URL,
    siteName:    'Pesca Local',
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       TITLE,
    description: DESCRIPTION,
    images:      [OG_IMAGE],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="page">

          <header className="topbar">
            <div className="brand">
              <div className="brand-mark"><div className="fish-mini"></div></div>
              <div>
                <div className="brand-title">Pesca Local</div>
                <div className="brand-subtitle">Baixada Santista</div>
              </div>
            </div>
            <nav className="nav">
              <a href="/">Início</a>
              <a href="/cidades">Cidades</a>
              <a href="/especies">Espécies</a>
              <a href="/pesqueiros">Pesqueiros</a>
              <a href="/parceiros">Parceiros</a>
              <a href="/previsao">Previsão</a>
            </nav>
            <a href="/anuncie" className="announce-btn">📣 Anuncie aqui</a>
            <MobileNav />
          </header>

          <main>{children}</main>

          <footer className="footer">
            <div className="footer-brand">
              <div className="brand">
                <div className="brand-mark"><div className="fish-mini"></div></div>
                <div>
                  <div className="footer-title">Pesca Local</div>
                  <div className="footer-sub">Baixada Santista</div>
                </div>
              </div>
              <p>O guia completo da pesca na Baixada Santista e litoral sul de São Paulo.</p>
            </div>
            <div className="footer-col"><h4>Explorar</h4><ul><li><a href="/cidades">Cidades</a></li><li><a href="/especies">Espécies</a></li><li><a href="/pesqueiros">Pesqueiros</a></li><li><a href="/parceiros">Parceiros</a></li><li><a href="/previsao">Previsão</a></li></ul></div>
            <div className="footer-col"><h4>Parceiros</h4><ul><li><a href="/anuncie">Seja um parceiro</a></li><li><a href="/anuncie">Anuncie aqui</a></li><li><a href="/anuncie#planos">Planos e preços</a></li></ul></div>
            <div className="footer-col"><h4>Contato</h4><ul><li><a href="https://wa.me/5513996243365" target="_blank" rel="noopener noreferrer">Fale pelo WhatsApp</a></li><li>Baixada Santista, SP</li></ul></div>
            <div className="footer-bottom">© 2025 Pesca Local. Todos os direitos reservados.</div>
          </footer>

        </div>
      </body>
    </html>
  )
}