'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import pontosData from '@/data/pontos-de-pesca.json'
import pesqueirosData from '@/data/pesqueiros.json'

const formatCityName = (slug: string): string =>
  ({'praia-grande':'Praia Grande','sao-vicente':'São Vicente','santos':'Santos',
    'mongagua':'Mongaguá','itanhaem':'Itanhaém','peruibe':'Peruíbe'} as Record<string,string>)[slug] || slug

const TIPO_KEYWORDS: Record<string, string[]> = {
  'Praia':     ['praia', 'surfcasting', 'areia', 'arrebentacao'],
  'Canal':     ['canal', 'rio', 'estuario', 'foz', 'ponte'],
  'Deck/Píer': ['deck', 'pier', 'plataforma'],
  'Costão':    ['costao', 'pedra', 'rocha'],
  'Embarcada': ['embarcada', 'marina', 'barco', 'parcel', 'ilha'],
}

function norm(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function pontoMatchesTipo(pontoTipo: string, tipoFilter: string): boolean {
  if (tipoFilter === 'Pesqueiro') return false
  const keywords = TIPO_KEYWORDS[tipoFilter]
  if (!keywords) return true
  const n = norm(pontoTipo)
  return keywords.some(k => n.includes(k))
}

function BuscaContent() {
  const searchParams = useSearchParams()
  const cidade  = searchParams.get('cidade')  ?? ''
  const especie = searchParams.get('especie') ?? ''
  const tipo    = searchParams.get('tipo')    ?? ''

  const isPesqueiro = tipo === 'Pesqueiro'

  let results: any[]

  if (isPesqueiro) {
    results = (pesqueirosData as any[]).filter(p => {
      if (cidade && p.cidade !== cidade) return false
      if (especie) {
        const nEspecie = norm(especie)
        const found = (p.peixes as string[]).some((x: string) => norm(x) === nEspecie)
        if (!found) return false
      }
      return true
    })
  } else {
    results = (pontosData as any[]).filter(p => {
      if (cidade && p.cidade !== cidade) return false
      if (especie && !(p.especies as string[]).includes(especie)) return false
      if (tipo && !pontoMatchesTipo(p.tipo, tipo)) return false
      return true
    })
  }

  const filterChips: string[] = []
  if (cidade)  filterChips.push(formatCityName(cidade))
  if (especie) filterChips.push(especie.charAt(0).toUpperCase() + especie.slice(1))
  if (tipo)    filterChips.push(tipo)

  return (
    <>
      <div className="busca-hero">
        <div className="busca-hero-content">
          <h1>Resultados de busca</h1>
          {filterChips.length > 0 && (
            <div className="busca-filters">
              {filterChips.map(c => (
                <span key={c} className="busca-filter-chip">{c}</span>
              ))}
            </div>
          )}
          <p className="busca-count">
            {results.length} {results.length === 1 ? 'ponto encontrado' : 'pontos encontrados'}
          </p>
        </div>
      </div>

      <div className="inner-page">
        {results.length === 0 ? (
          <div className="busca-empty">
            <span className="busca-empty-icon">🔍</span>
            <p>Nenhum resultado encontrado para os filtros selecionados.</p>
            <a href="/" className="cta-primary" style={{ display: 'inline-block', marginTop: 20 }}>
              Voltar à busca
            </a>
          </div>
        ) : isPesqueiro ? (
          <div className="ponds-grid">
            {results.map((p: any) => (
              <article key={p.id} className="pond-card">
                <h3>{p.nome}</h3>
                <span className="pond-city">📍 {formatCityName(p.cidade)}, SP</span>
                <div className="pond-fish">🐟 {(p.peixes as string[]).slice(0, 5).join(', ')}</div>
                <div className="pond-amenities">
                  {(p.estrutura as string[]).slice(0, 3).map((e: string) => <span key={e}>{e}</span>)}
                </div>
                <a href={`/pesqueiros/${p.id}`} className="small-btn" style={{ display: 'block', textAlign: 'center' }}>
                  Ver pesqueiro
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="pontos-grid">
            {results.map((p: any) => (
              <div key={p.id} className="ponto-card ponto-card-rich">
                <div className="ponto-header">
                  <h3>{p.nome}</h3>
                  <span className="ponto-tipo">{p.tipo}</span>
                </div>
                <p className="ponto-cidade-tag">📍 {formatCityName(p.cidade)}</p>
                <p>{p.descricao}</p>
                {(p.melhorHorario || p.mareFavoravel) && (
                  <div className="ponto-meta">
                    {p.melhorHorario && <span>⏰ {p.melhorHorario}</span>}
                    {p.mareFavoravel && <span>🌊 {p.mareFavoravel}</span>}
                  </div>
                )}
                {p.iscasRecomendadas?.length > 0 && (
                  <div className="ponto-iscas" style={{ marginBottom: 10 }}>
                    {(p.iscasRecomendadas as string[]).slice(0, 4).map((i: string) => (
                      <span key={i} className="tipo-tag">{i}</span>
                    ))}
                  </div>
                )}
                {p.googleMapsUrl && (
                  <a
                    href={p.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ponto-maps-btn"
                    style={{ marginTop: 8 }}
                  >
                    📍 Ver no Google Maps
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default function BuscaPage() {
  return (
    <Suspense fallback={
      <div className="inner-page">
        <p style={{ color: '#64748b', fontSize: 14 }}>Carregando resultados...</p>
      </div>
    }>
      <BuscaContent />
    </Suspense>
  )
}
