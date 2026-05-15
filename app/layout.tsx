import type { Metadata } from 'next'
import './globals.css'
import MobileNav from './components/MobileNav'

export const metadata: Metadata = {
  title: 'Pesca Local — Guia de pesca da Baixada Santista',
  description: 'Descubra onde pescar, quais espécies encontrar, melhores iscas e condições na Baixada Santista e litoral sul de São Paulo.',
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
            <div className="footer-col"><h4>Contato</h4><ul><li>contato@pescalocal.com.br</li><li>(13) 99666-1234</li><li>Praia Grande, SP</li></ul></div>
            <div className="footer-bottom">© 2025 Pesca Local. Todos os direitos reservados.</div>
          </footer>

        </div>
      </body>
    </html>
  )
}