import type { Metadata } from 'next'
import cidadesData  from '@/data/cidades.json'
import pontosData   from '@/data/pontos-de-pesca.json'
import parceirosData from '@/data/parceiros.json'
import pesqueirosData from '@/data/pesqueiros.json'
import ConditionsWidget from '../../components/ConditionsWidget'

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  const local = digits.startsWith('55') ? digits.slice(2) : digits
  const ddd = local.slice(0, 2)
  const num = local.slice(2)
  if (num.length === 9) return `(${ddd}) ${num.slice(0, 5)}-${num.slice(5)}`
  if (num.length === 8) return `(${ddd}) ${num.slice(0, 4)}-${num.slice(4)}`
  return local
}

const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  'praia-grande': { lat: -24.0057, lon: -46.4022 },
  'sao-vicente':  { lat: -23.9608, lon: -46.3922 },
  'santos':       { lat: -23.9608, lon: -46.3339 },
  'mongagua':     { lat: -24.0889, lon: -46.6269 },
  'itanhaem':     { lat: -24.1833, lon: -46.7897 },
  'peruibe':      { lat: -24.3189, lon: -47.0053 },
}

const PERFIL_LABEL: Record<string, string> = {
  iniciante:     '🐣 Iniciante',
  intermediario: '🎯 Intermediário',
  avancado:      '🏆 Avançado',
  praia:         '🏖️ Pesca de praia',
  robalo:        '🐟 Robalo',
  familia:       '👨‍👩‍👧 Família',
  embarcada:     '⛵ Embarcada',
}

const CATEGORIA_EMOJI: Record<string, string> = {
  'Loja de pesca': '🎣', 'Guia de pesca': '⛵',
  'Marina': '⚓', 'Náutica': '🛥️', 'Aluguel de barco': '🚤',
}

const DIFIC_COR: Record<string, string> = {
  'Fácil':    '#14c8c2',
  'Moderado': '#f59e0b',
  'Difícil':  '#ef4444',
}
const DIFIC_BG: Record<string, string> = {
  'Fácil':    '#e0fdf4',
  'Moderado': '#fef9c3',
  'Difícil':  '#fee2e2',
}

function dificBadge(nivel: string) {
  const cor = DIFIC_COR[nivel] ?? '#64748b'
  const bg  = DIFIC_BG[nivel] ?? '#f1f5f9'
  return { background: bg, color: cor, border: `1px solid ${cor}33`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700, display: 'inline-block' }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cidade = (cidadesData as any[]).find(c => c.id === slug)
  if (!cidade) return {}
  return {
    title: `Pesca em ${cidade.nome}`,
    description: `Veja onde pescar em ${cidade.nome}, principais espécies, pontos de pesca, iscas recomendadas, pesqueiros e parceiros da região.`,
  }
}

export default async function CidadePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cidade    = (cidadesData   as any[]).find(c => c.id === slug)
  if (!cidade) return <div style={{ padding: 40 }}>Cidade não encontrada.</div>

  const pontos    = (pontosData    as any[]).filter(p => p.cidade === slug)
  const parceiros = (parceirosData as any[]).filter(p => p.cidade === slug && p.ativo)
  const pesqueiros = (pesqueirosData as any[]).filter(p => p.cidade === slug)
  const coords    = CITY_COORDS[slug] ?? { lat: -24.0057, lon: -46.4022 }

  const roteiros: Record<string, string[]> = cidade?.roteirosPorPerfil ?? {}

  return (
    <>
      {/* ── 1. HERO ───────────────────────────────────────────────── */}
      <div
        className={`cidade-hero city-${cidade.id}`}
        style={{ backgroundImage: `url('/cidades/${cidade.id}.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="cidade-hero-content">
          <p className="cidade-region">{cidade?.regiao} · {cidade?.estado}</p>
          <h1>{cidade.nome}</h1>
          <p className="cidade-desc">{cidade?.resumoPesca ?? cidade?.descricao}</p>
          <div className="cidade-tipos">
            {(cidade?.tiposPescaFortes ?? cidade?.tiposPesca ?? []).map((t: string) => (
              <span key={t} className="tipo-tag">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="inner-page">

        {/* ── 2. INFO RÁPIDA ────────────────────────────────────────── */}
        <div className="cidade-info-grid" style={{ marginBottom: 48 }}>
          <div className="info-card">
            <div className="info-icon">🗓️</div>
            <div className="info-label">Melhor época</div>
            <div className="info-value">{cidade?.melhorEpoca}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">⏰</div>
            <div className="info-label">Melhor horário</div>
            <div className="info-value">{cidade?.melhorHorario}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">🎣</div>
            <div className="info-label">Iscas recomendadas</div>
            <div className="info-value">{cidade?.iscasRecomendadas?.join(', ')}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">💡</div>
            <div className="info-label">Observação local</div>
            <div className="info-value">{cidade?.observacaoLocal ?? cidade?.observacoes}</div>
          </div>
        </div>

        {/* ── 2.5. PLANEJAMENTO DA PESCARIA ────────────────────────── */}
        <div className="cidade-section">
          <ConditionsWidget
            initialLat={coords.lat}
            initialLon={coords.lon}
            initialCityName={cidade.nome}
          />
        </div>

        {/* ── 3. ROTEIROS POR PERFIL ────────────────────────────────── */}
        {Object.keys(roteiros).length > 0 && (
          <div className="cidade-section">
            <h2 className="section-title">🗺️ Roteiros por perfil</h2>
            <div className="roteiros-grid">
              {Object.entries(roteiros).map(([perfil, pontosList]) => (
                <div key={perfil} className="roteiro-card">
                  <div className="roteiro-perfil">
                    {PERFIL_LABEL[perfil] ?? perfil}
                  </div>
                  <ul className="roteiro-lista">
                    {(pontosList as string[]).map((item: string) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 4. PONTOS DE PESCA ────────────────────────────────────── */}
        {pontos.length > 0 && (
          <div className="cidade-section">
            <h2 className="section-title">📍 Pontos de pesca</h2>
            <div className="pontos-grid">
              {pontos.map((p: any) => (
                <div key={p.id} className="ponto-card ponto-card-rich">

                  {/* Header */}
                  <div className="ponto-header">
                    <h3>{p.nome}</h3>
                    <span className="ponto-tipo">{p.tipo}</span>
                  </div>

                  <p>{p.descricao}</p>

                  {/* Fundo + dificuldade */}
                  <div className="ponto-badges">
                    {p?.tipoFundo && (
                      <span className="ponto-fundo">🪨 {p.tipoFundo}</span>
                    )}
                    {p?.dificuldadeAcesso && (
                      <span style={dificBadge(p.dificuldadeAcesso)}>{p.dificuldadeAcesso}</span>
                    )}
                    {p?.riscoEnrosco && (
                      <span className="ponto-risco">🪢 Enrosco: {p.riscoEnrosco}</span>
                    )}
                  </div>

                  {/* Horário + maré */}
                  <div className="ponto-meta">
                    {p?.melhorHorario && <span>⏰ {p.melhorHorario}</span>}
                    {p?.mareFavoravel && <span>🌊 {p.mareFavoravel}</span>}
                  </div>

                  {/* Iscas */}
                  {p?.iscasRecomendadas?.length > 0 && (
                    <div className="ponto-iscas" style={{ marginBottom: 10 }}>
                      {(p.iscasRecomendadas as string[]).map((i: string) => (
                        <span key={i} className="tipo-tag">{i}</span>
                      ))}
                    </div>
                  )}

                  {/* Indicado para */}
                  {p?.indicadoPara?.length > 0 && (
                    <div className="ponto-indicado">
                      <span className="ponto-indicado-label">Indicado para:</span>
                      {(p.indicadoPara as string[]).map((i: string) => (
                        <span key={i} className="ponto-indicado-chip">{i}</span>
                      ))}
                    </div>
                  )}

                  {/* Segurança */}
                  {p?.segurancaECuidados && (
                    <div className="ponto-aviso">
                      <span>⚠️</span>
                      <span>{p.segurancaECuidados}</span>
                    </div>
                  )}

                  {/* Estrutura + estacionamento */}
                  {(p?.estrutura || p?.estacionamento) && (
                    <div className="ponto-infra">
                      {p?.estacionamento && <span>🅿️ {p.estacionamento}</span>}
                      {p?.estrutura      && <span>🏗️ {p.estrutura}</span>}
                    </div>
                  )}

                  {/* Google Maps */}
                  {p?.googleMapsUrl && (
                    <a
                      href={p.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ponto-maps-btn"
                    >
                      📍 Ver no Google Maps
                    </a>
                  )}

                  {/* Quando evitar */}
                  {p?.quandoEvitar && (
                    <p className="ponto-quando-evitar">🚫 {p.quandoEvitar}</p>
                  )}

                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 5. CUIDADOS LOCAIS ────────────────────────────────────── */}
        {cidade?.cuidadosLocais?.length > 0 && (
          <div className="cidade-section">
            <h2 className="section-title">⚠️ Cuidados locais</h2>
            <ul className="cuidados-list">
              {(cidade.cuidadosLocais as string[]).map((c: string) => (
                <li key={c} className="cuidado-item">
                  <span>⚠️</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── 6. QUANDO EVITAR ──────────────────────────────────────── */}
        {cidade?.quandoEvitar && (
          <div className="cidade-section">
            <h2 className="section-title">🚫 Quando evitar</h2>
            <div className="quando-evitar-card">
              <span className="quando-evitar-icon">🚫</span>
              <p>{cidade.quandoEvitar}</p>
            </div>
          </div>
        )}

        {/* ── 7. PARCEIROS DA CIDADE ────────────────────────────────── */}
        {parceiros.length > 0 && (
          <div className="cidade-section">
            <div className="section-header">
              <h2 className="section-title">🏪 Parceiros em {cidade.nome}</h2>
              <a href="/parceiros" className="section-link">Ver todos →</a>
            </div>
            <div className="partners-grid">
              {parceiros.map((p: any) => (
                <article key={p.id} className={`partner-card${p.plano === 'destaque' ? ' featured' : ''}`}>
                  {p.plano === 'destaque' && <span className="tag-featured">Em Destaque</span>}
                  <div className="partner-logo alt">
                    {CATEGORIA_EMOJI[p.categoria] ?? '🎣'}
                  </div>
                  <h3>{p.nome}</h3>
                  <div className="partner-meta">{p.categoria}</div>
                  {p.estrelas > 0 && (
                    <div className="stars">
                      {'★'.repeat(Math.round(p.estrelas))}{'☆'.repeat(5 - Math.round(p.estrelas))}
                      {' '}{p.estrelas}
                    </div>
                  )}
                  <p style={{ fontSize: 13, color: '#334155', margin: '0 0 12px', lineHeight: 1.5 }}>
                    {p.descricao}
                  </p>
                  {p.plano !== 'destaque' && p.whatsapp && (
                    <p style={{ fontSize: 13, color: '#334155', margin: '0 0 8px' }}>
                      Telefone: {formatPhone(p.whatsapp)}
                    </p>
                  )}
                  {p.plano === 'destaque' && p.whatsapp && (
                    <a
                      href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(`Olá ${p.nome}! Vi seu negócio no Pesca Local na página de ${cidade.nome} e tenho interesse. Pode me ajudar?`)}`}
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
              ))}
            </div>
          </div>
        )}

        {/* ── 8. PESQUEIROS DA CIDADE ───────────────────────────────── */}
        {pesqueiros.length > 0 && (
          <div className="cidade-section">
            <div className="section-header">
              <h2 className="section-title">🎣 Pesqueiros em {cidade.nome}</h2>
              <a href="/pesqueiros" className="section-link">Ver todos →</a>
            </div>
            <div className="ponds-grid">
              {pesqueiros.map((p: any) => (
                <article key={p.id} className="pond-card">
                  <h3>{p.nome}</h3>
                  <div className="pond-fish">🐟 {(p.peixes as string[])?.join(', ')}</div>
                  <div className="pond-amenities">
                    {(p.estrutura as string[])?.map((e: string) => <span key={e}>{e}</span>)}
                  </div>
                  {p.plano === 'destaque' && p.whatsapp && (
                    <a
                      href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(`Olá ${p.nome}! Vi seu pesqueiro no Pesca Local na página de ${cidade.nome} e tenho interesse. Pode me ajudar?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp-btn"
                      style={{ display: 'block', textAlign: 'center', marginBottom: 8, marginTop: 12 }}
                    >
                      WhatsApp
                    </a>
                  )}
                  <a href={`/pesqueiros/${p.id}`} className="ver-btn">Ver detalhes →</a>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ── 9. CTA ────────────────────────────────────────────────── */}
        <div className="cidade-cta">
          <h3>Tem um negócio em {cidade.nome}?</h3>
          <p>Apareça para pescadores que estão planejando pescar na sua cidade.</p>
          <a href="/anuncie" className="cta-primary" style={{ display: 'inline-block' }}>
            Quero anunciar
          </a>
        </div>

      </div>
    </>
  )
}
