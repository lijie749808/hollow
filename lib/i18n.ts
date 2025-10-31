// Internationalization configuration

export const locales = ['en', 'ar', 'pt'] as const
export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
  pt: 'Português',
}

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  ar: '🇸🇦',
  pt: '🇧🇷',
}

// Helper function to get locale from pathname
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/')
  const firstSegment = segments[1]
  
  if (locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale
  }
  
  return defaultLocale
}

// Helper function to generate alternate URLs
export function getAlternateUrls(pathname: string, baseUrl: string) {
  const urls: Record<string, string> = {}
  
  // Remove locale from pathname if present
  const pathWithoutLocale = pathname.replace(/^\/(en|ar|pt)/, '') || '/'
  
  locales.forEach((locale) => {
    if (locale === 'en') {
      urls[locale] = `${baseUrl}${pathWithoutLocale}`
    } else {
      const path = pathWithoutLocale === '/' ? '' : pathWithoutLocale
      urls[locale] = `${baseUrl}/${locale}${path}`
    }
  })
  
  return urls
}

