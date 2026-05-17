import type { Metadata } from 'next'
import cidadesData from '@/data/cidades.json'

export const metadata: Metadata = {
  title: 'Cidades para pescar na Baixada Santista | Pesca Local',
}

export default function CidadesPage() {
  return (
    <div className="page">
      <div className="inner-page">
        <div className="page-header">
          <h1>🗺️ Cidades da Baixada Santista</h1>
          <p>Explore o guia de pesca de cada cidade do litoral sul de São Paulo.</p>
        </div>
        <div className="cities-list-grid">
          {cidadesData.map((cidade: any) => (
            <a key={cidade.id} href={`/cidades/${cidade.id}`} className="city-list-card">
              <div
                className={`city-thumb city-${cidade.id}`}
                style={{ backgroundImage: `url('/cidades/${cidade.id}.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="city-thumb-overlay" />
                <span className="city-name">{cidade.nome}</span>
              </div>
              <div className="city-list-info">
                <h2>{cidade.nome}</h2>
                <p>{cidade.descricao}</p>
                <div className="city-list-tags">
                  {cidade.tiposPescaFortes?.map((t: string) => (
                    <span key={t} className="tipo-tag">{t}</span>
                  ))}
                </div>
                <div className="city-list-stats">
                  <span>🏖️ {cidade.tiposPescaFortes?.length ?? 0} tipos de pesca</span>
                  <span>📍 {cidade.totalPontosLevantados ?? 0} pontos</span>
                  <span>🗓️ Melhor época: {cidade.melhorEpoca}</span>
                </div>
                <div className="ver-btn">Ver guia da cidade →</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}