import type { Metadata } from 'next'
import especiesData from '@/data/especies.json'

function difClass(nivel: string): string {
  const n = nivel.toLowerCase()
  if (n.includes('avançado')) return 'badge-dif-avancado'
  if (n.includes('intermediário')) return 'badge-dif-intermediario'
  return 'badge-dif-iniciante'
}

export const metadata: Metadata = {
  title: 'Espécies de Pesca na Baixada Santista | Pesca Local',
}

export default function EspeciesPage() {
  return (
    <div className="page">
      <div className="inner-page">
        <div className="page-header">
          <h1>🐟 Espécies para pescar</h1>
          <p>Conheça as principais espécies encontradas na Baixada Santista e litoral sul de São Paulo.</p>
        </div>
        <div className="cities-list-grid">
          {(especiesData as any[]).map((especie) => (
            <a key={especie.id} href={`/especies/${especie.id}`} className="city-list-card">
              <div className="city-thumb" style={{ background: 'linear-gradient(135deg, #e8f6fb 0%, #f0fffe 100%)', padding: 0, overflow: 'hidden', borderRadius: '16px 0 0 16px' }}>
                <img src={`/especies/${especie.id}.png`} alt={`Ilustração de ${especie.nome}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div className="city-list-info">
                <div className="especie-card-header">
                  <h2>{especie.nome}</h2>
                  <span className={difClass(especie.nivelDificuldade)}>{especie.nivelDificuldade}</span>
                </div>
                <p style={{ fontSize: 13, color: '#64748b', fontStyle: 'italic', marginBottom: 0 }}>
                  {especie.nomeCientifico}
                </p>
                <div className="city-list-tags">
                  {((especie.ambiente as string[]) ?? []).slice(0, 4).map((a) => (
                    <span key={a} className="tipo-tag">{a}</span>
                  ))}
                </div>
                <div className="city-list-stats">
                  <span>🗓️ {especie.melhorEpoca}</span>
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
