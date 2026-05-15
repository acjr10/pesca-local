import type { Metadata } from 'next'
import especiesData from '@/data/especies.json'
import cidadesData from '@/data/cidades.json'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const especie = (especiesData as any[]).find(e => e.id === slug)
  if (!especie) return {}
  return {
    title: `Como pescar ${especie.nome} na Baixada Santista`,
    description: `Veja onde encontrar ${especie.nome}, melhores épocas, horários, iscas naturais, artificiais e materiais recomendados.`,
  }
}

export default async function EspeciePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const especie = (especiesData as any[]).find(e => e.id === slug)
  if (!especie) return <div style={{ padding: 40 }}>Espécie não encontrada.</div>

  const cidades = (cidadesData as any[]).filter(c => (especie.cidades as string[]).includes(c.id))

  return (
    <>
      {/* HERO */}
      <div className="cidade-hero">
        <div className="cidade-hero-content">
          <p className="cidade-region">🐟 Espécie · {especie.nivelDificuldade}</p>
          <h1>{especie.nome}</h1>
          <p className="cidade-desc" style={{ fontStyle: 'italic', marginBottom: 8 }}>
            {especie.nomeCientifico}
          </p>
          <p className="cidade-desc">{especie.descricao}</p>
          <div className="cidade-tipos">
            {(especie.ambiente as string[]).map(a => (
              <span key={a} className="tipo-tag">{a}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="inner-page">

        {/* INFORMAÇÕES RÁPIDAS */}
        <div className="cidade-info-grid">
          <div className="info-card">
            <div className="info-icon">🗓️</div>
            <div className="info-label">Melhor época</div>
            <div className="info-value">{especie.melhorEpoca}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">⏰</div>
            <div className="info-label">Melhor horário</div>
            <div className="info-value">{especie.melhorHorario}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">🌊</div>
            <div className="info-label">Maré favorável</div>
            <div className="info-value">{especie.mareFavoravel}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">📊</div>
            <div className="info-label">Nível de dificuldade</div>
            <div className="info-value">{especie.nivelDificuldade}</div>
          </div>
        </div>

        {/* ISCAS */}
        <div className="cidade-section">
          <h2 className="section-title">🎣 Iscas recomendadas</h2>
          <div className="pontos-grid">
            <div className="ponto-card">
              <div className="ponto-header">
                <h3>Iscas naturais</h3>
                <span className="ponto-tipo">Naturais</span>
              </div>
              <div className="ponto-iscas">
                {(especie.iscasNaturais as string[]).map(i => (
                  <span key={i} className="tipo-tag">{i}</span>
                ))}
              </div>
            </div>
            <div className="ponto-card">
              <div className="ponto-header">
                <h3>Iscas artificiais</h3>
                <span className="ponto-tipo" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                  Artificiais
                </span>
              </div>
              <div className="ponto-iscas">
                {(especie.iscasArtificiais as string[]).map(i => (
                  <span key={i} className="tipo-tag">{i}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MATERIAL RECOMENDADO */}
        <div className="cidade-section">
          <h2 className="section-title">🧰 Material recomendado</h2>
          <div className="ponto-card">
            <div className="ponto-iscas">
              {(especie.materialRecomendado as string[]).map(m => (
                <span key={m} className="tipo-tag">{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* DICAS */}
        <div className="cidade-section">
          <h2 className="section-title">💡 Dicas de pesca</h2>
          <div className="ponto-card">
            <p>{especie.dicas}</p>
          </div>
        </div>

        {/* CIDADES ONDE É ENCONTRADA */}
        <div className="cidade-section">
          <h2 className="section-title">📍 Onde encontrar na Baixada Santista</h2>
          <div className="cities-grid">
            {cidades.map(c => (
              <a key={c.id} href={`/cidades/${c.id}`} className="city-card">
                <div className={`city-thumb city-${c.id}`}>
                  <span className="city-name">{c.nome}</span>
                </div>
                <div className="city-info">
                  <span>{c.nome}</span>
                  <span>{c.melhorEpoca?.split(/[,;]/)[0]}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="cidade-cta">
          <h3>Quer pescar {especie.nome}?</h3>
          <p>Encontre guias, lojas e barcos especializados nas cidades onde essa espécie é encontrada.</p>
          <a href="/parceiros" className="cta-primary" style={{ display: 'inline-block' }}>
            Ver parceiros
          </a>
        </div>

      </div>
    </>
  )
}
