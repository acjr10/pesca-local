import type { Metadata } from 'next'
import canaisData from '@/data/canais-youtube.json'
import videosData from '@/data/videos.json'
import CanalImagem from '../components/CanalImagem'

export const metadata: Metadata = {
  title: 'Vídeos de pesca da região',
  description: 'Pescarias, dicas e conteúdos de canais parceiros na Baixada Santista e litoral sul de São Paulo.',
}

export default function VideosPage() {
  const canais = (canaisData as any[]).filter(c => c.ativo)
  const videos = videosData as any[]

  return (
    <>
      <div className="videos-hero">
        <div className="inner-page" style={{ paddingTop: 48, paddingBottom: 48 }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1>Vídeos de pesca da região</h1>
            <p>Pescarias, dicas e conteúdos de canais parceiros na Baixada Santista e litoral sul de São Paulo.</p>
          </div>
        </div>
      </div>

      <div className="inner-page">

        {/* CANAIS PARCEIROS */}
        <div className="cidade-section">
          <div className="section-header">
            <h2 className="section-title">Canais parceiros</h2>
          </div>
          <div className="canais-grid">
            {canais.map(canal => (
              <article key={canal.id} className="canal-card">
                <CanalImagem
                  src={canal.imagem}
                  alt={canal.nome}
                  imgClass="canal-card-img"
                  fallbackClass="canal-card-icon"
                />
                <div className="canal-card-body">
                  <h3 className="canal-card-nome">{canal.nome}</h3>
                  <p className="canal-card-regiao">{canal.regiao}</p>
                  <p className="canal-card-desc">{canal.descricao}</p>
                  <a
                    href={canal.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="canal-yt-btn"
                  >
                    Ver canal no YouTube
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* VÍDEOS EM DESTAQUE */}
        <div className="cidade-section">
          <div className="section-header">
            <h2 className="section-title">Vídeos em destaque</h2>
          </div>

          {videos.length === 0 ? (
            <div className="videos-empty">
              <span className="videos-empty-icon">🎬</span>
              <p>Em breve, vídeos selecionados de canais parceiros aparecerão por aqui.</p>
            </div>
          ) : (
            <div className="videos-grid">
              {videos.map((v: any) => (
                <article key={v.id} className="video-card">
                  {v.thumbnail && (
                    <div className="video-thumb">
                      <img src={v.thumbnail} alt={v.titulo} loading="lazy" />
                    </div>
                  )}
                  <div className="video-card-body">
                    <span className="video-canal-tag">{v.canal}</span>
                    <h3 className="video-titulo">{v.titulo}</h3>
                    {v.descricao && <p className="video-desc">{v.descricao}</p>}
                    <a
                      href={v.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="canal-yt-btn"
                    >
                      Assistir no YouTube
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  )
}
