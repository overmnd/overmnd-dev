# scripts\auth-smoke.ps1
$Base = "http://127.0.0.1:8000"
$Email = "owner@acme.com"
$Password = "ChangeMe123!"

function Post-Json {
    param([string]$Url, [hashtable]$Body)
    $json = $Body | ConvertTo-Json -Depth 5
    return Invoke-RestMethod -Method POST -Uri $Url -ContentType "application/json" -Body $json -ErrorAction Stop
}

# 1) Try to register (ok if it already exists)
try {
    $reg = @{ email = $Email; password = $Password }
    $regResp = Post-Json "$Base/api/v1/auth/register" $reg
    $token = $regResp.access_token
    "REGISTER token: $token"
} catch {
    # Most likely: {"detail":"Email already registered"}
    try {
        $err = $_.ErrorDetails.Message | ConvertFrom-Json
        "REGISTER skipped: $($err.detail)"
    } catch {
        throw
    }
}

# 2) Always login to get a fresh token
$login = @{ email = $Email; password = $Password }
$loginResp = Post-Json "$Base/api/v1/auth/login" $login
$loginToken = $loginResp.access_token
"LOGIN token: $loginToken"

# 3) Call /me with the login token
$headers = @{ Authorization = "Bearer $loginToken" }
"`n/me result:"
Invoke-RestMethod -Headers $headers -Uri "$Base/api/v1/auth/me"
