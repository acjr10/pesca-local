'use client'

import { useState, useEffect } from 'react'

const LAT = -23.98
const LON = -46.26

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
  else if (frac < 0.1875)                    return ['Crescente',         '🌒']
  else if (frac < 0.3125)                    return ['Quarto Crescente',  '🌓']
  else if (frac < 0.4375)                    return ['Crescente Gibosa',  '🌔']
  else if (frac < 0.5625)                    return ['Lua Cheia',         '🌕']
  else if (frac < 0.6875)                    return ['Minguante Gibosa',  '🌖']
  else if (frac < 0.8125)                    return ['Quarto Minguante',  '🌗']
  else                                        return ['Minguante',         '🌘']
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
function indexLabel(n: number) { return n >= 8 ? 'Bom para pescar' : n >= 5 ? 'Atenção' : 'Ruim / Evitar' }

async function fetchData() {
  const wq = new URLSearchParams({
    latitude: String(LAT), longitude: String(LON),
    current: 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation_probability',
    daily: 'precipitation_probability_max,sunrise,sunset',
    timezone: 'America/Sao_Paulo', forecast_days: '1', wind_speed_unit: 'kmh',
  })
  const mq = new URLSearchParams({
    latitude: String(LAT), longitude: String(LON),
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

export default function ConditionsWidget() {
  const [data, setData]     = useState<{ weather: any; marine: any } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData().then(d => { setData(d); setLoading(false) })
  }, [])

  /* ── Loading ──────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <section className="conditions-section">
        <style>{`@keyframes sk{0%,100%{opacity:.3}50%{opacity:.6}}.sk{animation:sk 1.4s ease-in-out infinite;background:#e2e8f0;border-radius:10px}`}</style>
        <div className="section-header">
          <h2 className="section-title">🌊 Condições hoje · Praia Grande</h2>
        </div>
        <div className="conditions-grid">
          {[...Array(4)].map((_, i) => <div key={i} className="sk" style={{ height: 72 }} />)}
        </div>
        <div className="sk" style={{ height: 80, marginTop: 14 }} />
      </section>
    )
  }

  /* ── Fallback se API falhou ───────────────────────────────────────────── */
  if (!data?.weather) {
    return (
      <section className="conditions-section">
        <div className="section-header">
          <h2 className="section-title">🌊 Condições hoje · Praia Grande</h2>
        </div>
        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 8 }}>
          Dados indisponíveis no momento. <a href="/previsao" style={{ color: '#0b78aa', fontWeight: 700 }}>Ver previsão completa →</a>
        </p>
      </section>
    )
  }

  /* ── Dados processados ────────────────────────────────────────────────── */
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
      <div className="section-header">
        <h2 className="section-title">🌊 Condições hoje · Praia Grande</h2>
        <a href="/previsao" className="section-link">Previsão completa →</a>
      </div>

      <div className="conditions-grid">
        <div className="cond-card">
          <div className="cond-label">Ondas</div>
          <div className="cond-value">{wave ? `${waveH.toFixed(1)} m` : '—'}</div>
          <div className="cond-sub">{wave ? `${windDir(wave.wave_direction)} · Mar aberto` : 'Dados indisponíveis'}</div>
        </div>
        <div className="cond-card">
          <div className="cond-label">Lua</div>
          <div className="cond-value">{luaEmoji} {luaNome.split(' ')[0]}</div>
          <div className="cond-sub">Nasc. {fmtTime(daily.sunrise[0])}</div>
        </div>
        <div className="cond-card">
          <div className="cond-label">Clima</div>
          <div className="cond-value">{Math.round(cur.temperature_2m)} °C</div>
          <div className="cond-sub">{ceuDesc} · {precipProb}% chuva</div>
        </div>
        <div className="cond-card">
          <div className="cond-label">Vento</div>
          <div className="cond-value">{Math.round(cur.wind_speed_10m)} km/h</div>
          <div className="cond-sub">{windDir(cur.wind_direction_10m)} · Raj. {Math.round(gusts)} km/h</div>
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
    </section>
  )
}
