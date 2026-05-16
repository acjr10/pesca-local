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
    desc: 'Parceiros com Destaque aparecem primeiro, com selo verificado e avaliações, aumentando a confiança de quem ainda não te conhece.',
  },
]

const PLANOS = [
  {
    id: 'gratuito',
    nome: 'Gratuito',
    destaque: false,
    preco: '0',
    periodo: '/mês',
    desc: 'Ideal para começar e marcar presença no guia de pesca da região.',
    features: [
      { ok: true,  texto: 'Perfil básico no guia' },
      { ok: true,  texto: 'Informações de contato e endereço' },
      { ok: true,  texto: 'Aparece nas buscas por cidade' },
      { ok: true,  texto: 'Link para WhatsApp, Instagram ou site' },
      { ok: false, texto: 'Posição de destaque nas listagens' },
      { ok: false, texto: 'Selo "Em Destaque" verificado' },
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
    desc: 'Para negócios que querem se destacar e gerar mais clientes todo mês.',
    features: [
      { ok: true, texto: 'Perfil completo no guia' },
      { ok: true, texto: 'Informações de contato e endereço' },
      { ok: true, texto: 'Aparece nas buscas por cidade' },
      { ok: true, texto: 'Link para WhatsApp, Instagram ou site' },
      { ok: true, texto: 'Posição de destaque nas listagens' },
      { ok: true, texto: 'Selo "Em Destaque" verificado' },
      { ok: true, texto: 'Aparece em múltiplas cidades' },
      { ok: true, texto: 'Suporte prioritário' },
    ],
    cta: 'Quero o Destaque',
    ctaStyle: 'filled' as const,
  },
]

const FAQ = [
  {
    p: 'Como meu negócio aparece no guia?',
    r: 'Após o envio do formulário nossa equipe entra em contato pelo WhatsApp para confirmar as informações e publicar seu perfil. No plano Gratuito, a publicação ocorre em até 5 dias úteis. No Destaque, em até 24 horas.',
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
  categoria: string
  plano: string
}

const FORM_VAZIO: FormData = { nome: '', negocio: '', cidade: '', whatsapp: '', categoria: '', plano: 'gratuito' }

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
    setTimeout(() => { setCarregando(false); setEnviado(true) }, 900)
  }

  function scrollToForm(plano: string) {
    set('plano', plano)
    document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })
  }

  const WA_URL = 'https://wa.me/5513996243365?text=Ol%C3%A1%21+Tenho+interesse+em+anunciar+meu+neg%C3%B3cio+no+Pesca+Local.'

  return (
    <>
      {/* WHATSAPP CTA */}
      <div style={{ background: '#25d366', padding: '14px 24px', textAlign: 'center' }}>
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#fff', fontWeight: 800, fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}
        >
          <span style={{ fontSize: 20 }}>💬</span>
          Fale agora pelo WhatsApp →
        </a>
      </div>

      {/* HERO */}
      <section className="anuncie-hero">
        <div className="anuncie-hero-content">
          <p className="hero-tag">📣 Seja um parceiro</p>
          <h1>Conecte seu negócio<br />a quem <span className="hero-highlight">pesca na região</span></h1>
          <p>Lojas, guias, marinas, pesqueiros e barcos — apareça para milhares de pescadores da Baixada Santista que buscam exatamente o que você oferece.</p>
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
          { val: '6', label: 'Cidades cobertas' },
          { val: '10+', label: 'Espécies mapeadas' },
          { val: '100%', label: 'Público pescador' },
          { val: 'Grátis', label: 'Para começar' },
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
                {plano.destaque && <span className="tag-featured">Mais popular</span>}
              </div>
              <div className="plano-nome">{plano.nome}</div>
              <div className="plano-preco">
                {plano.preco === '0' ? (
                  <>Grátis</>
                ) : (
                  <><sup>R$</sup>{plano.preco}<sub>/mês</sub></>
                )}
              </div>
              <p className="plano-desc">{plano.desc}</p>

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
          <p style={{ fontSize: 16, color: '#64748b', maxWidth: 440, margin: '0 auto' }}>
            Preencha o formulário e nossa equipe entra em contato em até 24h.
          </p>
        </div>

        <div className="form-card">
          {enviado ? (
            <div className="form-success">
              <span className="form-success-icon">🎣</span>
              <h3>Cadastro recebido!</h3>
              <p>
                Obrigado pelo interesse. Nossa equipe vai entrar em contato pelo WhatsApp
                informado em até 24 horas para confirmar as informações e publicar seu perfil.
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
                  <label className="form-label" htmlFor="plano">Plano de interesse</label>
                  <select
                    id="plano" className="form-select"
                    value={form.plano} onChange={e => set('plano', e.target.value)}
                  >
                    <option value="gratuito">Gratuito — R$ 0/mês</option>
                    <option value="destaque">Destaque — R$ 49/mês</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="form-submit" disabled={carregando}>
                {carregando ? 'Enviando…' : 'Enviar cadastro'}
              </button>

              <p className="form-note">
                Ao enviar, você concorda em receber contato da equipe Pesca Local pelo WhatsApp informado.
                Sem spam — prometemos.
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
          <div className="benefit">🏅<span>Sem<br />fidelidade</span></div>
          <div className="benefit">⚡<span>Publicação<br />rápida</span></div>
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
