'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import pesqueirosData from '@/data/pesqueiros.json'
import cidadesData from '@/data/cidades.json'
import ConditionsWidget from './components/ConditionsWidget'

const formatCityName = (slug: string): string =>
  ({'praia-grande':'Praia Grande','sao-vicente':'São Vicente','santos':'Santos','mongagua':'Mongaguá','itanhaem':'Itanhaém','peruibe':'Peruíbe'} as Record<string,string>)[slug] || slug

const CITY_SLUGS: Record<string, string> = {
  'Praia Grande': 'praia-grande',
  'São Vicente': 'sao-vicente',
  'Santos': 'santos',
  'Mongaguá': 'mongagua',
  'Itanhaém': 'itanhaem',
  'Peruíbe': 'peruibe',
}

const SPECIES_SLUGS: Record<string, string> = {
  'Robalo': 'robalo', 'Pescada': 'pescada', 'Corvina': 'corvina',
  'Bagre': 'bagre', 'Espada': 'espada', 'Parati': 'parati',
  'Tainha': 'tainha', 'Carapicu': 'carapicu', 'Betara': 'betara',
  'Linguado': 'linguado',
}


export default function Home() {
  const pesqueiros = (pesqueirosData as any[]).slice(0, 3)
  const router = useRouter()

  const [cidade, setCidade] = useState('')
  const [especie, setEspecie] = useState('')
  const [tipo, setTipo] = useState('')

  function handleSearch() {
    const cidadeSlug = cidade ? CITY_SLUGS[cidade] : ''
    const especieSlug = especie ? SPECIES_SLUGS[especie] : ''

    if (cidadeSlug && !especieSlug && !tipo) {
      router.push(`/cidades/${cidadeSlug}`)
      return
    }

    const params = new URLSearchParams()
    if (cidadeSlug) params.set('cidade', cidadeSlug)
    if (especieSlug) params.set('especie', especieSlug)
    if (tipo) params.set('tipo', tipo)

    if (params.toString()) {
      router.push(`/busca?${params}`)
    } else {
      router.push('/cidades')
    }
  }

  return (
    <>
      {/* HERO */}
      <section className="hero">
<div className="hero-content">
          <p className="hero-tag">🎣 Guia regional de pesca</p>
          <h1>Descubra onde pescar,<br />o que usar e <span className="hero-highlight">quando ir</span></h1>
          <p className="hero-sub">Encontre espécies, melhores pontos, marés, lua, clima, lojas, guias, barcos e pesqueiros na Baixada Santista e litoral sul de São Paulo.</p>

          <div className="search-box">
            <div className="search-field">
              <label>Cidade</label>
              <select value={cidade} onChange={e => setCidade(e.target.value)}>
                <option value="">Todas as cidades</option>
                <option>Praia Grande</option>
                <option>São Vicente</option>
                <option>Santos</option>
                <option>Mongaguá</option>
                <option>Itanhaém</option>
                <option>Peruíbe</option>
              </select>
            </div>
            <div className="search-field">
              <label>Espécie</label>
              <select value={especie} onChange={e => setEspecie(e.target.value)}>
                <option value="">Qualquer espécie</option>
                <option>Robalo</option>
                <option>Pescada</option>
                <option>Corvina</option>
                <option>Tainha</option>
                <option>Linguado</option>
              </select>
            </div>
            <div className="search-field">
              <label>Tipo de pesca</label>
              <select value={tipo} onChange={e => setTipo(e.target.value)}>
                <option value="">Qualquer tipo</option>
                <option>Praia</option>
                <option>Canal</option>
                <option>Costão</option>
                <option>Deck/Píer</option>
                <option>Embarcada</option>
                <option>Pesqueiro</option>
              </select>
            </div>
            <button className="search-btn" onClick={handleSearch}>🔍 Buscar</button>
          </div>

        </div>
      </section>

      {/* CIDADES + CONDIÇÕES */}
      <div className="two-col-section">
        <section className="cities-section">
          <div className="section-header">
            <h2 className="section-title">🗺️ Explore por cidade</h2>
            <a href="/cidades" className="section-link">Ver todas →</a>
          </div>
          <div className="cities-grid">
            {(cidadesData as any[]).slice(0, 6).map((c: any) => (
              <a key={c.id} href={`/cidades/${c.id}`} className="city-card">
                <div
                  className={`city-thumb city-${c.id}`}
                  style={{ backgroundImage: `url('/cidades/${c.id}.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <div className="city-thumb-overlay" />
                  <span className="city-name">{c.nome}</span>
                </div>
                <div className="city-card-body">
                  <div className="city-chips">
                    {((c.tiposPescaFortes as string[]) || []).slice(0, 3).map((t: string) => (
                      <span key={t} className="city-chip">{t}</span>
                    ))}
                  </div>
                  <div className="city-stats-row">
                    <span className="city-stats">
                      {(c.tiposPescaFortes as string[])?.length ?? 0} tipos · {c.totalPontosLevantados ?? 0} pontos
                    </span>
                    <span className="city-guide-link">Ver guia →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <ConditionsWidget showCitySelect={true} />
      </div>

      {/* ESPÉCIES */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">🐟 Espécies em destaque</h2>
          <a href="/especies" className="section-link">Ver todas as espécies →</a>
        </div>
        <div className="species-grid">
          {[
            {nome:'Robalo',slug:'robalo',epoca:'Mar a Nov',isca:'Camarão vivo'},
            {nome:'Pescada',slug:'pescada',epoca:'Mai a Set',isca:'Sardinha'},
            {nome:'Corvina',slug:'corvina',epoca:'Out a Mar',isca:'Camarão'},
            {nome:'Bagre',slug:'bagre',epoca:'Ano todo',isca:'Minhoca'},
            {nome:'Tainha',slug:'tainha',epoca:'Mai a Jul',isca:'Corrupto'},
          ].map(e => (
            <a key={e.nome} href={`/especies/${e.slug}`} className="species-card">
              <div className="fish-art">
                <Image src={`/especies/${e.slug}.png`} alt={`Ilustração de ${e.nome}`} fill style={{objectFit:'contain',objectPosition:'center'}} />
              </div>
              <h3>{e.nome}</h3>
              <div className="species-meta"><strong>Melhor época</strong>{e.epoca}</div>
              <div className="species-meta"><strong>Isca</strong>{e.isca}</div>
              <span className="small-btn">Ver guia da espécie</span>
            </a>
          ))}
        </div>
      </section>

      {/* PARCEIROS */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">🏪 Parceiros da região</h2>
          <a href="/parceiros" className="section-link">Ver todos os parceiros →</a>
        </div>
        <div className="partners-grid">
          <article className="partner-card featured">
            <span className="tag-featured">Destaque</span>
            <div className="partner-logo">DEDÉ<br/>BIG FISH</div>
            <h3>Dedé Big Fish</h3>
            <div className="partner-meta">Loja de pesca · Praia Grande, SP</div>
            <div className="stars">★ 4,7 (128)</div>
            <a href={`https://wa.me/551334936979?text=${encodeURIComponent('Olá Dedé Big Fish! Vi seu negócio no Pesca Local (pescalocal.com.br) e tenho interesse. Pode me ajudar?')}`} target="_blank" rel="noopener noreferrer" className="whatsapp-btn" style={{display:'block',textAlign:'center'}}>Falar no WhatsApp</a>
            <a href="/parceiros/dede-big-fish" className="ver-btn" style={{display:'block',marginTop:8}}>Ver perfil →</a>
          </article>
          <article className="partner-card">
            <div className="partner-logo alt">⛵</div>
            <h3>Guia de Pesca Santos</h3>
            <div className="partner-meta">Guia de pesca · Santos, SP</div>
            <div className="stars">★ 4,9 (86)</div>
            <a href={`https://wa.me/551397790227?text=${encodeURIComponent('Olá Guia de Pesca Santos! Vi seu negócio no Pesca Local (pescalocal.com.br) e tenho interesse. Pode me ajudar?')}`} target="_blank" rel="noopener noreferrer" className="whatsapp-btn" style={{display:'block',textAlign:'center'}}>Falar no WhatsApp</a>
            <a href="/parceiros/guia-de-pesca-santos" className="ver-btn" style={{display:'block',marginTop:8}}>Ver perfil →</a>
          </article>
          <article className="partner-card">
            <div className="partner-logo alt">🎣</div>
            <h3>São Bento Pesca & Cia</h3>
            <div className="partner-meta">Loja de pesca · Santos, SP</div>
            <div className="stars">★ 4,8 (75)</div>
            <a href="https://www.instagram.com/saobentopescaecia/" target="_blank" rel="noopener noreferrer" className="small-btn" style={{display:'block',textAlign:'center',marginTop:0}}>📸 Ver no Instagram</a>
            <a href="/parceiros/sao-bento-pesca-e-cia" className="ver-btn" style={{display:'block',marginTop:8}}>Ver perfil →</a>
          </article>
        </div>
      </section>

      {/* PESQUEIROS */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">🎣 Pesqueiros próximos</h2>
          <a href="/pesqueiros" className="section-link">Ver todos os pesqueiros →</a>
        </div>
        <div className="ponds-grid">
          {pesqueiros.map((p: any) => (
            <article key={p.id} className="pond-card">
              <h3>{p.nome}</h3>
              <span className="pond-city">📍 {formatCityName(p.cidade)}, SP</span>
              <div className="pond-fish">🐟 {(p.peixes as string[]).slice(0, 4).join(', ')}</div>
              <div className="pond-amenities">{(p.estrutura as string[]).slice(0, 3).map((e: string) => <span key={e}>{e}</span>)}</div>
              <a href={`/pesqueiros/${p.id}`} className="small-btn" style={{display:'block',textAlign:'center'}}>Ver pesqueiro</a>
            </article>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="how-section">
        <h2 className="section-title">⚓ Como funciona</h2>
        <div className="steps">
          {[
            {n:'1',titulo:'Escolha a cidade',desc:'Selecione a cidade que você quer pescar.',icon:'🗺️'},
            {n:'2',titulo:'Veja espécies e pontos',desc:'Descubra as melhores espécies e pontos da região.',icon:'🐟'},
            {n:'3',titulo:'Consulte clima, ondas e planejamento',desc:'Confira dados de clima, vento, ondas e janelas recomendadas para planejar melhor sua pescaria.',icon:'🌤️'},
            {n:'4',titulo:'Encontre lojas, guias e pesqueiros',desc:'Tudo que você precisa para pescar com sucesso.',icon:'🏪'},
          ].map(s => (
            <div key={s.n} className="step">
              <div className="step-num">{s.n}</div>
              <div><h3>{s.titulo}</h3><p>{s.desc}</p></div>
              <div className="step-icon">{s.icon}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-text">
          <h2>Tem uma loja, marina, guia ou pesqueiro?</h2>
          <p>Apareça para pescadores da sua região no momento em que eles estão planejando a próxima pescaria.</p>
        </div>
        <div className="cta-benefits">
          <div className="benefit">📣<span>Mais visibilidade<br/>para seu negócio</span></div>
          <div className="benefit">💰<span>Gere mais leads<br/>e vendas</span></div>
          <div className="benefit">⭐<span>Destaque-se da<br/>concorrência</span></div>
        </div>
        <div className="cta-buttons">
          <a href="/anuncie" className="cta-primary">Quero anunciar</a>
          <a href="/anuncie" className="cta-secondary">Cadastrar meu negócio</a>
        </div>
      </section>
    </>
  )
}
