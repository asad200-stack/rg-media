$ErrorActionPreference = "Continue"
$root = Split-Path $PSScriptRoot -Parent
$log = "$env:TEMP\rg-media-cf.log"

if (-not (Test-Path "$env:TEMP\cloudflared.exe")) {
  Write-Host "Downloading cloudflared..."
  Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "$env:TEMP\cloudflared.exe" -TimeoutSec 120
}

Get-Process cloudflared -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep 1

Remove-Item $log -ErrorAction SilentlyContinue
Start-Process -FilePath "$env:TEMP\cloudflared.exe" -ArgumentList "tunnel","--url","http://localhost:3001" -RedirectStandardError $log -WindowStyle Hidden

$tunnelUrl = $null
for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Seconds 2
  if (Test-Path $log) {
    $m = Select-String -Path $log -Pattern "https://[a-z0-9-]+\.trycloudflare\.com" | Select-Object -First 1
    if ($m) {
      $tunnelUrl = $m.Matches[0].Value
      break
    }
  }
}

if ($tunnelUrl) {
  Write-Host "`nTunnel: $tunnelUrl" -ForegroundColor Green
  $webDir = Join-Path $root "apps\web"
  if (Get-Command vercel -ErrorAction SilentlyContinue) {
    Push-Location $webDir
    vercel env add API_URL production --value $tunnelUrl --force 2>$null | Out-Null
    Pop-Location
    Write-Host "Vercel API_URL updated." -ForegroundColor Green
  }
} else {
  Write-Host "Tunnel starting — check $log" -ForegroundColor Yellow
}
