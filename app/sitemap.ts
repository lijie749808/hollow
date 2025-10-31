import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hollowknightsaveeditor.xyz'
  const currentDate = new Date()
  const locales = ['en', 'ar', 'pt']
  const paths = ['', '/silksong']
  
  const urls: MetadataRoute.Sitemap = []
  
  // Generate URLs for all locale and path combinations
  locales.forEach((locale) => {
    paths.forEach((path) => {
      const isDefault = locale === 'en'
      const url = isDefault 
        ? `${baseUrl}${path || ''}` 
        : `${baseUrl}/${locale}${path || ''}`
      
      const priority = path === '' ? (isDefault ? 1.0 : 0.9) : (isDefault ? 0.95 : 0.85)
      
      urls.push({
        url,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority,
        alternates: {
          languages: {
            en: `${baseUrl}${path || ''}`,
            ar: `${baseUrl}/ar${path || ''}`,
            pt: `${baseUrl}/pt${path || ''}`,
          },
        },
      })
    })
  })
  
  return urls
}

