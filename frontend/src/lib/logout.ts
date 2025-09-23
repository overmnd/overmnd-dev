export function logoutAndRedirect() {
  try {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    document.cookie = 'access_token=; Max-Age=0; path=/';
  } finally {
    window.location.replace(import.meta.env.VITE_PUBLIC_SITE_URL);
  }
}
