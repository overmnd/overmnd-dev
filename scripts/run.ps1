# scripts\run.ps1
$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path $MyInvocation.MyCommand.Path -Parent
$RepoRoot = Split-Path $ScriptDir -Parent
Set-Location "$RepoRoot\backend"

# Load .env from repo root
$EnvPath = Join-Path $RepoRoot ".env"
if (Test-Path $EnvPath) {
    Get-Content $EnvPath | ForEach-Object {
        if ($_ -match "^\s*#") { return }
        if (-not ($_ -match "=")) { return }
        $name, $value = $_ -split "=", 2
        [Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim())
    }
}

uvicorn app.main:app --reload --app-dir .
