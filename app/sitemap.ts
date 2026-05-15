import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/config'
import cidadesData from '@/data/cidades.json'
import especiesData from '@/data/especies.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,          lastModified: now, changeFrequency: 'daily',   priority: 1 },
    { url: `${SITE_URL}/cidades`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/especies`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/pesqueiros`,lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/parceiros`, lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/anuncie`,   lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  const cidadeRoutes: MetadataRoute.Sitemap = (cidadesData as any[]).map(c => ({
    url: `${SITE_URL}/cidades/${c.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const especieRoutes: MetadataRoute.Sitemap = (especiesData as any[]).map(e => ({
    url: `${SITE_URL}/especies/${e.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...cidadeRoutes, ...especieRoutes]
}
