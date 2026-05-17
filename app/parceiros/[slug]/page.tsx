import parceirosData from '@/data/parceiros.json'
import cidadesData from '@/data/cidades.json'

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  const local = digits.startsWith('55') ? digits.slice(2) : digits
  const ddd = local.slice(0, 2)
  const num = local.slice(2)
  if (num.length === 9) return `(${ddd}) ${num.slice(0, 5)}-${num.slice(5)}`
  if (num.length === 8) return `(${ddd}) ${num.slice(0, 4)}-${num.slice(4)}`
  return local
}

const CATEGORIA_EMOJI: Record<string, string> = {
  'Loja de pesca': '🎣',
  'Guia de pesca': '⛵',
  'Marina': '⚓',
  'Náutica': '🛥️',
}

export default async function ParceiroPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = (parceirosData as any[]).find(x => x.id === slug)
  if (!p) return <div style={{ padding: 40 }}>Parceiro não encontrado.</div>

  const cidade = (cidadesData as any[]).find(c => c.id === p.cidade)
  const isDestaque = p.plano === 'destaque'
  const emoji = CATEGORIA_EMOJI[p.categoria] ?? '🎣'

  return (
    <>
      {/* HERO */}
      <div className="cidade-hero">
        <div className="cidade-hero-content">
          <p className="cidade-region">{emoji} {p.categoria} · {cidade?.nome ?? p.cidade}</p>
          {isDestaque && (
            <span className="tag-featured" style={{ marginBottom: 12, display: 'inline-block' }}>
              Em Destaque
            </span>
          )}
          <h1>{p.nome}</h1>
          <p className="cidade-desc">{p.descricao}</p>
        </div>
      </div>

      <div className="inner-page">

        {/* INFORMAÇÕES RÁPIDAS */}
        <div className="cidade-info-grid">
          <div className="info-card">
            <div className="info-icon">{emoji}</div>
            <div className="info-label">Categoria</div>
            <div className="info-value">{p.categoria}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">📍</div>
            <div className="info-label">Endereço</div>
            <div className="info-value">{p.endereco}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">⭐</div>
            <div className="info-label">Avaliação</div>
            <div className="info-value">
              {p.estrelas > 0 ? `${p.estrelas} ★ — ${p.avaliacoes} avaliações` : 'Sem avaliações'}
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">🏅</div>
            <div className="info-label">Plano</div>
            <div className="info-value">{isDestaque ? 'Parceiro em Destaque' : 'Parceiro Cadastrado'}</div>
          </div>
        </div>

        {/* AVALIAÇÃO */}
        {p.estrelas > 0 && (
          <div className="cidade-section">
            <h2 className="section-title">⭐ Avaliação dos pescadores</h2>
            <div className="ponto-card" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: '#031526', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {p.estrelas}
                </div>
                <div className="stars" style={{ marginBottom: 4 }}>
                  {'★'.repeat(Math.round(p.estrelas))}{'☆'.repeat(5 - Math.round(p.estrelas))}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{p.avaliacoes} avaliações</div>
              </div>
              <div style={{ flex: 1, borderLeft: '1px solid #dbe6ee', paddingLeft: 20 }}>
                <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.6 }}>
                  {isDestaque
                    ? 'Parceiro verificado e em destaque no Pesca Local. Avaliação consolidada com base em experiências de pescadores da região.'
                    : 'Avaliação consolidada com base em experiências de pescadores da Baixada Santista e litoral sul de São Paulo.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTATO */}
        <div className="cidade-section">
          <h2 className="section-title">📲 Entre em contato</h2>
          <div className="pontos-grid">
            <div className="ponto-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {isDestaque ? (
                  <>
                    {p.whatsapp && (
                      <a
                        href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(`Olá ${p.nome}! Vi seu negócio no Pesca Local (pescalocal.com.br) e tenho interesse. Pode me ajudar?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-btn"
                        style={{ display: 'block', textAlign: 'center' }}
                      >
                        Falar no WhatsApp
                      </a>
                    )}
                    {p.instagram && (
                      <a
                        href={p.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="small-btn"
                        style={{ display: 'block', textAlign: 'center' }}
                      >
                        📸 Ver no Instagram
                      </a>
                    )}
                    {p.site && (
                      <a
                        href={p.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="small-btn"
                        style={{ display: 'block', textAlign: 'center' }}
                      >
                        🌐 Acessar site
                      </a>
                    )}
                    {!p.whatsapp && !p.instagram && !p.site && (
                      <p style={{ fontSize: 14, color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>
                        Não há informações de contato disponíveis.
                      </p>
                    )}
                  </>
                ) : p.whatsapp ? (
                  <p style={{ fontSize: 14, color: '#334155', margin: 0 }}>
                    Telefone: {formatPhone(p.whatsapp)}
                  </p>
                ) : (
                  <p style={{ fontSize: 14, color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>
                    Não há informações de contato disponíveis.
                  </p>
                )}
              </div>
            </div>

              <div className="ponto-card">
                <div className="ponto-header">
                  <h3>Localização</h3>
                  <span className="ponto-tipo">📍 Endereço</span>
                </div>
                <p style={{ margin: 0 }}>{p.endereco}</p>
                {cidade && (
                  <a
                    href={`/cidades/${cidade.id}`}
                    className="ver-btn"
                    style={{ display: 'block', marginTop: 12 }}
                  >
                    Ver guia de {cidade.nome} →
                  </a>
                )}
              </div>
            </div>
          </div>

        {/* CTA */}
        <div className="cidade-cta">
          {isDestaque ? (
            <>
              <h3>Parceiro verificado e recomendado</h3>
              <p>Este parceiro tem plano Destaque no Pesca Local e é indicado pela nossa equipe para pescadores da região.</p>
              {p.whatsapp ? (
                <a
                  href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(`Olá ${p.nome}! Vi seu negócio no Pesca Local (pescalocal.com.br) e tenho interesse. Pode me ajudar?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-primary"
                  style={{ display: 'inline-block' }}
                >
                  Falar no WhatsApp
                </a>
              ) : (
                <a href="/parceiros" className="cta-primary" style={{ display: 'inline-block' }}>
                  Ver todos os parceiros
                </a>
              )}
            </>
          ) : (
            <>
              <h3>Seu negócio aparece aqui?</h3>
              <p>Anuncie no Pesca Local e apareça para pescadores que buscam serviços na sua cidade.</p>
              <a href="/parceiros" className="cta-primary" style={{ display: 'inline-block' }}>
                Quero anunciar
              </a>
            </>
          )}
        </div>

      </div>
    </>
  )
}
