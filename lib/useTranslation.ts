'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { type Locale, defaultLocale, locales } from './i18n'
import { translations } from './translations'

export function useTranslation() {
  const searchParams = useSearchParams()
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  useEffect(() => {
    // Get language from URL parameter
    const langParam = searchParams.get('lang')
    
    if (langParam && locales.includes(langParam as Locale)) {
      setLocale(langParam as Locale)
      return
    }

    // Get language from localStorage
    if (typeof window !== 'undefined') {
      const storedLocale = localStorage.getItem('preferred-locale')
      if (storedLocale && locales.includes(storedLocale as Locale)) {
        setLocale(storedLocale as Locale)
        return
      }
    }

    setLocale(defaultLocale)
  }, [searchParams])

  return {
    locale,
    t: translations[locale],
  }
}

