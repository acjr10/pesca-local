import peixesData from '@/data/peixes-pesqueiro.json'

function difClass(dif: string): string {
  if (dif === 'iniciante') return 'badge-verde'
  if (dif === 'iniciante a intermediário') return 'badge-laranja'
  if (dif === 'intermediário') return 'badge-amarelo'
  if (dif === 'intermediário a avançado') return 'badge-laranja'
  return 'badge-vermelho'
}

export default function PeixesPesqueiroPage() {
  const peixes = peixesData as any[]

  return (
    <div className="page">
      <div className="inner-page">
        <div className="page-header">
          <h1>🐟 Peixes comuns em pesqueiros</h1>
          <p>Veja iscas, equipamentos e dicas para os peixes mais encontrados em pesqueiros.</p>
        </div>

        <div className="peixes-pp-grid">
          {peixes.map(peixe => (
            <div key={peixe.id} className="peixe-pp-card">
              <div className="peixe-pp-nome">{peixe.nome}</div>
              <div className="peixe-pp-meta">
                <span className="badge-porte">{peixe.porte}</span>
                <span className={`badge-dif ${difClass(peixe.dificuldade)}`}>{peixe.dificuldade}</span>
              </div>
              <div className="peixe-pp-iscas-row">
                {(peixe.iscas as string[]).slice(0, 3).map((isca: string) => (
                  <span key={isca} className="tipo-tag">{isca}</span>
                ))}
                {(peixe.iscas as string[]).length > 3 && (
                  <span className="peixe-pp-mais">+{(peixe.iscas as string[]).length - 3}</span>
                )}
              </div>
              <a href={`/pesqueiros/peixes/${peixe.id}`} className="pond-ver-detalhes" style={{ marginTop: 'auto' }}>
                Ver dicas →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
