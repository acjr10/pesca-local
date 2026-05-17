import peixesData from '@/data/peixes-pesqueiro.json'

function difClass(dif: string): string {
  const n = dif.toLowerCase()
  if (n.includes('avançado')) return 'badge-dif-avancado'
  if (n.includes('intermediário')) return 'badge-dif-intermediario'
  return 'badge-dif-iniciante'
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

        {/* CTA MASSAS — ESCOPO 3 */}
        <div className="massas-cta-block">
          <div className="massas-cta-text">
            <h3>🪱 Massas e iscas para pesqueiro</h3>
            <p>Veja receitas práticas como beijinho, massa de ração, ração na pinga e massas doces para peixes redondos.</p>
          </div>
          <a href="/pesqueiros/massas-e-iscas" className="banner-btn">Ver receitas de massas →</a>
        </div>

        <div className="peixes-pp-grid">
          {peixes.map(peixe => (
            <div key={peixe.id} className="peixe-pp-card pond-card-flex">
              <div className="pond-card-top">
                <div className="peixe-pp-header-row">
                  <div className="peixe-pp-nome">{peixe.nome}</div>
                  <span className={difClass(peixe.dificuldade)}>{peixe.dificuldade}</span>
                </div>
                <div className="peixe-pp-porte-row">
                  <span className="badge-porte">{peixe.porte}</span>
                </div>
                <div className="peixe-pp-iscas-row">
                  {(peixe.iscas as string[]).slice(0, 3).map((isca: string) => (
                    <span key={isca} className="tipo-tag">{isca}</span>
                  ))}
                  {(peixe.iscas as string[]).length > 3 && (
                    <span className="peixe-pp-mais">+{(peixe.iscas as string[]).length - 3}</span>
                  )}
                </div>
              </div>
              <div className="pond-card-actions">
                <a href={`/pesqueiros/peixes/${peixe.id}`} className="pond-ver-detalhes">Ver dicas →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
