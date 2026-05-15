import especiesData from '@/data/especies.json'

const GRADIENTS = [
  'linear-gradient(135deg, #0e6898, #14c8c2)',
  'linear-gradient(135deg, #107880, #0d9ea0)',
  'linear-gradient(135deg, #124e8a, #1070a8)',
  'linear-gradient(135deg, #106844, #1aac7a)',
  'linear-gradient(135deg, #0e7860, #0fa898)',
  'linear-gradient(135deg, #0a5478, #0e9b70)',
  'linear-gradient(135deg, #0a3459, #0b638f)',
  'linear-gradient(135deg, #0e4f74, #0e96c5)',
  'linear-gradient(135deg, #0b638f, #14c8c2)',
  'linear-gradient(135deg, #0e6898, #0fbfa3)',
]

export default function EspeciesPage() {
  return (
    <div className="page">
      <div className="inner-page">
        <div className="page-header">
          <h1>🐟 Espécies para pescar</h1>
          <p>Conheça as principais espécies encontradas na Baixada Santista e litoral sul de São Paulo.</p>
        </div>
        <div className="cities-list-grid">
          {(especiesData as any[]).map((especie, i) => (
            <a key={especie.id} href={`/especies/${especie.id}`} className="city-list-card">
              <div className="city-thumb" style={{ background: GRADIENTS[i % GRADIENTS.length] }}>
                <span style={{ fontSize: 28, marginRight: 8 }}>🐟</span>
                <span className="city-name">{especie.nome}</span>
              </div>
              <div className="city-list-info">
                <h2>{especie.nome}</h2>
                <p style={{ fontSize: 13, color: '#64748b', fontStyle: 'italic', marginBottom: 0 }}>
                  {especie.nomeCientifico}
                </p>
                <div className="city-list-tags">
                  {(especie.ambiente as string[]).slice(0, 4).map((a) => (
                    <span key={a} className="tipo-tag">{a}</span>
                  ))}
                </div>
                <div className="city-list-stats">
                  <span>🗓️ {especie.melhorEpoca}</span>
                  <span>📊 {especie.nivelDificuldade}</span>
                </div>
                <div className="ver-btn">Ver detalhes →</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
