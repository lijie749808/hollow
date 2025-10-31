'use client'

import { usePathname, useRouter } from 'next/navigation'
import { locales, localeNames, localeFlags, type Locale, defaultLocale } from '@/lib/i18n'
import { useState, useRef, useEffect } from 'react'

export default function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Get current locale from URL parameter or localStorage
  const getCurrentLocale = (): Locale => {
    if (typeof window === 'undefined') return defaultLocale
    
    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search)
    const langParam = urlParams.get('lang')
    
    if (langParam && locales.includes(langParam as Locale)) {
      return langParam as Locale
    }
    
    // Check localStorage
    const storedLocale = localStorage.getItem('preferred-locale')
    if (storedLocale && locales.includes(storedLocale as Locale)) {
      return storedLocale as Locale
    }
    
    return defaultLocale
  }

  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale)
  
  useEffect(() => {
    setCurrentLocale(getCurrentLocale())
  }, [pathname])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const switchLanguage = (locale: Locale) => {
    // Store language preference in localStorage
    localStorage.setItem('preferred-locale', locale)
    
    // Use URL parameter for language
    const url = new URL(window.location.href)
    
    if (locale === defaultLocale) {
      url.searchParams.delete('lang')
    } else {
      url.searchParams.set('lang', locale)
    }
    
    router.push(`${pathname}${url.search}`)
    setIsOpen(false)
    
    // Reload to apply translations
    window.location.href = url.toString()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-900/60 hover:bg-purple-900/80 border border-purple-400/40 rounded-lg transition-all"
        aria-label="Select language"
      >
        <span className="text-2xl">{localeFlags[currentLocale]}</span>
        <span className="text-purple-200 font-medium">{localeNames[currentLocale]}</span>
        <svg
          className={`w-4 h-4 text-purple-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-purple-950/95 backdrop-blur-lg border border-purple-400/40 rounded-lg shadow-2xl overflow-hidden z-50">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => switchLanguage(locale)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-900/60 transition-colors ${
                currentLocale === locale ? 'bg-purple-900/40' : ''
              }`}
            >
              <span className="text-2xl">{localeFlags[locale]}</span>
              <span className={`flex-1 text-left ${
                currentLocale === locale ? 'text-purple-200 font-semibold' : 'text-purple-300'
              }`}>
                {localeNames[locale]}
              </span>
              {currentLocale === locale && (
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

