import peixesData from '@/data/peixes-pesqueiro.json'
import pesqueirosData from '@/data/pesqueiros.json'
import receitasData from '@/data/receitas-pesqueiro.json'
import { normalizeNome } from '@/lib/normalize'

const CIDADE_NOME: Record<string, string> = {
  'praia-grande': 'Praia Grande',
  'sao-vicente':  'São Vicente',
  'santos':       'Santos',
  'mongagua':     'Mongaguá',
  'itanhaem':     'Itanhaém',
  'peruibe':      'Peruíbe',
}

function difClass(dif: string): string {
  if (dif === 'iniciante') return 'badge-verde'
  if (dif === 'iniciante a intermediário') return 'badge-laranja'
  if (dif === 'intermediário') return 'badge-amarelo'
  if (dif === 'intermediário a avançado') return 'badge-laranja'
  return 'badge-vermelho'
}

export default async function PeixePesqueiroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const peixe = (peixesData as any[]).find(p => p.id === id)

  if (!peixe) {
    return (
      <div className="inner-page" style={{ textAlign: 'center', paddingTop: 80 }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🐟</div>
        <h2 style={{ fontWeight: 800, marginBottom: 8 }}>Peixe não encontrado</h2>
        <p style={{ color: '#64748b', marginBottom: 24 }}>Este peixe não está mapeado no guia de pesqueiros.</p>
        <a href="/pesqueiros/peixes" className="pond-ver-detalhes" style={{ display: 'inline-block' }}>
          ← Ver todos os peixes
        </a>
      </div>
    )
  }

  const pesqueirosComEsse = (pesqueirosData as any[]).filter(p =>
    (p.peixes as string[]).some((nome: string) => normalizeNome(nome) === peixe.id)
  )

  const todasReceitas = (receitasData as any[]).filter(r =>
    (r.indicadaPara as string[]).includes(peixe.id)
  )
  const receitasRelacionadas = todasReceitas.slice(0, 3)
  const temMaisReceitas = todasReceitas.length > 3

  return (
    <>
      <div className="peixe-pp-hero">
        <div className="inner-page peixe-pp-hero-inner">
          <p className="cidade-region">🎣 Peixe de pesqueiro</p>
          <h1>{peixe.nome}</h1>
          <div className="peixe-pp-meta">
            <span className="badge-porte">Porte: {peixe.porte}</span>
            <span className={`badge-dif ${difClass(peixe.dificuldade)}`}>Dificuldade: {peixe.dificuldade}</span>
          </div>
        </div>
      </div>

      <div className="inner-page">

        <div className="cidade-section">
          <h2 className="section-title">🪱 Iscas recomendadas</h2>
          <div className="ponto-card">
            <div className="ponto-iscas">
              {(peixe.iscas as string[]).map((isca: string) => (
                <span key={isca} className="tipo-tag">{isca}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="cidade-section">
          <h2 className="section-title">🎣 Equipamento recomendado</h2>
          <div className="peixe-equip-card">
            {Object.entries(peixe.equipamento).map(([key, val]) => (
              <div key={key} className="peixe-equip-row">
                <span className="peixe-equip-label">{key}</span>
                <span className="peixe-equip-val">{val as string}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cidade-section">
          <h2 className="section-title">💡 Dica prática</h2>
          <div className="peixe-dica-box">{peixe.dica}</div>
        </div>

        {/* RECEITAS RELACIONADAS — ESCOPO 4 */}
        <div className="cidade-section">
          <h2 className="section-title">🪱 Massas e iscas indicadas</h2>
          <p className="pesqueiro-parceiros-sub">Receitas que costumam funcionar bem para {peixe.nome}.</p>
          {receitasRelacionadas.length === 0 ? (
            <div className="ponto-card" style={{ color: '#64748b', fontSize: 14 }}>
              Ainda não temos receitas específicas para este peixe.
            </div>
          ) : (
            <>
              <div className="receitas-mini-grid">
                {receitasRelacionadas.map((r: any) => (
                  <div key={r.id} className="receita-mini-card">
                    <div className="receita-mini-header">
                      <div className="receita-mini-nome">{r.nome}</div>
                      <span className="receita-mini-tipo">{r.tipo}</span>
                    </div>
                    <div className="receita-mini-ings">
                      {(r.ingredientes as string[]).slice(0, 3).join(' · ')}
                      {(r.ingredientes as string[]).length > 3 && ' · ...'}
                    </div>
                    <a href="/pesqueiros/massas-e-iscas" className="receita-mini-link">
                      Ver receita completa →
                    </a>
                  </div>
                ))}
              </div>
              {temMaisReceitas && (
                <div style={{ marginTop: 16 }}>
                  <a href="/pesqueiros/massas-e-iscas" className="pond-ver-detalhes" style={{ display: 'inline-block' }}>
                    Ver todas as receitas →
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        {pesqueirosComEsse.length > 0 && (
          <div className="cidade-section">
            <h2 className="section-title">🎣 Pesqueiros com {peixe.nome}</h2>
            <div className="ponds-grid">
              {pesqueirosComEsse.map((p: any) => (
                <a key={p.id} href={`/pesqueiros/${p.id}`} className="peixe-pesqueiro-ref-card">
                  <div className="peixe-pesqueiro-ref-nome">{p.nome}</div>
                  <div className="peixe-pesqueiro-ref-cidade">📍 {CIDADE_NOME[p.cidade] || p.cidade}, SP</div>
                  <span className="ver-btn">Ver pesqueiro →</span>
                </a>
              ))}
            </div>
            <div style={{ marginTop: 20 }}>
              <a href="/pesqueiros" className="pond-ver-detalhes" style={{ display: 'inline-block' }}>
                Ver todos os pesqueiros →
              </a>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 32 }}>
          <a href="/pesqueiros/peixes" className="pond-ver-detalhes" style={{ display: 'inline-block' }}>
            ← Voltar para peixes de pesqueiro
          </a>
        </div>

      </div>
    </>
  )
}
