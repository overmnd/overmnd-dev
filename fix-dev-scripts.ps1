
param(
  [string]$Root = "C:\Users\colby\Desktop\overmnd-dev"
)

function Update-DevScript($pkgPath){
  if(-not (Test-Path $pkgPath)){ Write-Host "skip (missing): $pkgPath"; return }
  $json = Get-Content $pkgPath -Raw | ConvertFrom-Json
  if(-not $json.scripts){ $json | Add-Member -NotePropertyName scripts -NotePropertyValue @{} }
  $json.scripts.dev = "vite --config vite.config.ts"
  ($json | ConvertTo-Json -Depth 100) | Set-Content -NoNewline $pkgPath
  Write-Host "updated: $pkgPath"
}

Update-DevScript (Join-Path $Root "frontend\package.json")
Update-DevScript (Join-Path $Root "admin\package.json")

Write-Host "Done. Restart your dev servers."
