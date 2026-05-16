'use client'

import { useState } from 'react'
import parceirosData from '@/data/parceiros.json'
import cidadesData from '@/data/cidades.json'

const CATEGORIA_EMOJI: Record<string, string> = {
  'Loja de pesca': '🎣',
  'Guia de pesca': '⛵',
  'Marina': '⚓',
  'Náutica': '🛥️',
  'Aluguel de barco': '🚤',
}

const CIDADES = [
  { slug: 'praia-grande', nome: 'Praia Grande' },
  { slug: 'sao-vicente',  nome: 'São Vicente' },
  { slug: 'santos',       nome: 'Santos' },
  { slug: 'mongagua',     nome: 'Mongaguá' },
  { slug: 'itanhaem',     nome: 'Itanhaém' },
  { slug: 'peruibe',      nome: 'Peruíbe' },
]

const CATEGORIAS = ['Loja de pesca', 'Guia de pesca', 'Marina', 'Aluguel de barco', 'Náutica']

function cidadeNome(id: string) {
  return (cidadesData as any[]).find(c => c.id === id)?.nome ?? id
}

function ParceiroCard({ p }: { p: any }) {
  return (
    <article className={`partner-card ${p.plano === 'destaque' ? 'featured' : ''}`}>
      {p.plano === 'destaque' && <span className="tag-featured">Em Destaque</span>}

      <div className="partner-logo alt">
        {CATEGORIA_EMOJI[p.categoria] ?? '🎣'}
      </div>

      <h3>{p.nome}</h3>
      <div className="partner-meta">{p.categoria} · {cidadeNome(p.cidade)}</div>

      {p.estrelas > 0 && (
        <div className="stars">
          {'★'.repeat(Math.round(p.estrelas))}{'☆'.repeat(5 - Math.round(p.estrelas))}
          {' '}{p.estrelas} <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: 12 }}>({p.avaliacoes} avaliações)</span>
        </div>
      )}

      <p style={{ fontSize: 13, color: '#334155', margin: '0 0 16px', lineHeight: 1.5 }}>
        {p.descricao}
      </p>

      {p.whatsapp && (
        <a
          href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(`Olá ${p.nome}! Vi seu negócio no Pesca Local (pescalocal.com.br) e tenho interesse. Pode me ajudar?`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn"
          style={{ display: 'block', textAlign: 'center', marginBottom: 8 }}
        >
          WhatsApp
        </a>
      )}

      <a href={`/parceiros/${p.id}`} className="ver-btn">Ver perfil →</a>
    </article>
  )
}

export default function ParceirosPage() {
  const [cidadeFiltro, setCidadeFiltro]       = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')

  const ativos = (parceirosData as any[]).filter(p => p.ativo)

  const filtrados = ativos.filter(p =>
    (!cidadeFiltro    || p.cidade    === cidadeFiltro) &&
    (!categoriaFiltro || p.categoria === categoriaFiltro)
  )

  const destaques = filtrados.filter(p => p.plano === 'destaque')
  const demais    = filtrados.filter(p => p.plano !== 'destaque')

  const selectStyle: React.CSSProperties = {
    padding: '10px 14px', border: '1px solid #dbe6ee', borderRadius: 10,
    fontSize: 14, background: '#fff', cursor: 'pointer', outline: 'none',
    color: '#031526', fontFamily: 'inherit',
  }

  return (
    <div className="page">
      <div className="inner-page">
        <div className="page-header">
          <h1>🤝 Parceiros</h1>
          <p>Lojas, guias, marinas e serviços especializados na Baixada Santista e litoral sul de São Paulo.</p>
        </div>

        {/* FILTROS */}
        <div className="parceiros-filtros">
          <select value={cidadeFiltro} onChange={e => setCidadeFiltro(e.target.value)} style={selectStyle}>
            <option value="">Todas as cidades</option>
            {CIDADES.map(c => (
              <option key={c.slug} value={c.slug}>{c.nome}</option>
            ))}
          </select>
          <select value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)} style={selectStyle}>
            <option value="">Todos os serviços</option>
            {CATEGORIAS.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* VAZIO */}
        {filtrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748b' }}>
            <p style={{ fontSize: 15, marginBottom: 16 }}>Nenhum parceiro encontrado para os filtros selecionados.</p>
            <button
              onClick={() => { setCidadeFiltro(''); setCategoriaFiltro('') }}
              style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid #dbe6ee', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#0b78aa' }}
            >
              Limpar filtros
            </button>
          </div>
        )}

        {destaques.length > 0 && (
          <div className="cidade-section">
            <div className="section-header">
              <h2 className="section-title">⭐ Em Destaque</h2>
            </div>
            <div className="partners-grid">
              {destaques.map(p => <ParceiroCard key={p.id} p={p} />)}
            </div>
          </div>
        )}

        {demais.length > 0 && (
          <div className="cidade-section">
            <div className="section-header">
              <h2 className="section-title">🗂️ Outros parceiros</h2>
            </div>
            <div className="partners-grid">
              {demais.map(p => <ParceiroCard key={p.id} p={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
