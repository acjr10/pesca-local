'use client'

import { useState, useEffect, useRef } from 'react'

const CITY_COORDS: Record<string, { lat: number; lon: number; name: string }> = {
  'praia-grande': { lat: -24.0057, lon: -46.4022, name: 'Praia Grande' },
  'sao-vicente':  { lat: -23.9608, lon: -46.3922, name: 'São Vicente' },
  'santos':       { lat: -23.9608, lon: -46.3339, name: 'Santos' },
  'mongagua':     { lat: -24.0889, lon: -46.6269, name: 'Mongaguá' },
  'itanhaem':     { lat: -24.1833, lon: -46.7897, name: 'Itanhaém' },
  'peruibe':      { lat: -24.3189, lon: -47.0053, name: 'Peruíbe' },
}

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// ── WMO codes ────────────────────────────────────────────────────────────────
const WMO: Record<number, [string, string]> = {
  0: ['Céu limpo', '☀️'], 1: ['Principalmente limpo', '🌤️'], 2: ['Parcialmente nublado', '⛅'],
  3: ['Nublado', '☁️'], 45: ['Neblina', '🌫️'], 48: ['Neblina com geada', '🌫️'],
  51: ['Garoa leve', '🌦️'], 53: ['Garoa moderada', '🌦️'], 55: ['Garoa intensa', '🌧️'],
  61: ['Chuva leve', '🌧️'], 63: ['Chuva moderada', '🌧️'], 65: ['Chuva intensa', '🌧️'],
  71: ['Neve leve', '❄️'], 73: ['Neve moderada', '❄️'], 75: ['Neve intensa', '❄️'],
  80: ['Pancadas de chuva', '🌦️'], 81: ['Pancadas moderadas', '🌧️'], 82: ['Pancadas violentas', '⛈️'],
  95: ['Tempestade', '⛈️'], 96: ['Tempestade c/ granizo', '⛈️'], 99: ['Tempestade forte', '⛈️'],
}
function wmo(code: number): [string, string] { return WMO[code] ?? ['Variável', '🌥️'] }

// ── Helpers ──────────────────────────────────────────────────────────────────
function windDir(deg: number): string {
  return ['N','NNE','NE','ENE','L','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO'][Math.round(deg / 22.5) % 16]
}

function fmtTime(isoLocal: string): string {
  return isoLocal.split('T')[1]?.slice(0, 5) ?? ''
}

function dayLabel(dateStr: string): string {
  return DIAS[new Date(dateStr + 'T12:00:00').getDay()]
}

function moonFrac(date: Date): number {
  const JD = date.getTime() / 86400000 + 2440587.5
  const syn = 29.530588853
  let f = ((JD - 2451549.76) % syn) / syn
  return f < 0 ? f + 1 : f
}

function moonInfo(frac: number): { nome: string; emoji: string; illumination: number } {
  const illumination = Math.round((1 - Math.cos(frac * 2 * Math.PI)) / 2 * 100)
  if      (frac < 0.0625 || frac >= 0.9375) return { nome: 'Lua Nova',         emoji: '🌑', illumination }
  else if (frac < 0.1875)                    return { nome: 'Crescente',         emoji: '🌒', illumination }
  else if (frac < 0.3125)                    return { nome: 'Quarto Crescente',  emoji: '🌓', illumination }
  else if (frac < 0.4375)                    return { nome: 'Crescente Gibosa',  emoji: '🌔', illumination }
  else if (frac < 0.5625)                    return { nome: 'Lua Cheia',         emoji: '🌕', illumination }
  else if (frac < 0.6875)                    return { nome: 'Minguante Gibosa',  emoji: '🌖', illumination }
  else if (frac < 0.8125)                    return { nome: 'Quarto Minguante',  emoji: '🌗', illumination }
  else                                        return { nome: 'Minguante',         emoji: '🌘', illumination }
}

function fishingWindows(sunriseISO: string, sunsetISO: string): string[] {
  const mins = (iso: string) => { const [, t] = iso.split('T'); const [h, m] = t.split(':').map(Number); return h * 60 + m }
  const fmt  = (m: number)   => { const h = Math.floor(m / 60) % 24; const mm = m % 60; return `${String(h).padStart(2,'0')}:${String(mm).padStart(2,'0')}` }
  const sr = mins(sunriseISO), ss = mins(sunsetISO)
  return [`${fmt(sr)} – ${fmt(sr + 120)}`, `${fmt(ss - 120)} – ${fmt(ss)}`]
}

function calcIndice(precipProb: number, windSpeed: number, windGusts: number, waveH: number, lunaFrac: number): number {
  let s = 10
  if (precipProb > 60) s -= 2; else if (precipProb >= 30) s -= 1
  if (windSpeed > 30)  s -= 2; else if (windSpeed >= 20)  s -= 1
  if (windGusts > 40)  s -= 2; else if (windGusts >= 30)  s -= 1
  if (waveH > 1.5)     s -= 2; else if (waveH >= 1)       s -= 1
  const novaOuCheia = lunaFrac < 0.0625 || lunaFrac >= 0.9375 || (lunaFrac >= 0.4375 && lunaFrac < 0.5625)
  s += novaOuCheia ? 0.5 : 0.2
  return Math.min(10, Math.max(0, Math.round(s * 10) / 10))
}

function indexColor(n: number): string { return n >= 8 ? '#14c8c2' : n >= 5 ? '#f59e0b' : '#ef4444' }
function indexLabel(n: number): string { return n >= 8 ? 'Bom para planejar' : n >= 5 ? 'Atenção' : 'Ruim / Evitar' }

// ── API ──────────────────────────────────────────────────────────────────────
async function fetchWeather(lat: number, lon: number) {
  const q = new URLSearchParams({
    latitude: String(lat), longitude: String(lon),
    current: [
      'temperature_2m','apparent_temperature','relative_humidity_2m',
      'precipitation','weather_code','cloud_cover',
      'wind_speed_10m','wind_direction_10m','wind_gusts_10m',
    ].join(','),
    daily: [
      'weather_code','temperature_2m_max','temperature_2m_min',
      'precipitation_probability_max','sunrise','sunset',
      'wind_speed_10m_max','wind_gusts_10m_max','wind_direction_10m_dominant',
    ].join(','),
    timezone: 'America/Sao_Paulo',
    forecast_days: '5',
    wind_speed_unit: 'kmh',
  })
  const r = await fetch(`https://api.open-meteo.com/v1/forecast?${q}`)
  if (!r.ok) throw new Error('forecast')
  return r.json()
}

async function fetchMarine(lat: number, lon: number) {
  const q = new URLSearchParams({
    latitude: String(lat), longitude: String(lon),
    current: [
      'wave_height','wave_direction','wave_period',
      'swell_wave_height','swell_wave_direction','swell_wave_period',
    ].join(','),
    daily: 'wave_height_max,swell_wave_height_max',
    timezone: 'America/Sao_Paulo',
    forecast_days: '5',
  })
  const r = await fetch(`https://marine-api.open-meteo.com/v1/marine?${q}`)
  if (!r.ok) throw new Error('marine')
  return r.json()
}

// ── Sub-components ────────────────────────────────────────────────────────────
function CondCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="cond-card">
      <div className="cond-label">{label}</div>
      <div className="cond-value">{value}</div>
      {sub && <div className="cond-sub">{sub}</div>}
    </div>
  )
}

function CitySelector({ value, onChange }: { value: string; onChange: (slug: string) => void }) {
  return (
    <div className="previsao-city-selector">
      <select
        className="previsao-city-select"
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Selecionar cidade"
      >
        {Object.entries(CITY_COORDS).map(([slug, c]) => (
          <option key={slug} value={slug}>{c.name}</option>
        ))}
      </select>
    </div>
  )
}

function Skeleton({ citySlug, cityName, onCityChange }: {
  citySlug: string
  cityName: string
  onCityChange: (slug: string) => void
}) {
  const hoje = new Date()
  const dataStr = hoje.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <div className="page">
      <style>{`@keyframes sk{0%,100%{opacity:.35}50%{opacity:.65}}.sk{animation:sk 1.4s ease-in-out infinite;background:#f1f5f9;border-radius:14px}`}</style>
      <div className="inner-page">
        <div className="page-header">
          <h1>🌊 Previsão de pesca</h1>
          <CitySelector value={citySlug} onChange={onCityChange} />
          <p>Baixada Santista · {cityName} · {dataStr}</p>
          <p style={{ color: '#94a3b8', marginTop: 4, fontSize: 14 }}>Carregando dados meteorológicos em tempo real…</p>
        </div>
        <div className="sk" style={{ height: 180, marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
          {[...Array(6)].map((_, i) => <div key={i} className="sk" style={{ height: 90 }} />)}
        </div>
        <div className="sk" style={{ height: 140, marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
          {[...Array(5)].map((_, i) => <div key={i} className="sk" style={{ height: 200 }} />)}
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PrevisaoPage() {
  const [citySlug, setCitySlug] = useState('praia-grande')
  const [lat, setLat]           = useState(CITY_COORDS['praia-grande'].lat)
  const [lon, setLon]           = useState(CITY_COORDS['praia-grande'].lon)
  const [cityName, setCityName] = useState(CITY_COORDS['praia-grande'].name)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [weather, setWeather]   = useState<any>(null)
  const [marine, setMarine]     = useState<any>(null)
  const fetchId = useRef(0)

  useEffect(() => {
    const id = ++fetchId.current
    setLoading(true)
    setError(null)
    Promise.allSettled([fetchWeather(lat, lon), fetchMarine(lat, lon)]).then(([w, m]) => {
      if (id !== fetchId.current) return
      if (w.status === 'rejected') {
        setError('Não foi possível carregar os dados meteorológicos. Verifique sua conexão e tente novamente.')
      } else {
        setWeather(w.value)
        setMarine(m.status === 'fulfilled' ? m.value : null)
      }
      setLoading(false)
    })
  }, [lat, lon])

  function handleCityChange(slug: string) {
    const coords = CITY_COORDS[slug]
    if (!coords) return
    setCitySlug(slug)
    setLat(coords.lat)
    setLon(coords.lon)
    setCityName(coords.name)
  }

  if (loading) {
    return (
      <Skeleton
        citySlug={citySlug}
        cityName={cityName}
        onCityChange={handleCityChange}
      />
    )
  }

  if (error) {
    const hoje = new Date()
    const dataStr = hoje.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
    return (
      <div className="page">
        <div className="inner-page">
          <div className="page-header">
            <h1>🌊 Previsão de pesca</h1>
            <CitySelector value={citySlug} onChange={handleCityChange} />
            <p>Baixada Santista · {cityName} · {dataStr}</p>
          </div>
          <div className="ponto-card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>Erro ao carregar dados</h3>
            <p style={{ color: '#64748b', marginBottom: 24 }}>{error}</p>
            <button onClick={() => { setLoading(true); setError(null); const id = ++fetchId.current; Promise.allSettled([fetchWeather(lat, lon), fetchMarine(lat, lon)]).then(([w, m]) => { if (id !== fetchId.current) return; if (w.status === 'rejected') { setError('Não foi possível carregar os dados.') } else { setWeather(w.value); setMarine(m.status === 'fulfilled' ? m.value : null) } setLoading(false) }) }} className="cta-primary">
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Derived values ──────────────────────────────────────────────────────────
  const cur      = weather.current
  const daily    = weather.daily
  const waveCur  = marine?.current ?? null

  const precipProbHoje = (daily.precipitation_probability_max?.[0] ?? 0) as number
  const gustsHoje      = (cur.wind_gusts_10m ?? cur.wind_speed_10m * 1.5) as number
  const waveHoje       = (waveCur?.wave_height ?? 0) as number

  const hoje    = new Date()
  const luaFrac = moonFrac(hoje)
  const lua     = moonInfo(luaFrac)
  const novaOuCheia = luaFrac < 0.0625 || luaFrac >= 0.9375 || (luaFrac >= 0.4375 && luaFrac < 0.5625)

  const indice  = calcIndice(precipProbHoje, cur.wind_speed_10m, gustsHoje, waveHoje, luaFrac)
  const cor     = indexColor(indice)
  const janelas = fishingWindows(daily.sunrise[0], daily.sunset[0])

  const [ceuDesc, ceuEmoji] = wmo(cur.weather_code)
  const dataStr  = hoje.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
  const tagText  = cor === '#14c8c2' ? '#031526' : cor === '#f59e0b' ? '#1a0f00' : '#fff'

  return (
    <div className="page">
      <div className="inner-page">

        {/* ── CABEÇALHO ─────────────────────────────────────────────────────── */}
        <div className="page-header">
          <h1>🌊 Previsão de pesca</h1>
          <CitySelector value={citySlug} onChange={handleCityChange} />
          <p>Baixada Santista · {cityName} · {dataStr}</p>
        </div>

        {/* ── ÍNDICE ────────────────────────────────────────────────────────── */}
        <div className="previsao-index">
          <div className="previsao-index-left">
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>
                Índice experimental · hoje
              </div>
              <div className="previsao-score" style={{ color: cor }}>
                {indice.toFixed(1)}<sup>/10</sup>
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="index-tag" style={{ background: cor, color: tagText }}>
                  {indexLabel(indice)}
                </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
                  {ceuEmoji} {ceuDesc}
                </span>
              </div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: 28 }}>
              <div className="index-window-label">Janelas recomendadas</div>
              <div className="index-window-times">
                {janelas.map(j => <div key={j}>{j}</div>)}
              </div>
            </div>
          </div>
          <div className="previsao-index-right">
            <div className="index-window-label" style={{ marginBottom: 6 }}>Fase da lua</div>
            <div style={{ fontSize: 36, lineHeight: 1 }}>{lua.emoji}</div>
            <div style={{ fontSize: 13, color: '#fff', fontWeight: 700, marginTop: 6 }}>{lua.nome}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{lua.illumination}% iluminação</div>
          </div>
        </div>

        {/* ── CONDIÇÕES ATUAIS ──────────────────────────────────────────────── */}
        <div className="cidade-section">
          <div className="section-header">
            <h2 className="section-title">{ceuEmoji} Condições atuais</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <CondCard
              label="Temperatura"
              value={`${Math.round(cur.temperature_2m)} °C`}
              sub={`Sensação térmica ${Math.round(cur.apparent_temperature)} °C`}
            />
            <CondCard
              label="Umidade relativa"
              value={`${cur.relative_humidity_2m}%`}
              sub={`Cobertura de nuvens: ${cur.cloud_cover}%`}
            />
            <CondCard
              label="Probabilidade de chuva"
              value={`${precipProbHoje}%`}
              sub={`Precipitação atual: ${cur.precipitation ?? 0} mm`}
            />
            <CondCard
              label="Vento"
              value={`${Math.round(cur.wind_speed_10m)} km/h`}
              sub={`${windDir(cur.wind_direction_10m)} · Direção ${cur.wind_direction_10m}°`}
            />
            <CondCard
              label="Rajadas"
              value={`${Math.round(gustsHoje)} km/h`}
              sub={gustsHoje > 40 ? 'Atenção — rajadas fortes' : 'Dentro do esperado'}
            />
            <CondCard
              label="Nascer / Pôr do sol"
              value={`${fmtTime(daily.sunrise[0])} / ${fmtTime(daily.sunset[0])}`}
              sub="Horário de Brasília"
            />
          </div>
        </div>

        {/* ── ONDAS E SWELL ─────────────────────────────────────────────────── */}
        {waveCur ? (
          <div className="cidade-section">
            <div className="section-header">
              <h2 className="section-title">🌊 Ondas e swell</h2>
            </div>
            <div className="mare-grid">
              <div className="mare-card">
                <h3>🌊 Ondas</h3>
                <div className="mare-event">
                  <div>
                    <div className="mare-hora">{waveCur.wave_height.toFixed(1)} m</div>
                    <div className="mare-tipo">Altura</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mare-altura">{windDir(waveCur.wave_direction)}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Direção {waveCur.wave_direction}°</div>
                  </div>
                </div>
                <div className="mare-event" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#031526' }}>Período</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Intervalo entre ondas</div>
                  </div>
                  <div className="mare-altura">{waveCur.wave_period != null ? `${waveCur.wave_period.toFixed(1)} s` : '—'}</div>
                </div>
              </div>
              <div className="mare-card">
                <h3>↗️ Swell</h3>
                <div className="mare-event">
                  <div>
                    <div className="mare-hora">{waveCur.swell_wave_height.toFixed(1)} m</div>
                    <div className="mare-tipo">Altura do swell</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mare-altura">{windDir(waveCur.swell_wave_direction)}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Direção {waveCur.swell_wave_direction}°</div>
                  </div>
                </div>
                <div className="mare-event" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#031526' }}>Período do swell</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Intervalo entre swells</div>
                  </div>
                  <div className="mare-altura">{waveCur.swell_wave_period != null ? `${waveCur.swell_wave_period.toFixed(1)} s` : '—'}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="cidade-section">
            <div className="ponto-card" style={{ color: '#94a3b8', fontSize: 13 }}>
              🌊 Dados marinhos indisponíveis para este ponto — a Marine API pode não cobrir coordenadas muito próximas à costa.
            </div>
          </div>
        )}

        {/* ── FASE DA LUA ───────────────────────────────────────────────────── */}
        <div className="cidade-section">
          <div className="section-header">
            <h2 className="section-title">{lua.emoji} Fase da lua</h2>
          </div>
          <div className="cidade-info-grid">
            <div className="info-card">
              <div className="info-icon">{lua.emoji}</div>
              <div className="info-label">Fase atual</div>
              <div className="info-value">{lua.nome}</div>
            </div>
            <div className="info-card">
              <div className="info-icon">💡</div>
              <div className="info-label">Iluminação</div>
              <div className="info-value">{lua.illumination}% do disco lunar</div>
            </div>
            <div className="info-card">
              <div className="info-icon">🌅</div>
              <div className="info-label">Nascer / Pôr do sol</div>
              <div className="info-value">{fmtTime(daily.sunrise[0])} · {fmtTime(daily.sunset[0])}</div>
            </div>
            <div className="info-card">
              <div className="info-icon">🎣</div>
              <div className="info-label">Influência na pesca</div>
              <div className="info-value">
                {novaOuCheia
                  ? 'Lua nova/cheia — marés intensas, peixes mais ativos'
                  : 'Crescente/minguante — condições moderadas'}
              </div>
            </div>
          </div>
        </div>

        {/* ── PREVISÃO 5 DIAS ───────────────────────────────────────────────── */}
        <div className="cidade-section">
          <div className="section-header">
            <h2 className="section-title">📅 Próximos 5 dias</h2>
          </div>
          <div className="forecast-grid">
            {(daily.time as string[]).map((dateStr, i) => {
              const precipP  = (daily.precipitation_probability_max?.[i] ?? 0) as number
              const windMax  = (daily.wind_speed_10m_max?.[i] ?? 0) as number
              const gustsMax = (daily.wind_gusts_10m_max?.[i] ?? windMax * 1.5) as number
              const waveMax  = (marine?.daily?.wave_height_max?.[i] ?? 0) as number
              const dFrac    = moonFrac(new Date(dateStr + 'T12:00:00'))
              const idx      = calcIndice(precipP, windMax, gustsMax, waveMax, dFrac)
              const [, emoji] = wmo(daily.weather_code[i])
              return (
                <div key={dateStr} className={`forecast-day${i === 0 ? ' hoje' : ''}`}>
                  {i === 0 && <div className="index-tag" style={{ marginBottom: 8, fontSize: 9 }}>Hoje</div>}
                  <div className="forecast-dia">{dayLabel(dateStr)}</div>
                  <div className="forecast-data">{dateStr.slice(5).replace('-', '/')}</div>
                  <div className="forecast-ceu">{emoji}</div>
                  <div className="forecast-temp">{Math.round(daily.temperature_2m_max[i])}°</div>
                  <div className="forecast-temp-min">mín. {Math.round(daily.temperature_2m_min[i])}°C</div>
                  <div className="forecast-vento">💨 {Math.round(windMax)} km/h</div>
                  <div className="forecast-vento" style={{ color: precipP > 50 ? '#ef4444' : '#94a3b8' }}>
                    🌧️ {precipP}%
                  </div>
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10, marginTop: 6 }}>
                    <div className="forecast-indice" style={{ color: indexColor(idx) }}>🎣 {idx.toFixed(1)}</div>
                    <div className="forecast-class">{indexLabel(idx)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── AVISO MARÉ ────────────────────────────────────────────────────── */}
        <div className="ponto-card" style={{ marginBottom: 16, background: '#fffbeb', borderColor: '#f59e0b' }}>
          <div className="ponto-header">
            <h3>⚠️ Consulte a tábua de maré oficial antes de sair</h3>
            <span className="ponto-tipo" style={{ background: '#fef3c7', color: '#92400e' }}>Aviso</span>
          </div>
          <p style={{ marginBottom: 0 }}>
            As marés afetam diretamente a segurança e o sucesso da pescaria. A Marinha do Brasil disponibiliza
            tábuas de maré oficiais em seu site. Consulte sempre antes de planejar uma saída embarcada ou na praia.
          </p>
        </div>

        {/* ── NOTA DE FONTE ─────────────────────────────────────────────────── */}
        <div style={{
          background: '#f8fafc', border: '1px solid #dbe6ee', borderRadius: 12,
          padding: '14px 18px', marginBottom: 32,
          fontSize: 12, color: '#64748b', lineHeight: 1.7,
        }}>
          Dados meteorológicos obtidos via <strong>Open-Meteo</strong> (api.open-meteo.com). Dados marinhos
          via <strong>Open-Meteo Marine API</strong>. <strong>O índice é experimental e não substitui a avaliação das condições
          locais.</strong> Atualize a página para obter dados mais recentes.
        </div>

      </div>
    </div>
  )
}
