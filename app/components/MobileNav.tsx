'use client'

import { useState } from 'react'

const LINKS = [
  { href: '/', label: 'Início' },
  { href: '/cidades', label: 'Cidades' },
  { href: '/especies', label: 'Espécies' },
  { href: '/pesqueiros', label: 'Pesqueiros' },
  { href: '/parceiros', label: 'Parceiros' },
  { href: '/previsao', label: 'Previsão' },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setOpen(o => !o)}
        aria-label="Menu"
      >
        <span className={`hamburger${open ? ' open' : ''}`} />
      </button>

      {open && (
        <>
          <div className="mobile-overlay" onClick={() => setOpen(false)} />
          <nav className="mobile-nav">
            {LINKS.map(l => (
              <a key={l.href} href={l.href} className="mobile-nav-link" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <a href="/anuncie" className="mobile-nav-cta" onClick={() => setOpen(false)}>
              📣 Anuncie aqui
            </a>
          </nav>
        </>
      )}
    </>
  )
}
