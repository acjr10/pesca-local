'use client'

import { useState, useEffect } from 'react'

const CITY_COORDS: Record<string, { lat: number; lon: number; name: string }> = {
  'praia-grande': { lat: -24.0057, lon: -46.4022, name: 'Praia Grande' },
  'sao-vicente':  { lat: -23.9608, lon: -46.3922, name: 'São Vicente' },
  'santos':       { lat: -23.9608, lon: -46.3339, name: 'Santos' },
  'mongagua':     { lat: -24.0889, lon: -46.6269, name: 'Mongaguá' },
  'itanhaem':     { lat: -24.1833, lon: -46.7897, name: 'Itanhaém' },
  'peruibe':      { lat: -24.3189, lon: -47.0053, name: 'Peruíbe' },
}

const WMO: Record<number, [string, string]> = {
  0: ['Céu limpo', '☀️'], 1: ['Principalmente limpo', '🌤️'], 2: ['Parcialmente nublado', '⛅'],
  3: ['Nublado', '☁️'], 45: ['Neblina', '🌫️'], 48: ['Neblina com geada', '🌫️'],
  51: ['Garoa leve', '🌦️'], 53: ['Garoa moderada', '🌦️'], 55: ['Garoa intensa', '🌧️'],
  61: ['Chuva leve', '🌧️'], 63: ['Chuva moderada', '🌧️'], 65: ['Chuva intensa', '🌧️'],
  80: ['Pancadas de chuva', '🌦️'], 81: ['Pancadas moderadas', '🌧️'], 82: ['Pancadas violentas', '⛈️'],
  95: ['Tempestade', '⛈️'], 96: ['Tempestade c/ granizo', '⛈️'], 99: ['Tempestade forte', '⛈️'],
}
function wmo(code: number): [string, string] { return WMO[code] ?? ['Variável', '🌥️'] }

function windDir(deg: number) {
  return ['N','NNE','NE','ENE','L','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO'][Math.round(deg / 22.5) % 16]
}

function fmtTime(isoLocal: string) { return isoLocal.split('T')[1]?.slice(0, 5) ?? '' }

function moonFrac(date: Date): number {
  const JD = date.getTime() / 86400000 + 2440587.5
  const syn = 29.530588853
  let f = ((JD - 2451549.76) % syn) / syn
  return f < 0 ? f + 1 : f
}
function moonName(frac: number): [string, string] {
  if      (frac < 0.0625 || frac >= 0.9375) return ['Lua Nova',         '🌑']
  else if (frac < 0.1875)                    return ['Lua Crescente',    '🌒']
  else if (frac < 0.3125)                    return ['Quarto Crescente', '🌓']
  else if (frac < 0.4375)                    return ['Crescente Gibosa', '🌔']
  else if (frac < 0.5625)                    return ['Lua Cheia',        '🌕']
  else if (frac < 0.6875)                    return ['Minguante Gibosa', '🌖']
  else if (frac < 0.8125)                    return ['Quarto Minguante', '🌗']
  else                                        return ['Lua Minguante',   '🌘']
}

function fishingWindows(sunriseISO: string, sunsetISO: string): [string, string] {
  const mins = (iso: string) => { const [,t] = iso.split('T'); const [h,m] = t.split(':').map(Number); return h*60+m }
  const fmt  = (m: number)   => { const h=Math.floor(m/60)%24; const mm=m%60; return `${String(h).padStart(2,'0')}:${String(mm).padStart(2,'0')}` }
  const sr = mins(sunriseISO), ss = mins(sunsetISO)
  return [`${fmt(sr)} – ${fmt(sr+120)}`, `${fmt(ss-120)} – ${fmt(ss)}`]
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
function indexColor(n: number) { return n >= 8 ? '#14c8c2' : n >= 5 ? '#f59e0b' : '#ef4444' }
function indexLabel(n: number) { return n >= 8 ? 'Bom para planejar' : n >= 5 ? 'Atenção' : 'Melhor evitar' }

async function fetchWeatherData(lat: number, lon: number) {
  const wq = new URLSearchParams({
    latitude: String(lat), longitude: String(lon),
    current: 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation_probability',
    daily: 'precipitation_probability_max,sunrise,sunset',
    timezone: 'America/Sao_Paulo', forecast_days: '1', wind_speed_unit: 'kmh',
  })
  const mq = new URLSearchParams({
    latitude: String(lat), longitude: String(lon),
    current: 'wave_height,wave_direction',
    timezone: 'America/Sao_Paulo', forecast_days: '1',
  })
  const [w, m] = await Promise.allSettled([
    fetch(`https://api.open-meteo.com/v1/forecast?${wq}`).then(r => r.json()),
    fetch(`https://marine-api.open-meteo.com/v1/marine?${mq}`).then(r => r.json()),
  ])
  return {
    weather: w.status === 'fulfilled' ? w.value : null,
    marine:  m.status === 'fulfilled' ? m.value : null,
  }
}

const DISCLAIMER = 'Dados meteorológicos via Open-Meteo. O índice é experimental e não substitui a avaliação das condições locais.'

interface Props {
  initialLat?: number
  initialLon?: number
  initialCityName?: string
  showCitySelect?: boolean
}

export default function ConditionsWidget({
  initialLat = -24.0057,
  initialLon = -46.4022,
  initialCityName = 'Praia Grande',
  showCitySelect = false,
}: Props) {
  const [citySlug, setCitySlug] = useState('praia-grande')
  const [lat, setLat]           = useState(initialLat)
  const [lon, setLon]           = useState(initialLon)
  const [cityName, setCityName] = useState(initialCityName)
  const [data, setData]         = useState<{ weather: any; marine: any } | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    setData(null)
    fetchWeatherData(lat, lon)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [lat, lon])

  function handleCityChange(slug: string) {
    const coords = CITY_COORDS[slug]
    if (!coords) return
    setCitySlug(slug)
    setLat(coords.lat)
    setLon(coords.lon)
    setCityName(coords.name)
  }

  function renderHeader() {
    return (
      <div className="section-header">
        <h2 className="section-title">Planejamento da pescaria · {cityName}</h2>
        <div className="conditions-header-right">
          {showCitySelect && (
            <select
              className="conditions-city-select"
              value={citySlug}
              onChange={e => handleCityChange(e.target.value)}
              aria-label="Selecionar cidade"
            >
              {Object.entries(CITY_COORDS).map(([slug, c]) => (
                <option key={slug} value={slug}>{c.name}</option>
              ))}
            </select>
          )}
          <a href="/previsao" className="section-link">Previsão completa →</a>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <section className="conditions-section">
        <style>{`@keyframes sk{0%,100%{opacity:.3}50%{opacity:.6}}.sk{animation:sk 1.4s ease-in-out infinite;background:#e2e8f0;border-radius:10px}`}</style>
        {renderHeader()}
        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 8 }}>Carregando dados de planejamento...</p>
        <div className="conditions-grid" style={{ marginTop: 14 }}>
          {[...Array(4)].map((_, i) => <div key={i} className="sk" style={{ height: 72 }} />)}
        </div>
        <div className="sk" style={{ height: 80, marginTop: 14 }} />
      </section>
    )
  }

  if (error || !data?.weather) {
    return (
      <section className="conditions-section">
        {renderHeader()}
        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 8 }}>
          Não foi possível carregar os dados agora. Consulte clima, vento, ondas e maré antes de sair.{' '}
          <a href="/previsao" style={{ color: '#0b78aa', fontWeight: 700 }}>Ver previsão completa →</a>
        </p>
        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 12 }}>{DISCLAIMER}</p>
      </section>
    )
  }

  const cur   = data.weather.current
  const daily = data.weather.daily
  const wave  = data.marine?.current ?? null

  const luaFrac = moonFrac(new Date())
  const [luaNome, luaEmoji] = moonName(luaFrac)
  const precipProb = (daily.precipitation_probability_max?.[0] ?? cur.precipitation_probability ?? 0) as number
  const gusts      = (cur.wind_gusts_10m ?? cur.wind_speed_10m * 1.5) as number
  const waveH      = (wave?.wave_height ?? 0) as number

  const indice  = calcIndice(precipProb, cur.wind_speed_10m, gusts, waveH, luaFrac)
  const cor     = indexColor(indice)
  const janelas = fishingWindows(daily.sunrise[0], daily.sunset[0])
  const tagText = cor === '#14c8c2' ? '#031526' : cor === '#f59e0b' ? '#1a0f00' : '#fff'

  const [ceuDesc] = wmo(cur.weather_code)

  return (
    <section className="conditions-section">
      {renderHeader()}

      <div className="conditions-grid">
        <div className="cond-card">
          <div className="cond-label">Ondas</div>
          <div className="cond-value">{wave ? `${waveH.toFixed(1)} m` : '—'}</div>
          <div className="cond-sub">{wave ? `${waveH.toFixed(1)} m · mar aberto` : 'Dados indisponíveis'}</div>
        </div>
        <div className="cond-card">
          <div className="cond-label">{luaNome || 'Fase lunar'}</div>
          <div className="cond-value">{luaEmoji} {luaNome}</div>
          <div className="cond-sub">Fase lunar · nasc. {fmtTime(daily.sunrise[0])}</div>
        </div>
        <div className="cond-card">
          <div className="cond-label">Clima</div>
          <div className="cond-value">{Math.round(cur.temperature_2m)} °C</div>
          <div className="cond-sub">{Math.round(cur.temperature_2m)}°C · {ceuDesc}</div>
        </div>
        <div className="cond-card">
          <div className="cond-label">Vento</div>
          <div className="cond-value">{Math.round(cur.wind_speed_10m)} km/h</div>
          <div className="cond-sub">{Math.round(cur.wind_speed_10m)} km/h · {windDir(cur.wind_direction_10m)} · raj. {Math.round(gusts)} km/h</div>
        </div>
      </div>

      <div className="index-bar">
        <div>
          <div className="index-label">Índice experimental</div>
          <div className="index-value" style={{ color: cor }}>{indice.toFixed(1)} / 10</div>
          <span className="index-tag" style={{ background: cor, color: tagText }}>{indexLabel(indice)}</span>
        </div>
        <div className="index-window">
          <div className="index-window-label">Janelas recomendadas</div>
          <div className="index-window-times">{janelas[0]}<br />{janelas[1]}</div>
        </div>
      </div>

      <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 12, lineHeight: 1.5 }}>
        {DISCLAIMER}
      </p>
    </section>
  )
}
