# scripts\db_migrate.ps1
$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path $MyInvocation.MyCommand.Path -Parent
$RepoRoot  = Split-Path $ScriptDir -Parent
Set-Location $RepoRoot

# Make backend importable
$env:PYTHONPATH = "$PWD\backend"

# Load .env if present
$EnvPath = Join-Path $RepoRoot ".env"
if (Test-Path $EnvPath) {
  Get-Content $EnvPath | ForEach-Object {
    if ($_ -match "^\s*#") { return }
    if (-not ($_ -match "=")) { return }
    $name, $value = $_ -split "=", 2
    [Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim())
  }
}

# Drive DB URL via env
if (-not $env:DATABASE_URL -or [string]::IsNullOrWhiteSpace($env:DATABASE_URL)) {
  $env:DATABASE_URL = "postgresql+psycopg2://overmnd:password@localhost:5432/overmnd"
}

# Use the ROOT alembic.ini
alembic -c .\alembic.ini upgrade head
