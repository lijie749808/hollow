'use client'

import { useEffect } from 'react'

interface DynamicMetaProps {
  title: string
  description: string
  keywords: string
  baseUrl: string
  locale?: string
}

export default function DynamicMeta({ 
  title, 
  description, 
  keywords, 
  baseUrl,
  locale = 'en'
}: DynamicMetaProps) {
  useEffect(() => {
    // Update document title
    document.title = title

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name'
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement
      
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, name)
        document.head.appendChild(meta)
      }
      
      meta.content = content
    }

    // Update basic meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    
    // Update OpenGraph tags
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:locale', locale === 'ar' ? 'ar_SA' : locale === 'pt' ? 'pt_BR' : 'en_US', true)
    updateMetaTag('og:url', baseUrl, true)
    
    // Update Twitter tags
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    
    // Remove existing hreflang and canonical links
    document.querySelectorAll('link[rel="canonical"], link[rel="alternate"]').forEach(link => link.remove())
    
    // Add canonical URL (always points to current language version)
    const canonical = document.createElement('link')
    canonical.rel = 'canonical'
    canonical.href = baseUrl
    document.head.appendChild(canonical)
    
    // Add hreflang tags for all language versions
    // Extract base URL without query params
    const baseWithoutQuery = baseUrl.split('?')[0]
    
    const languages = [
      { code: 'en', url: baseWithoutQuery },
      { code: 'ar', url: `${baseWithoutQuery}?lang=ar` },
      { code: 'pt', url: `${baseWithoutQuery}?lang=pt` },
    ]
    
    languages.forEach(({ code, url }) => {
      const hreflang = document.createElement('link')
      hreflang.rel = 'alternate'
      hreflang.hreflang = code
      hreflang.href = url
      document.head.appendChild(hreflang)
    })
    
    // Add x-default hreflang (points to English version)
    const defaultLang = document.createElement('link')
    defaultLang.rel = 'alternate'
    defaultLang.hreflang = 'x-default'
    defaultLang.href = languages[0].url // English version
    document.head.appendChild(defaultLang)

    // Update html lang attribute
    document.documentElement.lang = locale
  }, [title, description, keywords, baseUrl, locale])

  return null
}

