'use client'

import { useState, FormEvent } from 'react'

const BENEFICIOS = [
  {
    icon: '🎯',
    titulo: 'Público certo, na hora certa',
    desc: 'Pescadores já procurando o que você oferece — lojas, guias, marinas e pesqueiros aparecem para quem está planejando pescar na sua cidade.',
  },
  {
    icon: '📱',
    titulo: 'Presença digital completa',
    desc: 'Página dedicada com WhatsApp, Instagram e site linkados. Pescadores entram em contato com um clique, sem precisar procurar em outro lugar.',
  },
  {
    icon: '📊',
    titulo: 'Visibilidade contínua',
    desc: 'Seu negócio aparece nas páginas de cidades, espécies e pesqueiros — em todos os pontos onde pescadores tomam decisão de compra.',
  },
  {
    icon: '🏅',
    titulo: 'Autoridade e credibilidade',
    desc: 'Parceiros com Destaque aparecem primeiro nas listagens e páginas de cidades, aumentando a visibilidade para quem está decidindo onde comprar ou contratar.',
  },
]

const PLANOS = [
  {
    id: 'gratuito',
    nome: 'Gratuito',
    destaque: false,
    preco: '0',
    periodo: '/mês',
    desc: 'Presença básica na base inicial do Pesca Local.',
    note: 'No plano Gratuito seus dados entram na nossa base, mas sem links de contato públicos na listagem.',
    features: [
      { ok: true,  texto: 'Perfil básico no guia' },
      { ok: true,  texto: 'Aparece nas buscas por cidade' },
      { ok: true,  texto: 'Informações de contato registradas internamente' },
      { ok: false, texto: 'Links de contato públicos (WhatsApp, Instagram, site)' },
      { ok: false, texto: 'Posição de destaque nas listagens' },
      { ok: false, texto: 'Badge "Em Destaque"' },
      { ok: false, texto: 'Aparece em múltiplas cidades' },
      { ok: false, texto: 'Suporte prioritário' },
    ],
    cta: 'Cadastrar gratuitamente',
    ctaStyle: 'outline' as const,
  },
  {
    id: 'destaque',
    nome: 'Destaque',
    destaque: true,
    preco: '49',
    periodo: '/mês',
    desc: 'Para negócios que querem aparecer para pescadores da região e gerar mais contatos.',
    promoNote: 'Valor promocional para os primeiros parceiros',
    features: [
      { ok: true, texto: 'Perfil completo no guia' },
      { ok: true, texto: 'Aparece nas buscas por cidade' },
      { ok: true, texto: 'Links de contato públicos (WhatsApp, Instagram, site)' },
      { ok: true, texto: 'Posição de destaque nas listagens' },
      { ok: true, texto: 'Maior visibilidade nas listagens e páginas relacionadas' },
      { ok: true, texto: 'Aparece em múltiplas cidades' },
      { ok: true, texto: 'Suporte prioritário' },
    ],
    cta: 'Quero o Destaque',
    ctaStyle: 'filled' as const,
  },
]

const FAQ = [
  {
    p: 'Qual a diferença entre o Gratuito e o Destaque?',
    r: 'No plano Gratuito seu negócio entra na nossa base de dados, mas sem links de contato públicos na listagem. No Destaque, seus links de WhatsApp, Instagram e site ficam visíveis para os pescadores, além de posição privilegiada nas buscas e páginas de cidades.',
  },
  {
    p: 'Meu WhatsApp fica visível para os pescadores no plano Gratuito?',
    r: 'Não. No plano Gratuito seus dados ficam registrados na base do Pesca Local, mas os links de contato ficam disponíveis apenas para parceiros no plano Destaque.',
  },
  {
    p: 'O preço do Destaque pode mudar?',
    r: 'O valor de R$ 49/mês é promocional para os primeiros parceiros. Quem assinar agora mantém essa condição enquanto o plano estiver ativo.',
  },
  {
    p: 'Que tipos de negócio podem anunciar?',
    r: 'Lojas de pesca, guias e barcos de pesca, marinas, pesqueiros, ranchos, pousadas, restaurantes e qualquer negócio voltado ao público pescador da Baixada Santista.',
  },
  {
    p: 'Posso cancelar o plano Destaque a qualquer momento?',
    r: 'Sim. O plano é mensal sem fidelidade. Você pode solicitar o cancelamento por WhatsApp e ele é efetivado no fim do período vigente.',
  },
  {
    p: 'Já tenho um perfil no plano Gratuito. Posso fazer upgrade?',
    r: 'Sim. Basta preencher o formulário escolhendo o plano Destaque e mencionar que já tem perfil cadastrado. Nossa equipe faz o upgrade sem você precisar reenviar todas as informações.',
  },
]

const CIDADES = ['Praia Grande', 'São Vicente', 'Santos', 'Mongaguá', 'Itanhaém', 'Peruíbe', 'Outra cidade']
const CATEGORIAS = ['Loja de pesca', 'Guia de pesca', 'Marina', 'Pesqueiro / Rancho', 'Náutica / Barcos', 'Pousada / Hospedagem', 'Restaurante', 'Outro']

type FormData = {
  nome: string
  negocio: string
  cidade: string
  whatsapp: string
  instagram: string
  cidadesAtendidas: string
  categoria: string
  plano: string
  observacoes: string
}

const FORM_VAZIO: FormData = {
  nome: '', negocio: '', cidade: '', whatsapp: '',
  instagram: '', cidadesAtendidas: '', categoria: '', plano: 'gratuito', observacoes: '',
}

export default function AnunciePage() {
  const [form, setForm] = useState<FormData>(FORM_VAZIO)
  const [enviado, setEnviado] = useState(false)
  const [carregando, setCarregando] = useState(false)

  function set(field: keyof FormData, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setCarregando(true)

    const linhas = [
      'Olá! Quero anunciar meu negócio no Pesca Local.',
      '',
      `Nome: ${form.nome}`,
      `Negócio: ${form.negocio}`,
      `Categoria: ${form.categoria}`,
      `Cidade: ${form.cidade}`,
      `WhatsApp: ${form.whatsapp}`,
      form.instagram       ? `Instagram: ${form.instagram}`                   : null,
      form.cidadesAtendidas ? `Cidades atendidas: ${form.cidadesAtendidas}`   : null,
      `Plano: ${form.plano === 'destaque' ? 'Destaque (R$ 49/mês)' : 'Gratuito'}`,
      form.observacoes     ? `Observações: ${form.observacoes}`               : null,
    ].filter(Boolean)

    const waUrl = `https://wa.me/5513996243365?text=${encodeURIComponent(linhas.join('\n'))}`

    window.open(waUrl, '_blank')  // must run inside the user-gesture tick — browsers block popups from setTimeout
    setTimeout(() => {
      setCarregando(false)
      setEnviado(true)
    }, 900)
  }

  function scrollToForm(plano: string) {
    set('plano', plano)
    document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* HERO */}
      <section className="anuncie-hero">
        <div className="anuncie-hero-content">
          <p className="hero-tag">📣 Seja um parceiro</p>
          <h1>Conecte seu negócio<br />a quem <span className="hero-highlight">pesca na região</span></h1>
          <p>Lojas, guias, marinas, pesqueiros e barcos — apareça para pescadores da sua região no momento em que estão planejando a próxima pescaria.</p>
          <p style={{ fontSize: 13, opacity: 0.75, marginTop: -8, marginBottom: 24 }}>
            🚀 Estamos em fase de lançamento — seja um dos primeiros parceiros a aparecer no guia.
          </p>
          <div className="anuncie-hero-btns">
            <button className="cta-primary" onClick={() => scrollToForm('destaque')}>
              Quero anunciar agora
            </button>
            <button
              className="cta-secondary"
              style={{ background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.22)' }}
              onClick={() => scrollToForm('gratuito')}
            >
              Cadastro gratuito
            </button>
          </div>
        </div>
      </section>

      {/* NÚMEROS */}
      <div className="numeros-bar">
        {[
          { val: '6',    label: 'Cidades cobertas' },
          { val: '10+',  label: 'Espécies mapeadas' },
          { val: '50+',  label: 'Pontos de pesca' },
          { val: 'R$ 0', label: 'Para começar' },
        ].map(n => (
          <div key={n.label} className="numero-item">
            <div className="numero-val">{n.val}</div>
            <div className="numero-label">{n.label}</div>
          </div>
        ))}
      </div>

      {/* BENEFÍCIOS */}
      <section className="how-section">
        <h2 className="section-title" style={{ color: '#fff', marginBottom: 36, justifyContent: 'center' }}>
          Por que anunciar no Pesca Local?
        </h2>
        <div className="steps">
          {BENEFICIOS.map(b => (
            <div key={b.titulo} className="step">
              <div className="step-icon">{b.icon}</div>
              <div>
                <h3>{b.titulo}</h3>
                <p>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PLANOS */}
      <section style={{ padding: '80px 52px', background: '#f8fafc', textAlign: 'center' }}>
        <p className="hero-tag" style={{ color: '#0b78aa', marginBottom: 12 }}>Planos disponíveis</p>
        <h2 className="section-title" style={{ justifyContent: 'center', marginBottom: 10, fontSize: 32 }}>
          Comece grátis. Cresça com o Destaque.
        </h2>
        <p style={{ fontSize: 16, color: '#64748b', marginBottom: 48, maxWidth: 480, margin: '0 auto 48px' }}>
          Sem contrato, sem taxa de adesão. Cancele quando quiser.
        </p>

        <div className="planos-grid">
          {PLANOS.map(plano => (
            <div key={plano.id} className={`plano-card${plano.destaque ? ' destaque' : ''}`}>
              <div className="plano-badge-wrap">
                {plano.destaque && <span className="tag-featured">Preço de lançamento</span>}
              </div>
              <div className="plano-nome">{plano.nome}</div>
              <div className="plano-preco">
                {plano.preco === '0' ? (
                  <>Grátis</>
                ) : (
                  <><sup>R$</sup>{plano.preco}<sub>/mês</sub></>
                )}
              </div>
              {'promoNote' in plano && plano.promoNote && (
                <p style={{ fontSize: 12, color: '#0b78aa', fontWeight: 600, marginBottom: 8, marginTop: -4 }}>
                  {plano.promoNote}
                </p>
              )}
              <p className="plano-desc">{plano.desc}</p>
              {'note' in plano && plano.note && (
                <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12, lineHeight: 1.5 }}>
                  {plano.note}
                </p>
              )}

              <ul className="plano-features">
                {plano.features.map(f => (
                  <li key={f.texto} className={`plano-feature${f.ok ? '' : ' off'}`}>
                    <span className="plano-check">{f.ok ? '✓' : '–'}</span>
                    {f.texto}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => scrollToForm(plano.id)}
                className={plano.ctaStyle === 'filled' ? 'form-submit' : 'small-btn'}
                style={plano.ctaStyle === 'outline' ? { marginTop: 0, width: '100%', padding: '13px 20px', fontSize: 14 } : {}}
              >
                {plano.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section id="formulario" style={{ padding: '80px 52px', background: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="hero-tag" style={{ color: '#0b78aa', marginBottom: 12 }}>Cadastro de parceiro</p>
          <h2 className="section-title" style={{ justifyContent: 'center', marginBottom: 10, fontSize: 32 }}>
            Quero anunciar meu negócio
          </h2>
          <p style={{ fontSize: 16, color: '#64748b', maxWidth: 480, margin: '0 auto' }}>
            Preencha o formulário e o Pesca Local entrará em contato pelo WhatsApp para validar as informações.
          </p>
        </div>

        <div className="form-card">
          {enviado ? (
            <div className="form-success">
              <span className="form-success-icon">🎣</span>
              <h3>Cadastro recebido!</h3>
              <p>
                Obrigado pelo interesse. O Pesca Local entrará em contato pelo WhatsApp informado para validar as informações e publicar seu perfil.
              </p>
              <a href="/parceiros" className="cta-primary" style={{ display: 'inline-block' }}>
                Ver parceiros cadastrados
              </a>
            </div>
          ) : (
            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="nome">Seu nome</label>
                  <input
                    id="nome" type="text" className="form-input" required
                    placeholder="Ex.: João Silva"
                    value={form.nome} onChange={e => set('nome', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="negocio">Nome do negócio</label>
                  <input
                    id="negocio" type="text" className="form-input" required
                    placeholder="Ex.: Loja do Pescador"
                    value={form.negocio} onChange={e => set('negocio', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="categoria">Categoria</label>
                  <select
                    id="categoria" className="form-select" required
                    value={form.categoria} onChange={e => set('categoria', e.target.value)}
                  >
                    <option value="">Selecione a categoria</option>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="cidade">Cidade</label>
                  <select
                    id="cidade" className="form-select" required
                    value={form.cidade} onChange={e => set('cidade', e.target.value)}
                  >
                    <option value="">Selecione a cidade</option>
                    {CIDADES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="whatsapp">WhatsApp</label>
                  <input
                    id="whatsapp" type="tel" className="form-input" required
                    placeholder="(13) 99999-9999"
                    value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="instagram">Instagram <span style={{ fontWeight: 400, color: '#94a3b8' }}>(opcional)</span></label>
                  <input
                    id="instagram" type="text" className="form-input"
                    placeholder="@seunegocio"
                    value={form.instagram} onChange={e => set('instagram', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="plano">Plano de interesse</label>
                  <select
                    id="plano" className="form-select"
                    value={form.plano} onChange={e => set('plano', e.target.value)}
                  >
                    <option value="gratuito">Gratuito — R$ 0/mês</option>
                    <option value="destaque">Destaque — R$ 49/mês</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="cidadesAtendidas">Cidades atendidas <span style={{ fontWeight: 400, color: '#94a3b8' }}>(opcional)</span></label>
                  <input
                    id="cidadesAtendidas" type="text" className="form-input"
                    placeholder="Ex.: Praia Grande, Santos"
                    value={form.cidadesAtendidas} onChange={e => set('cidadesAtendidas', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="observacoes">Observações <span style={{ fontWeight: 400, color: '#94a3b8' }}>(opcional)</span></label>
                <textarea
                  id="observacoes" className="form-input"
                  placeholder="Conte mais sobre seu negócio, horários de funcionamento, especialidades..."
                  rows={3}
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                  value={form.observacoes} onChange={e => set('observacoes', e.target.value)}
                />
              </div>

              {form.plano === 'gratuito' && (
                <p style={{ fontSize: 13, color: '#94a3b8', background: '#f8fafc', borderRadius: 8, padding: '10px 14px', lineHeight: 1.5, margin: '0 0 4px' }}>
                  ℹ️ No plano Gratuito seus dados entram na nossa base, mas sem links de contato públicos na listagem. Para aparecer com WhatsApp e Instagram visíveis, escolha o plano Destaque.
                </p>
              )}

              <button type="submit" className="form-submit" disabled={carregando}>
                {carregando ? 'Enviando…' : 'Enviar cadastro'}
              </button>

              <p className="form-note">
                Ao enviar, você será direcionado para o WhatsApp do Pesca Local com suas informações preenchidas. Sem spam — prometemos.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="how-section">
        <h2 className="section-title" style={{ color: '#fff', marginBottom: 36, justifyContent: 'center' }}>
          Perguntas frequentes
        </h2>
        <div className="steps">
          {FAQ.map(f => (
            <div key={f.p} className="step">
              <h3 style={{ fontSize: 14 }}>{f.p}</h3>
              <p>{f.r}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-section">
        <div className="cta-text">
          <h2>Pronto para mais clientes?</h2>
          <p>Junte-se aos parceiros do Pesca Local e apareça para quem pesca na sua cidade hoje mesmo.</p>
        </div>
        <div className="cta-benefits">
          <div className="benefit">🎯<span>Público<br />segmentado</span></div>
          <div className="benefit">📱<span>Contato<br />direto</span></div>
          <div className="benefit">🗺️<span>6 cidades<br />cobertas</span></div>
          <div className="benefit">🏅<span>Sem<br />fidelidade</span></div>
        </div>
        <div className="cta-buttons">
          <button className="cta-primary" onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}>
            Quero anunciar agora
          </button>
          <a href="/parceiros" className="cta-secondary">Ver parceiros cadastrados</a>
        </div>
      </section>
    </>
  )
}
