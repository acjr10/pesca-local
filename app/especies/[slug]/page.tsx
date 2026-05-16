import type { Metadata } from 'next'
import Image from 'next/image'
import especiesData from '@/data/especies.json'
import parceirosData from '@/data/parceiros.json'

const DIFICULDADE_COR: Record<string, string> = {
  'Iniciante':                 '#14c8c2',
  'Iniciante a intermediário': '#f59e0b',
  'Intermediário':             '#f59e0b',
  'Intermediário a avançado':  '#ef4444',
  'Avançado':                  '#ef4444',
}

const DIFICULDADE_TEXTO: Record<string, string> = {
  'Iniciante':                 '#031526',
  'Iniciante a intermediário': '#1a0f00',
  'Intermediário':             '#1a0f00',
  'Intermediário a avançado':  '#fff',
  'Avançado':                  '#fff',
}

const EQUIP_LABEL: Record<string, string> = {
  vara: 'Vara', molinete: 'Molinete', linha: 'Linha', leader: 'Líder', anzol: 'Anzol / Jig',
}

const CATEGORIA_EMOJI: Record<string, string> = {
  'Loja de pesca': '🎣', 'Guia de pesca': '⛵', 'Marina': '⚓',
  'Náutica': '🛥️', 'Aluguel de barco': '🚤',
}

const CIDADE_NOME: Record<string, string> = {
  'praia-grande': 'Praia Grande', 'sao-vicente': 'São Vicente', 'santos': 'Santos',
  'mongagua': 'Mongaguá', 'itanhaem': 'Itanhaém', 'peruibe': 'Peruíbe',
}

const FALLBACK_CATEGORIAS: Record<string, string[]> = {
  robalo:   ['Guia de pesca', 'Loja de pesca'],
  pescada:  ['Guia de pesca', 'Loja de pesca'],
  corvina:  ['Loja de pesca', 'Guia de pesca'],
  bagre:    ['Loja de pesca'],
  espada:   ['Loja de pesca', 'Guia de pesca'],
  parati:   ['Loja de pesca'],
  tainha:   ['Guia de pesca', 'Loja de pesca'],
  carapicu: ['Loja de pesca'],
  betara:   ['Loja de pesca', 'Guia de pesca'],
  linguado: ['Guia de pesca', 'Loja de pesca', 'Aluguel de barco'],
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const especie = (especiesData as any[]).find(e => e.id === slug)
  if (!especie) return {}
  return {
    title: `Como pescar ${especie.nome} na Baixada Santista`,
    description: `Veja onde encontrar ${especie.nome}, melhores épocas, horários, iscas e materiais recomendados para pescar na Baixada Santista.`,
  }
}

export default async function EspeciePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const especie = (especiesData as any[]).find(e => e.id === slug)
  if (!especie) return <div style={{ padding: 40 }}>Espécie não encontrada.</div>

  const categoriasFiltro: string[] =
    especie?.parceirosRelacionados ?? FALLBACK_CATEGORIAS[especie.id] ?? ['Loja de pesca', 'Guia de pesca']

  const parceiros = (parceirosData as any[])
    .filter(p => p.ativo && categoriasFiltro.includes(p.categoria))
    .slice(0, 3)

  const difCor    = DIFICULDADE_COR[especie.nivelDificuldade as string]   ?? '#f59e0b'
  const difTexto  = DIFICULDADE_TEXTO[especie.nivelDificuldade as string] ?? '#1a0f00'
  const cidadesCtx: Record<string, string> = especie?.cidadesContexto ?? {}

  return (
    <>
      {/* ── 1. HERO ───────────────────────────────────────────────── */}
      <section className="especie-hero">
        <div className="especie-hero-img-wrap">
          <Image
            src={`/especies/${especie.id}.png`}
            alt={`Ilustração de ${especie.nome}`}
            fill
            priority
            style={{ objectFit: 'contain', objectPosition: 'center right' }}
          />
        </div>
        <div className="especie-hero-overlay" />
        <div className="especie-hero-content">
          <p className="cidade-region">🐟 Espécie</p>
          <h1>{especie.nome}</h1>
          <p className="cidade-desc" style={{ fontStyle: 'italic', marginBottom: 10 }}>
            {especie.nomeCientifico}
          </p>
          <div style={{ marginBottom: 10 }}>
            <span style={{ background: difCor, color: difTexto, borderRadius: 20, padding: '4px 16px', fontSize: 13, fontWeight: 700, display: 'inline-block' }}>
              {especie.nivelDificuldade}
            </span>
          </div>
          {especie?.nivelDificuldadeMotivo && (
            <p className="cidade-desc" style={{ fontSize: 13, opacity: 0.8, marginBottom: 14 }}>
              {especie.nivelDificuldadeMotivo}
            </p>
          )}
          <div className="cidade-tipos">
            {(especie.ambiente as string[]).map((a: string) => (
              <span key={a} className="tipo-tag">{a}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="inner-page">

        {/* ── 2. RESUMO RÁPIDO ──────────────────────────────────────── */}
        <div className="cidade-info-grid" style={{ marginBottom: 48 }}>
          <div className="info-card">
            <div className="info-icon">🗓️</div>
            <div className="info-label">Melhor época</div>
            <div className="info-value">{especie.melhorEpoca}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">⏰</div>
            <div className="info-label">Melhor horário</div>
            <div className="info-value">{especie.melhorHorario}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">🌊</div>
            <div className="info-label">Maré favorável</div>
            <div className="info-value">{especie.mareFavoravel}</div>
          </div>
          <div className="info-card">
            <div className="info-icon">📏</div>
            <div className="info-label">Tamanho comum</div>
            <div className="info-value" style={{ fontSize: 12 }}>{especie?.tamanhoComumRegiao}</div>
          </div>
        </div>

        {/* ── 3. ONDE ENCONTRAR ─────────────────────────────────────── */}
        {especie?.ondeEncontrar?.length > 0 && (
          <div className="cidade-section">
            <h2 className="section-title">📍 Onde encontrar</h2>
            <div className="onde-grid">
              {(especie.ondeEncontrar as string[]).map((local: string) => (
                <div key={local} className="onde-item">
                  <span className="onde-pin">📍</span>
                  <span>{local}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 4. COMO PESCAR ────────────────────────────────────────── */}
        {especie?.comoPescar && (
          <div className="cidade-section">
            <h2 className="section-title">🎣 Como pescar</h2>
            <div className="ponto-card">
              <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.75, margin: 0 }}>
                {especie.comoPescar}
              </p>
            </div>
            {especie?.dicaMestre && (
              <div className="dica-mestre">
                <span className="dica-mestre-icon">💡</span>
                <p className="dica-mestre-text">{especie.dicaMestre}</p>
              </div>
            )}
          </div>
        )}

        {/* ── 5. ISCAS POR SITUAÇÃO ─────────────────────────────────── */}
        {especie?.iscasPorSituacao && (
          <div className="cidade-section">
            <h2 className="section-title">🪝 Iscas por situação</h2>
            <div className="iscas-situacao-grid">
              <div className="iscas-col">
                <div className="iscas-col-titulo">💧 Água limpa</div>
                <ul>
                  {(especie.iscasPorSituacao?.aguaLimpa as string[] ?? []).map((i: string) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
              <div className="iscas-col">
                <div className="iscas-col-titulo">🌊 Água turva</div>
                <ul>
                  {(especie.iscasPorSituacao?.aguaTurva as string[] ?? []).map((i: string) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
              <div className="iscas-col">
                <div className="iscas-col-titulo">⏳ Pesca de espera</div>
                <ul>
                  {(especie.iscasPorSituacao?.pescaDeEspera as string[] ?? []).map((i: string) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            </div>
            {especie.iscasPorSituacao?.apresentacao && (
              <p className="iscas-apresentacao">
                {especie.iscasPorSituacao.apresentacao}
              </p>
            )}
          </div>
        )}

        {/* ── 6. SETUP POR MARÉ ─────────────────────────────────────── */}
        {especie?.setupPorMare && (
          <div className="cidade-section">
            <h2 className="section-title">🌊 Setup por maré</h2>
            <div className="especie-mare-grid">
              <div className="mare-card">
                <div className="mare-card-titulo">🌊 Maré correndo</div>
                <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: 0 }}>
                  {especie.setupPorMare.mareaCorrente}
                </p>
              </div>
              <div className="mare-card">
                <div className="mare-card-titulo">🧘 Maré parada</div>
                <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: 0 }}>
                  {especie.setupPorMare.mareaParada}
                </p>
              </div>
            </div>
            {especie.setupPorMare?.melhorMomento && (
              <div className="melhor-momento-box">
                <span className="melhor-momento-label">⏱️ Melhor momento</span>
                <p className="melhor-momento-text">{especie.setupPorMare.melhorMomento}</p>
              </div>
            )}
            {especie?.impactoVento && (
              <div className="vento-card">
                <span className="vento-icon">💨</span>
                <div>
                  <div className="vento-label">Impacto do vento</div>
                  <p className="vento-text">{especie.impactoVento}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 7. EQUIPAMENTO ────────────────────────────────────────── */}
        {(especie?.equipamentoBasico || especie?.equipamentoIdeal) && (
          <div className="cidade-section">
            <h2 className="section-title">🧰 Equipamento</h2>
            <div className="equip-grid">
              {especie?.equipamentoBasico && (
                <div className="equip-card">
                  <div className="equip-card-header">⚙️ Equipamento básico</div>
                  {Object.entries(especie.equipamentoBasico as Record<string, string>).map(([k, v]) => (
                    <div key={k} className="equip-row">
                      <span className="equip-key">{EQUIP_LABEL[k] ?? k}</span>
                      <span className="equip-val">{v}</span>
                    </div>
                  ))}
                </div>
              )}
              {especie?.equipamentoIdeal && (
                <div className="equip-card">
                  <div className="equip-card-header ideal">⭐ Equipamento ideal</div>
                  {Object.entries(especie.equipamentoIdeal as Record<string, string>).map(([k, v]) => (
                    <div key={k} className="equip-row">
                      <span className="equip-key">{EQUIP_LABEL[k] ?? k}</span>
                      <span className="equip-val">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 8. DICAS RÁPIDAS ──────────────────────────────────────── */}
        {especie?.dicasRapidas?.length > 0 && (
          <div className="cidade-section">
            <h2 className="section-title">⚡ Dicas rápidas</h2>
            <ul className="dicas-list">
              {(especie.dicasRapidas as string[]).map((d: string) => (
                <li key={d} className="dica-list-item">
                  <span className="dica-check">✓</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── 9. ERROS COMUNS ───────────────────────────────────────── */}
        {especie?.errosComuns?.length > 0 && (
          <div className="cidade-section">
            <h2 className="section-title">⚠️ Erros comuns</h2>
            <div className="erros-list">
              {(especie.errosComuns as string[]).map((err: string) => (
                <div key={err} className="erro-item">
                  <span className="erro-icon">⚠️</span>
                  <span>{err}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 10. DEFESO E REGULAMENTAÇÃO ───────────────────────────── */}
        {especie?.defeso && (
          <div className="cidade-section">
            <h2 className="section-title">📋 Defeso e regulamentação</h2>
            <div className="defeso-card">
              <div className="defeso-periodo">📅 {especie.defeso?.periodo}</div>
              <div className="defeso-obs">{especie.defeso?.observacao}</div>
              {especie?.tamanhoMinimo && (
                <div className="defeso-minimo">📏 {especie.tamanhoMinimo}</div>
              )}
            </div>
          </div>
        )}

        {/* ── 11. ONDE ENCONTRAR NA REGIÃO ──────────────────────────── */}
        {Object.keys(cidadesCtx).length > 0 && (
          <div className="cidade-section">
            <h2 className="section-title">🗺️ Onde encontrar na região</h2>
            <div className="cidades-contexto-grid">
              {Object.entries(cidadesCtx).map(([cidadeSlug, contexto]) => (
                <a key={cidadeSlug} href={`/cidades/${cidadeSlug}`} className="cidade-contexto-card">
                  <div className={`cidade-contexto-thumb city-${cidadeSlug}`}>
                    <div className="city-thumb-overlay" />
                    <span className="cidade-contexto-nome">
                      {CIDADE_NOME[cidadeSlug] ?? cidadeSlug}
                    </span>
                  </div>
                  <div className="cidade-contexto-body">
                    <p className="cidade-contexto-text">{contexto}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── 12. PARCEIROS RELACIONADOS ────────────────────────────── */}
        {parceiros.length > 0 && (
          <div className="cidade-section">
            <div className="section-header">
              <h2 className="section-title">🤝 Parceiros para essa pescaria</h2>
              <a href="/parceiros" className="section-link">Ver todos →</a>
            </div>
            <div className="parceiros-relacionados-grid">
              {parceiros.map((p: any) => (
                <article key={p.id} className={`partner-card${p.plano === 'destaque' ? ' featured' : ''}`}>
                  {p.plano === 'destaque' && <span className="tag-featured">Em Destaque</span>}
                  <div className="partner-logo alt">
                    {CATEGORIA_EMOJI[p.categoria] ?? '🎣'}
                  </div>
                  <h3>{p.nome}</h3>
                  <div className="partner-meta">
                    {p.categoria} · {CIDADE_NOME[p.cidade] ?? p.cidade}
                  </div>
                  {p.estrelas > 0 && (
                    <div className="stars">
                      {'★'.repeat(Math.round(p.estrelas))}{'☆'.repeat(5 - Math.round(p.estrelas))}
                      {' '}{p.estrelas}
                    </div>
                  )}
                  <p style={{ fontSize: 13, color: '#334155', margin: '0 0 12px', lineHeight: 1.5 }}>
                    {p.descricao}
                  </p>
                  {p.whatsapp && (
                    <a
                      href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(`Olá ${p.nome}! Vi seu negócio no Pesca Local (pescalocal.com.br) e tenho interesse. Pode me ajudar?`)}`}
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
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  )
}
