import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hollowknightsaveeditor.xyz'
  const currentDate = new Date()
  const locales = ['en', 'ar', 'pt']
  const paths = [
    { path: '', isRoot: true },
    { path: '/silksong', isRoot: false }
  ]
  
  const urls: MetadataRoute.Sitemap = []
  
  // Generate URLs for all locale and path combinations
  locales.forEach((locale) => {
    paths.forEach(({ path, isRoot }) => {
      const isDefault = locale === 'en'
      
      // Generate URL with proper format
      let url: string
      if (isRoot) {
        // Root path: https://hollowknightsaveeditor.xyz/ or /?lang=ar
        url = isDefault 
          ? `${baseUrl}/` 
          : `${baseUrl}/?lang=${locale}`
      } else {
        // Sub path: https://hollowknightsaveeditor.xyz/silksong or /silksong?lang=ar
        url = isDefault 
          ? `${baseUrl}${path}` 
          : `${baseUrl}${path}?lang=${locale}`
      }
      
      const priority = path === '' ? (isDefault ? 1.0 : 0.9) : (isDefault ? 0.95 : 0.85)
      
      // Generate alternates with proper format
      const alternates: Record<string, string> = {}
      if (isRoot) {
        alternates.en = `${baseUrl}/`
        alternates.ar = `${baseUrl}/?lang=ar`
        alternates.pt = `${baseUrl}/?lang=pt`
      } else {
        alternates.en = `${baseUrl}${path}`
        alternates.ar = `${baseUrl}${path}?lang=ar`
        alternates.pt = `${baseUrl}${path}?lang=pt`
      }
      
      urls.push({
        url,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority,
        alternates: {
          languages: alternates,
        },
      })
    })
  })
  
  return urls
}

