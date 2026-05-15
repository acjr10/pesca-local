import parceirosData from '@/data/parceiros.json'
import cidadesData from '@/data/cidades.json'

const CATEGORIA_EMOJI: Record<string, string> = {
  'Loja de pesca': '🎣',
  'Guia de pesca': '⛵',
  'Marina': '⚓',
  'Náutica': '🛥️',
}

function cidadeNome(id: string) {
  return (cidadesData as any[]).find(c => c.id === id)?.nome ?? id
}

export default function ParceirosPage() {
  const ativos = (parceirosData as any[]).filter(p => p.ativo)
  const destaques = ativos.filter(p => p.plano === 'destaque')
  const demais = ativos.filter(p => p.plano !== 'destaque')

  function ParceiroCard({ p }: { p: any }) {
    return (
      <article className={`partner-card ${p.plano === 'destaque' ? 'featured' : ''}`}>
        {p.plano === 'destaque' && <span className="tag-featured">Em Destaque</span>}

        <div className="partner-logo alt">
          {CATEGORIA_EMOJI[p.categoria] ?? '🎣'}
        </div>

        <h3>{p.nome}</h3>
        <div className="partner-meta">{p.categoria} · {cidadeNome(p.cidade)}</div>

        {p.estrelas && (
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
            href={`https://wa.me/${p.whatsapp}`}
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

  return (
    <div className="page">
      <div className="inner-page">
        <div className="page-header">
          <h1>🤝 Parceiros</h1>
          <p>Lojas, guias, marinas e serviços especializados na Baixada Santista e litoral sul de São Paulo.</p>
        </div>

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
