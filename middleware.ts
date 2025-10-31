import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './lib/i18n'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Check if pathname starts with a non-default locale
  for (const locale of locales) {
    if (locale !== defaultLocale) {
      // Handle locale root path (e.g., /ar or /pt)
      if (pathname === `/${locale}`) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
      
      // Handle locale subpaths (e.g., /ar/silksong or /pt/silksong)
      if (pathname.startsWith(`/${locale}/`)) {
        const url = request.nextUrl.clone()
        url.pathname = pathname.replace(`/${locale}`, '')
        return NextResponse.redirect(url)
      }
    }
  }

  // For all other paths, continue normally
  return NextResponse.next()
}

export const config = {
  // Skip Next.js internals and static files
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
}

