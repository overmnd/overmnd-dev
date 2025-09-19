# A) Register -> returns JWT
$reg = @{ email = "owner@acme.com"; password = "ChangeMe123!" } | ConvertTo-Json
$regResp  = Invoke-RestMethod -Method POST -Uri http://127.0.0.1:8000/api/v1/auth/register -ContentType "application/json" -Body $reg
$token    = $regResp.access_token
"REGISTER token: $token"

# B) /me with Authorization header
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Headers $headers -Uri http://127.0.0.1:8000/api/v1/auth/me

# C) Login -> fresh JWT
$login = @{ email = "owner@acme.com"; password = "ChangeMe123!" } | ConvertTo-Json
$loginResp  = Invoke-RestMethod -Method POST -Uri http://127.0.0.1:8000/api/v1/auth/login -ContentType "application/json" -Body $login
$loginToken = $loginResp.access_token
"LOGIN token: $loginToken"
