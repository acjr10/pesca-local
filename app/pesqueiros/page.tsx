import pesqueirosData from '@/data/pesqueiros.json'
import cidadesData from '@/data/cidades.json'

function cidadeNome(id: string) {
  return (cidadesData as any[]).find(c => c.id === id)?.nome ?? id
}

export default function PesqueirosPage() {
  return (
    <div className="page">
      <div className="inner-page">
        <div className="page-header">
          <h1>🎣 Pesqueiros</h1>
          <p>Encontre pesqueiros e pontos de pesca estruturados na Baixada Santista e litoral sul de São Paulo.</p>
        </div>
        <div className="ponds-grid">
          {(pesqueirosData as any[]).map(p => (
            <div key={p.id} className="pond-card">
              <h3>{p.nome}</h3>
              <span className="pond-city">📍 {cidadeNome(p.cidade)}, SP</span>

              {p.pescaNoturna && (
                <div style={{ marginBottom: 10 }}>
                  <span className="ponto-tipo">🌙 Pesca noturna</span>
                </div>
              )}

              <div className="pond-fish">🐟 {(p.peixes as string[]).join(', ')}</div>

              <div className="pond-amenities">
                {(p.estrutura as string[]).map(e => <span key={e}>{e}</span>)}
              </div>

              <div className="cidade-tipos" style={{ marginBottom: 16 }}>
                {(p.tiposPesca as string[]).map(t => (
                  <span key={t} className="tipo-tag">{t}</span>
                ))}
              </div>

              {p.whatsapp && (
                <a
                  href={`https://wa.me/${p.whatsapp}`}
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
