// Drop-in replacement for logout util that works with Next.js (uses process.env via lib/env)
// Path: site/src/lib/auth/logout.ts
import { env } from '../env';

/**
 * Clears client-side auth/session state and redirects to the public site URL.
 * Safe to call in any client component or effect.
 */
export function logoutAndRedirect(): void {
  try {
    if (typeof window !== 'undefined') {
      // Local/session storage
      try {
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('refresh_token');
        window.localStorage.removeItem('user');
      } catch {}
      try {
        window.sessionStorage.clear();
      } catch {}

      // Clear common auth cookies
      const cookies = ['access_token', 'refresh_token', 'user'];
      const expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
      cookies.forEach((name) => {
        try {
          document.cookie = `${name}=; expires=${expires}; path=/; SameSite=Lax`;
        } catch {}
      });
    }
  } finally {
    if (typeof window !== 'undefined') {
      const target = (env.NEXT_PUBLIC_SITE_URL ?? '').trim() || '/';
      window.location.replace(target);
    }
  }
}

export default logoutAndRedirect;
