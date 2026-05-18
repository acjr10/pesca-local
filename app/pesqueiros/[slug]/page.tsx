import pesqueirosData from '@/data/pesqueiros.json'
import cidadesData from '@/data/cidades.json'
import parceirosData from '@/data/parceiros.json'
import peixesData from '@/data/peixes-pesqueiro.json'
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

const ANTES_DE_IR = [
  'Confirme horário de funcionamento',
  'Verifique se precisa reservar',
  'Consulte valores de entrada, pesque e solte ou consumo',
  'Confirme se há venda de isca no local',
  'Confira as regras do pesqueiro antes da pescaria',
]

const PORTE_ORDER = ['pequeno', 'pequeno a médio', 'médio', 'médio a grande', 'grande']
const PORTE_LEVE  = ['pequeno', 'pequeno a médio']
const PORTE_GRANDE = ['médio a grande', 'grande']

function isPesqueiroDestaque(pesqueiro: any) {
  return pesqueiro.plano === 'destaque'
}

function difClass(dif: string): string {
  const n = dif.toLowerCase()
  if (n.includes('avançado')) return 'badge-dif-avancado'
  if (n.includes('intermediário')) return 'badge-dif-intermediario'
  return 'badge-dif-iniciante'
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  const local = digits.startsWith('55') ? digits.slice(2) : digits
  const ddd = local.slice(0, 2)
  const num = local.slice(2)
  if (num.length === 9) return `(${ddd}) ${num.slice(0, 5)}-${num.slice(5)}`
  if (num.length === 8) return `(${ddd}) ${num.slice(0, 4)}-${num.slice(4)}`
  return local
}

export default async function PesqueiroPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = (pesqueirosData as any[]).find(x => x.id === slug)
  if (!p) return <div style={{ padding: 40 }}>Pesqueiro não encontrado.</div>

  const destaque = isPesqueiroDestaque(p)
  const cidade = (cidadesData as any[]).find(c => c.id === p.cidade)

  // Cruzamento com peixes-pesqueiro.json
  const peixesMapeados = (peixesData as any[]).filter(peixe =>
    (p.peixes as string[]).some((nome: string) => normalizeNome(nome) === peixe.id)
  )
  const temPeixesMapeados = peixesMapeados.length > 0

  const iscasUnificadas = temPeixesMapeados
    ? ([...new Set(peixesMapeados.flatMap((px: any) => px.iscas as string[]))] as string[])
    : []

  const peixesLeves  = peixesMapeados.filter((px: any) => PORTE_LEVE.includes(px.porte))
  const peixesGrandes = peixesMapeados.filter((px: any) => PORTE_GRANDE.includes(px.porte))
  const isMix = peixesLeves.length > 0 && peixesGrandes.length > 0

  const temReceitasParaEstePesqueiro = (receitasData as any[]).some(r =>
    peixesMapeados.some((px: any) => (r.indicadaPara as string[]).includes(px.id))
  )

  const peixeRefEquip = isMix
    ? null
    : [...peixesMapeados].sort(
        (a: any, b: any) => PORTE_ORDER.indexOf(b.porte) - PORTE_ORDER.indexOf(a.porte)
      )[0] ?? null

  // Parceiros lojas de pesca
  const lojasPesca = (parceirosData as any[])
    .filter(par => par.ativo && par.categoria === 'Loja de pesca')
    .sort((a: any, b: any) => {
      const aCity = a.cidade === p.cidade ? 0 : 1
      const bCity = b.cidade === p.cidade ? 0 : 1
      if (aCity !== bCity) return aCity - bCity
      return (a.plano === 'destaque' ? 0 : 1) - (b.plano === 'destaque' ? 0 : 1)
    })
    .slice(0, 3)

  return (
    <>
      <div className="cidade-hero">
        <div className="cidade-hero-content">
          <p className="cidade-region">🎣 Pesqueiro · {cidade?.nome ?? p.cidade}</p>
          <h1>{p.nome}</h1>
          <p className="cidade-desc">{p.descricao}</p>
          <div className="cidade-tipos">
            {((p.tiposPesca as string[]) ?? []).map((t: string) => (
              <span key={t} className="tipo-tag">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="inner-page">

        <div className="cidade-info-grid">
          <div className="info-card">
            <div className="info-icon">📍</div>
            <div className="info-label">Endereço</div>
            <div className="info-value">{p.endereco}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">🐟</div>
            <div className="info-label">Peixes disponíveis</div>
            <div className="info-value">{((p.peixes as string[]) ?? []).join(', ')}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">{p.pescaNoturna ? '🌙' : '☀️'}</div>
            <div className="info-label">Pesca noturna</div>
            <div className="info-value">{p.pescaNoturna ? 'Disponível' : 'Não disponível'}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">🏗️</div>
            <div className="info-label">Estrutura</div>
            <div className="info-value">{((p.estrutura as string[]) ?? []).length} itens de infraestrutura</div>
          </div>
        </div>

        {/* PEIXES DISPONÍVEIS */}
        <div className="cidade-section">
          <h2 className="section-title">🐟 Peixes disponíveis</h2>
          <div className="ponto-card">
            <div className="ponto-iscas">
              {((p.peixes as string[]) ?? []).map((peixe: string) => (
                <span key={peixe} className="tipo-tag">{peixe}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ESTRUTURA */}
        <div className="cidade-section">
          <h2 className="section-title">🏗️ Estrutura e comodidades</h2>
          <div className="ponto-card">
            <div className="pond-amenities" style={{ marginBottom: 0 }}>
              {((p.estrutura as string[]) ?? []).map((e: string) => (
                <span key={e}>{e}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ISCAS E EQUIPAMENTOS RECOMENDADOS */}
        <div className="cidade-section">
          <h2 className="section-title">🎣 Iscas e equipamentos recomendados</h2>
          {!temPeixesMapeados ? (
            <div className="ponto-card" style={{ color: '#64748b', fontSize: 14 }}>
              Recomendações de iscas e equipamentos ainda não disponíveis para este pesqueiro.
            </div>
          ) : (
            <>
              {/* 4.1 Iscas unificadas */}
              <div className="ponto-card" style={{ marginBottom: 16 }}>
                <div className="ponto-header">
                  <h3>Iscas recomendadas</h3>
                  <span className="ponto-tipo">Todas as espécies</span>
                </div>
                <div className="ponto-iscas">
                  {iscasUnificadas.map(isca => (
                    <span key={isca} className="tipo-tag">{isca}</span>
                  ))}
                </div>
              </div>

              {/* 4.2 Equipamento sugerido */}
              {isMix ? (
                <div className="equip-mix-box" style={{ marginBottom: 16 }}>
                  <div className="equip-mix-icon">🎒</div>
                  <p className="equip-mix-msg">
                    Leve uma montagem leve para{' '}
                    <strong>{peixesLeves.map((px: any) => px.nome).join(', ')}</strong>
                    {' '}e uma reforçada para{' '}
                    <strong>{peixesGrandes.map((px: any) => px.nome).join(', ')}</strong>.
                  </p>
                </div>
              ) : peixeRefEquip ? (
                <div className="peixe-equip-card" style={{ marginBottom: 16 }}>
                  <div className="ponto-header" style={{ marginBottom: 12 }}>
                    <h3>Equipamento sugerido</h3>
                    <span className="ponto-tipo">Base para {peixeRefEquip.nome}</span>
                  </div>
                  {Object.entries(peixeRefEquip.equipamento).map(([key, val]) => (
                    <div key={key} className="peixe-equip-row">
                      <span className="peixe-equip-label">{key}</span>
                      <span className="peixe-equip-val">{val as string}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* 4.3 Dicas por peixe */}
              <div className="peixe-dicas-grid">
                {peixesMapeados.map((peixe: any) => (
                  <div key={peixe.id} className="peixe-dica-card">
                    <div className="peixe-dica-header">
                      <a href={`/pesqueiros/peixes/${peixe.id}`} className="peixe-dica-nome">{peixe.nome}</a>
                      <div className="peixe-pp-meta">
                        <span className="badge-porte">{peixe.porte}</span>
                        <span className={difClass(peixe.dificuldade)}>{peixe.dificuldade}</span>
                      </div>
                    </div>
                    <div className="peixe-dica-iscas">
                      {(peixe.iscas as string[]).slice(0, 4).map((isca: string) => (
                        <span key={isca} className="tipo-tag">{isca}</span>
                      ))}
                    </div>
                    <p className="peixe-dica-texto">💡 {peixe.dica}</p>
                  </div>
                ))}
              </div>

              {/* ESCOPO 5 — CTA Massas */}
              {temReceitasParaEstePesqueiro && (
                <div className="massas-cta-inline">
                  <h4>Quer preparar suas iscas?</h4>
                  <p>Veja receitas de massas e iscas indicadas para os peixes deste pesqueiro.</p>
                  <a href="/pesqueiros/massas-e-iscas" className="pond-ver-detalhes" style={{ display: 'inline-block' }}>
                    Ver receitas de massas →
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        {/* ANTES DE IR */}
        <div className="cidade-section">
          <h2 className="section-title">✅ Antes de ir</h2>
          <div className="ponto-card">
            <ul className="antes-de-ir-lista">
              {ANTES_DE_IR.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* LOCALIZAÇÃO */}
        {cidade && (
          <div className="cidade-section">
            <h2 className="section-title">📍 Localização</h2>
            <a href={`/cidades/${cidade.id}`} className="city-list-card">
              <div className={`city-thumb city-${cidade.id}`}>
                <span className="city-name">{cidade.nome}</span>
              </div>
              <div className="city-list-info">
                <h2>{cidade.nome}</h2>
                <p>{cidade.resumoPesca ?? cidade.descricao}</p>
                <div className="city-list-stats">
                  <span>🏖️ {cidade.tiposPescaFortes?.length ?? 0} tipos de pesca</span>
                  <span>📍 {cidade.totalPontosLevantados ?? 0} pontos</span>
                </div>
                <div className="ver-btn">Ver guia da cidade →</div>
              </div>
            </a>
          </div>
        )}

        {/* CTA FINAL */}
        {destaque ? (
          <div className="cidade-cta">
            <h3>Fale com o pesqueiro</h3>
            <p>Entre em contato diretamente pelo WhatsApp para reservas e informações.</p>
            <a
              href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(`Olá ${p.nome}! Vi seu pesqueiro no Pesca Local (pescalocal.com.br) e tenho interesse. Pode me ajudar?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary"
              style={{ display: 'inline-block' }}
            >
              Falar no WhatsApp
            </a>
          </div>
        ) : (
          <div className="pesqueiro-info-basica">
            <h3>Informações do pesqueiro</h3>
            <p>Este pesqueiro está cadastrado com informações básicas no Pesca Local. Para contato direto, consulte os canais oficiais do estabelecimento.</p>
          </div>
        )}

        {/* VAI PESCAR NESTE PESQUEIRO? */}
        {lojasPesca.length > 0 && (
          <div className="cidade-section">
            <h2 className="section-title">🛒 Vai pescar neste pesqueiro?</h2>
            <p className="pesqueiro-parceiros-sub">Prepare suas iscas e materiais antes da pescaria.</p>
            <div className="pesqueiro-parceiros-grid">
              {lojasPesca.map((par: any) => {
                const parDestaque = par.plano === 'destaque'
                return (
                  <div key={par.id} className={`pesqueiro-parceiro-card${parDestaque ? ' pesqueiro-parceiro-destaque' : ''}`}>
                    <div className="pesqueiro-parceiro-top">
                      <div className="pesqueiro-parceiro-icon">🏪</div>
                      <div className="pesqueiro-parceiro-info">
                        <div className="pesqueiro-parceiro-nome">{par.nome}</div>
                        <div className="pesqueiro-parceiro-cidade">📍 {CIDADE_NOME[par.cidade] || par.cidade}</div>
                      </div>
                      {parDestaque && <span className="pond-badge-destaque">Destaque</span>}
                    </div>
                    <p className="pesqueiro-parceiro-desc">{par.descricao}</p>
                    {!parDestaque && par.whatsapp && (
                      <p style={{ fontSize: 13, color: '#334155', margin: '0 0 8px' }}>
                        Telefone: {formatPhone(par.whatsapp)}
                      </p>
                    )}
                    <div className="pesqueiro-parceiro-actions">
                      {parDestaque && par.whatsapp && (
                        <a
                          href={`https://wa.me/${par.whatsapp}?text=${encodeURIComponent(`Olá ${par.nome}! Vi sua loja no Pesca Local (pescalocal.com.br) e preciso de materiais para pescar. Pode me ajudar?`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="whatsapp-btn"
                          style={{ flex: 1, textAlign: 'center', display: 'block' }}
                        >
                          WhatsApp
                        </a>
                      )}
                      <a href={`/parceiros/${par.id}`} className="pesqueiro-parceiro-ver">Ver perfil →</a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── VÍDEOS ────────────────────────────────────────────────── */}
        <div className="cidade-section">
          <div className="videos-cta-inline">
            <div className="videos-cta-inline-text">
              <h3>Aprenda com pescarias reais</h3>
              <p>Veja vídeos de canais parceiros com dicas de iscas, equipamentos e pescarias.</p>
            </div>
            <a href="/videos" className="banner-btn">Ver vídeos</a>
          </div>
        </div>

      </div>
    </>
  )
}
