export const API_BASE = (import.meta.env.VITE_API_BASE as string) || '/api';

export async function apiGet(path: string){
  const r = await fetch(`${API_BASE}${path}`, { credentials: 'include' })
  if(!r.ok){ throw new Error(`GET ${path} -> ${r.status}`) }
  return r.json()
}

export async function apiPost(path: string, body: any){
  const r = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include'
  })
  if(!r.ok){ throw new Error(`POST ${path} -> ${r.status}`) }
  return r.json()
}
