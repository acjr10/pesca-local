import cidadesData from '@/data/cidades.json'
import pontosData from '@/data/pontos-de-pesca.json'
import parceirosData from '@/data/parceiros.json'
import pesqueirosData from '@/data/pesqueiros.json'

export default async function CidadePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cidade = (cidadesData as any[]).find(c => c.id === slug)
  if (!cidade) return <div style={{padding:40}}>Cidade não encontrada.</div>

  const pontos = (pontosData as any[]).filter(p => p.cidade === slug)
  const parceiros = (parceirosData as any[]).filter(p => p.cidade === slug)
  const pesqueiros = (pesqueirosData as any[]).filter(p => p.cidade === slug)

  return (
    <>
      <div className={`cidade-hero city-${cidade.id}`}>
        <div className="cidade-hero-content">
          <p className="cidade-region">{cidade.regiao} · {cidade.estado}</p>
          <h1>{cidade.nome}</h1>
          <p className="cidade-desc">{cidade.descricao}</p>
          <div className="cidade-tipos">
            {cidade.tiposPesca.map((t: string) => <span key={t} className="tipo-tag">{t}</span>)}
          </div>
        </div>
      </div>

      <div className="inner-page">

        {/* INFO RÁPIDA */}
        <div className="cidade-info-grid">
          <div className="info-card">
            <div className="info-icon">🗓️</div>
            <div className="info-label">Melhor época</div>
            <div className="info-value">{cidade.melhorEpoca}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">⏰</div>
            <div className="info-label">Melhor horário</div>
            <div className="info-value">{cidade.melhorHorario}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">🎣</div>
            <div className="info-label">Iscas recomendadas</div>
            <div className="info-value">{cidade.iscasRecomendadas?.join(', ')}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">⚠️</div>
            <div className="info-label">Observações</div>
            <div className="info-value">{cidade.observacoes}</div>
          </div>
        </div>

        {/* PONTOS DE PESCA */}
        {pontos.length > 0 && (
          <div className="cidade-section">
            <h2 className="section-title">📍 Pontos de pesca</h2>
            <div className="pontos-grid">
              {pontos.map((p: any) => (
                <div key={p.id} className="ponto-card">
                  <div className="ponto-header">
                    <h3>{p.nome}</h3>
                    <span className="ponto-tipo">{p.tipo}</span>
                  </div>
                  <p>{p.descricao}</p>
                  <div className="ponto-meta">
                    <span>⏰ {p.melhorHorario}</span>
                    <span>🌊 {p.mareFavoravel}</span>
                    <span>📊 {p.nivelDificuldade}</span>
                  </div>
                  <div className="ponto-iscas">
                    {p.iscasRecomendadas?.map((i: string) => <span key={i} className="tipo-tag">{i}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PARCEIROS */}
        {parceiros.length > 0 && (
          <div className="cidade-section">
            <h2 className="section-title">🏪 Parceiros em {cidade.nome}</h2>
            <div className="partners-grid">
              {parceiros.map((p: any) => (
                <article key={p.id} className={`partner-card ${p.plano === 'destaque' ? 'featured' : ''}`}>
                  {p.plano === 'destaque' && <span className="tag-featured">Destaque</span>}
                  <div className="partner-logo alt">
                    {p.categoria === 'Loja de pesca' ? '🎣' : p.categoria === 'Guia de pesca' ? '⛵' : '⚓'}
                  </div>
                  <h3>{p.nome}</h3>
                  <div className="partner-meta">{p.categoria} · {p.cidade}</div>
                  {p.estrelas && <div className="stars">★ {p.estrelas} ({p.avaliacoes})</div>}
                  <p style={{fontSize:13,color:'#334155',margin:'8px 0'}}>{p.descricao}</p>
                  {p.whatsapp && (
                    <a href={`https://wa.me/${p.whatsapp}`} target="_blank" rel="noopener noreferrer"
                       className="whatsapp-btn" style={{display:'block',textAlign:'center'}}>
                      Falar no WhatsApp
                    </a>
                  )}
                  <a href={`/parceiros/${p.id}`} className="ver-btn" style={{display:'block',marginTop:8}}>Ver perfil →</a>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* PESQUEIROS */}
        {pesqueiros.length > 0 && (
          <div className="cidade-section">
            <h2 className="section-title">🎣 Pesqueiros em {cidade.nome}</h2>
            <div className="ponds-grid">
              {pesqueiros.map((p: any) => (
                <article key={p.id} className="pond-card">
                  <h3>{p.nome}</h3>
                  <span className="pond-city">{p.cidade}, SP</span>
                  <div className="pond-fish">🐟 {p.peixes?.join(', ')}</div>
                  <div className="pond-amenities">
                    {p.estrutura?.map((e: string) => <span key={e}>{e}</span>)}
                  </div>
                  {p.whatsapp && (
                    <a href={`https://wa.me/${p.whatsapp}`} target="_blank" rel="noopener noreferrer"
                       className="whatsapp-btn" style={{display:'block',textAlign:'center',marginTop:12}}>
                      Falar no WhatsApp
                    </a>
                  )}
                  <a href={`/pesqueiros/${p.id}`} className="ver-btn" style={{display:'block',marginTop:8}}>Ver detalhes →</a>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="cidade-cta">
          <h3>Tem um negócio em {cidade.nome}?</h3>
          <p>Apareça para pescadores que estão procurando na sua cidade.</p>
          <a href="/anuncie" className="cta-primary" style={{display:'inline-block'}}>Quero anunciar</a>
        </div>

      </div>
    </>
  )
}
