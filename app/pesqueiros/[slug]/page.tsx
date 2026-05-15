import pesqueirosData from '@/data/pesqueiros.json'
import cidadesData from '@/data/cidades.json'

export default async function PesqueiroPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = (pesqueirosData as any[]).find(x => x.id === slug)
  if (!p) return <div style={{ padding: 40 }}>Pesqueiro não encontrado.</div>

  const cidade = (cidadesData as any[]).find(c => c.id === p.cidade)

  return (
    <>
      {/* HERO */}
      <div className="cidade-hero">
        <div className="cidade-hero-content">
          <p className="cidade-region">🎣 Pesqueiro · {cidade?.nome ?? p.cidade}</p>
          <h1>{p.nome}</h1>
          <p className="cidade-desc">{p.descricao}</p>
          <div className="cidade-tipos">
            {(p.tiposPesca as string[]).map((t: string) => (
              <span key={t} className="tipo-tag">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="inner-page">

        {/* INFORMAÇÕES RÁPIDAS */}
        <div className="cidade-info-grid">
          <div className="info-card">
            <div className="info-icon">📍</div>
            <div className="info-label">Endereço</div>
            <div className="info-value">{p.endereco}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">🐟</div>
            <div className="info-label">Peixes disponíveis</div>
            <div className="info-value">{(p.peixes as string[]).join(', ')}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">{p.pescaNoturna ? '🌙' : '☀️'}</div>
            <div className="info-label">Pesca noturna</div>
            <div className="info-value">{p.pescaNoturna ? 'Disponível' : 'Não disponível'}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">🏗️</div>
            <div className="info-label">Estrutura</div>
            <div className="info-value">{(p.estrutura as string[]).length} itens de infraestrutura</div>
          </div>
        </div>

        {/* PEIXES DISPONÍVEIS */}
        <div className="cidade-section">
          <h2 className="section-title">🐟 Peixes disponíveis</h2>
          <div className="ponto-card">
            <div className="ponto-iscas">
              {(p.peixes as string[]).map((peixe: string) => (
                <span key={peixe} className="tipo-tag">{peixe}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ESTRUTURA */}
        <div className="cidade-section">
          <h2 className="section-title">🏗️ Estrutura e comodidades</h2>
          <div className="ponto-card">
            <div className="pond-amenities" style={{ marginBottom: 0 }}>
              {(p.estrutura as string[]).map((e: string) => (
                <span key={e}>{e}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ISCAS E MATERIAL */}
        <div className="cidade-section">
          <h2 className="section-title">🎣 Iscas e equipamentos</h2>
          <div className="pontos-grid">
            <div className="ponto-card">
              <div className="ponto-header">
                <h3>Iscas recomendadas</h3>
                <span className="ponto-tipo">Iscas</span>
              </div>
              <div className="ponto-iscas">
                {(p.iscasRecomendadas as string[]).map((i: string) => (
                  <span key={i} className="tipo-tag">{i}</span>
                ))}
              </div>
            </div>
            <div className="ponto-card">
              <div className="ponto-header">
                <h3>Material recomendado</h3>
                <span className="ponto-tipo" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                  Equipamento
                </span>
              </div>
              <div className="ponto-iscas">
                {(p.materialRecomendado as string[]).map((m: string) => (
                  <span key={m} className="tipo-tag">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CIDADE */}
        {cidade && (
          <div className="cidade-section">
            <h2 className="section-title">📍 Localização</h2>
            <a href={`/cidades/${cidade.id}`} className="city-list-card">
              <div className={`city-thumb city-${cidade.id}`}>
                <span className="city-name">{cidade.nome}</span>
              </div>
              <div className="city-list-info">
                <h2>{cidade.nome}</h2>
                <p>{cidade.descricao}</p>
                <div className="city-list-stats">
                  <span>🐟 {cidade.especies?.length} espécies</span>
                  <span>📍 {cidade.pontos?.length} pontos</span>
                </div>
                <div className="ver-btn">Ver guia da cidade →</div>
              </div>
            </a>
          </div>
        )}

        {/* CTA WHATSAPP */}
        <div className="cidade-cta">
          <h3>{p.whatsapp ? 'Fale com o pesqueiro' : 'Gostou desse pesqueiro?'}</h3>
          <p>
            {p.whatsapp
              ? 'Entre em contato diretamente pelo WhatsApp para reservas e informações.'
              : 'Compartilhe com amigos e planeje sua próxima pescaria na Baixada Santista.'}
          </p>
          {p.whatsapp ? (
            <a
              href={`https://wa.me/${p.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary"
              style={{ display: 'inline-block' }}
            >
              Falar no WhatsApp
            </a>
          ) : (
            <a href="/pesqueiros" className="cta-primary" style={{ display: 'inline-block' }}>
              Ver outros pesqueiros
            </a>
          )}
        </div>

      </div>
    </>
  )
}
