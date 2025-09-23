import React from 'react'

export default function App(){
  return (
    <div style={{fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, Arial', padding: 24}}>
      <h1>OVERMND Admin</h1>
      <p>Dev dashboard is running.</p>
      <ul>
        <li>API health: <a href="http://localhost:8000/health" target="_blank">http://localhost:8000/health</a></li>
        <li>Docs: <a href="http://localhost:8000/docs" target="_blank">http://localhost:8000/docs</a></li>
      </ul>
    </div>
  )
}
