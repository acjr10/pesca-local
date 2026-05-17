import receitasData from '@/data/receitas-pesqueiro.json'
import peixesData from '@/data/peixes-pesqueiro.json'

const PEIXE_NOME: Record<string, string> = Object.fromEntries(
  (peixesData as any[]).map((p: any) => [p.id, p.nome])
)

function ReceitaCard({ receita, destaque = false }: { receita: any; destaque?: boolean }) {
  return (
    <div className={destaque ? 'receita-destaque-card' : 'receita-card'}>
      {destaque && <span className="receita-destaque-badge">Receita em destaque</span>}

      <div className="receita-card-header">
        <h2 className="receita-nome">{receita.nome}</h2>
        <span className="receita-tipo-chip">{receita.tipo}</span>
      </div>

      <div className="receita-secao">
        <div className="receita-secao-label">🐟 Indicada para</div>
        <div className="receita-peixes-chips">
          {(receita.indicadaPara as string[]).map((id: string) => (
            <a key={id} href={`/pesqueiros/peixes/${id}`} className="receita-peixe-chip">
              {PEIXE_NOME[id] || id}
            </a>
          ))}
        </div>
      </div>

      <div className="receita-secao">
        <div className="receita-secao-label">🧂 Ingredientes</div>
        <ul className="receita-lista">
          {(receita.ingredientes as string[]).map((ing: string) => (
            <li key={ing}>{ing}</li>
          ))}
        </ul>
      </div>

      <div className="receita-secao">
        <div className="receita-secao-label">👨‍🍳 Preparo</div>
        <ol className="receita-lista">
          {(receita.preparo as string[]).map((passo: string, i: number) => (
            <li key={i}>{passo}</li>
          ))}
        </ol>
      </div>

      <div className="receita-secao">
        <div className="receita-secao-label">🎣 Modo de uso</div>
        <p className="receita-texto">{receita.modoDeUso}</p>
      </div>

      {receita.observacao && (
        <div className="receita-obs">💬 {receita.observacao}</div>
      )}
    </div>
  )
}

export default function MassasEIscasPage() {
  const receitas = receitasData as any[]
  const destaqueReceita = receitas.find(r => r.destaque)
  const demais = receitas.filter(r => !r.destaque)

  return (
    <div className="page">
      <div className="inner-page">
        <div className="page-header">
          <h1>🪱 Massas e iscas para pesqueiro</h1>
          <p>Receitas simples e dicas práticas para preparar sua pescaria.</p>
        </div>

        {destaqueReceita && (
          <ReceitaCard receita={destaqueReceita} destaque={true} />
        )}

        <div className="receitas-grid">
          {demais.map((receita: any) => (
            <ReceitaCard key={receita.id} receita={receita} />
          ))}
        </div>
      </div>
    </div>
  )
}
