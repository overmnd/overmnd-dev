# scripts\seed.ps1
$ErrorActionPreference = "Stop"
$tok = (Invoke-RestMethod -Method POST -Uri http://127.0.0.1:8000/api/v1/auth/login `
  -ContentType "application/json" -Body (@{ email="owner@acme.com"; password="ChangeMe123!" } | ConvertTo-Json)).access_token
$h = @{ Authorization = "Bearer $tok" }
Invoke-RestMethod -Headers $h -Method POST -Uri http://127.0.0.1:8000/api/v1/findings/ `
  -ContentType "application/json" -Body (@{ category="license_optimizer"; risk_score=42; severity="high"; evidence_json=@{seed="ok"} } | ConvertTo-Json)
$env:PYTHONPATH="$PWD\backend"
python -m app.scripts.seed_data
