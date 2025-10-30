import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hollowknightsaveeditor.xyz'
  const currentDate = new Date()

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/silksong`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
  ]
}

