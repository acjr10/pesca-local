'use client'

import { useState } from 'react'
import pesqueirosData from '@/data/pesqueiros.json'

const CIDADE_NOME: Record<string, string> = {
  'praia-grande': 'Praia Grande',
  'sao-vicente':  'São Vicente',
  'santos':       'Santos',
  'mongagua':     'Mongaguá',
  'itanhaem':     'Itanhaém',
  'peruibe':      'Peruíbe',
}

const CIDADES = [
  { slug: 'praia-grande', nome: 'Praia Grande' },
  { slug: 'sao-vicente',  nome: 'São Vicente' },
  { slug: 'santos',       nome: 'Santos' },
  { slug: 'mongagua',     nome: 'Mongaguá' },
  { slug: 'itanhaem',     nome: 'Itanhaém' },
  { slug: 'peruibe',      nome: 'Peruíbe' },
]

function cidadeNome(slug: string) {
  return CIDADE_NOME[slug] || slug
}

export default function PesqueirosPage() {
  const [cidadeFiltro, setCidadeFiltro] = useState('')

  const filtrados = (pesqueirosData as any[]).filter(p =>
    !cidadeFiltro || p.cidade === cidadeFiltro
  )

  const selectStyle: React.CSSProperties = {
    padding: '10px 14px', border: '1px solid #dbe6ee', borderRadius: 10,
    fontSize: 14, background: '#fff', cursor: 'pointer', outline: 'none',
    color: '#031526', fontFamily: 'inherit',
  }

  return (
    <div className="page">
      <div className="inner-page">
        <div className="page-header">
          <h1>🎣 Pesqueiros</h1>
          <p>Encontre pesqueiros e pontos de pesca estruturados na Baixada Santista e litoral sul de São Paulo.</p>
        </div>

        {/* FILTRO */}
        <div className="parceiros-filtros">
          <label style={{ fontSize: 14, fontWeight: 600, color: '#334155', alignSelf: 'center' }}>
            Filtrar por cidade:
          </label>
          <select value={cidadeFiltro} onChange={e => setCidadeFiltro(e.target.value)} style={selectStyle}>
            <option value="">Todas as cidades</option>
            {CIDADES.map(c => (
              <option key={c.slug} value={c.slug}>{c.nome}</option>
            ))}
          </select>
        </div>

        {/* VAZIO */}
        {filtrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748b' }}>
            <p style={{ fontSize: 15, marginBottom: 16 }}>Nenhum pesqueiro encontrado para esta cidade no momento.</p>
            <button
              onClick={() => setCidadeFiltro('')}
              style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid #dbe6ee', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#0b78aa' }}
            >
              Ver todos
            </button>
          </div>
        )}

        <div className="ponds-grid">
          {filtrados.map(p => (
            <div key={p.id} className="pond-card">
              <h3>{p.nome}</h3>
              <span className="pond-city">📍 {cidadeNome(p.cidade)}, SP</span>

              {p.pescaNoturna && (
                <div style={{ marginBottom: 10 }}>
                  <span className="ponto-tipo">🌙 Pesca noturna</span>
                </div>
              )}

              <div className="pond-fish">🐟 {((p.peixes as string[]) ?? []).join(', ')}</div>

              <div className="pond-amenities">
                {((p.estrutura as string[]) ?? []).map(e => <span key={e}>{e}</span>)}
              </div>

              <div className="cidade-tipos" style={{ marginBottom: 16 }}>
                {((p.tiposPesca as string[]) ?? []).map(t => (
                  <span key={t} className="tipo-tag">{t}</span>
                ))}
              </div>

              {p.whatsapp && (
                <a
                  href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(`Olá ${p.nome}! Vi seu pesqueiro no Pesca Local (pescalocal.com.br) e tenho interesse. Pode me ajudar?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-btn"
                  style={{ display: 'block', textAlign: 'center', marginBottom: 10 }}
                >
                  WhatsApp
                </a>
              )}

              <a href={`/pesqueiros/${p.id}`} className="ver-btn">Ver detalhes →</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
