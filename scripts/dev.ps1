# scripts/dev.ps1
Set-Location "$PSScriptRoot\..\backend"

$env:PYTHONPATH = "$PWD"
$env:POSTGRES_USER    = "overmnd"
$env:POSTGRES_PASSWORD= "password"
$env:POSTGRES_DB      = "overmnd"
$env:POSTGRES_HOST    = "localhost"
$env:POSTGRES_PORT    = "5432"

python -m uvicorn app.main:app --reload
