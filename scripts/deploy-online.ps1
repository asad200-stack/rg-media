$ErrorActionPreference = "Continue"
$apiUrl = "https://rg-media-api.onrender.com"
$vercelWeb = "c:\Users\asad2\OneDrive\سطح المكتب\RG MEDIA S\apps\web"

Write-Host "`n=== RG Media Online Deploy ===" -ForegroundColor Cyan
Write-Host "1) Render will open — click Deploy and connect GitHub if asked."
Write-Host "2) This script waits for the API, then updates Vercel automatically.`n"

Start-Process "https://dashboard.render.com/blueprint/new?repo=https://github.com/asad200-stack/rg-media"

$ready = $false
for ($i = 1; $i -le 40; $i++) {
  Write-Host "[$i/40] Checking API..." -NoNewline
  try {
    $h = Invoke-RestMethod -Uri "$apiUrl/api/v1/health" -TimeoutSec 20
    if ($h.status -eq "ok") {
      Write-Host " OK" -ForegroundColor Green
      $ready = $true
      break
    }
  } catch {
    Write-Host " waiting..."
  }
  Start-Sleep -Seconds 30
}

if (-not $ready) {
  Write-Host "`nAPI not ready yet. When Render finishes, run:" -ForegroundColor Yellow
  Write-Host "  vercel env add API_URL production --value `"$apiUrl`" --force"
  Write-Host "  cd apps\web; vercel deploy --prod --yes"
  exit 1
}

Set-Location $vercelWeb
vercel env add API_URL production --value $apiUrl --force 2>$null
vercel deploy --prod --yes
Write-Host "`nDone! Open: https://web-three-sigma-54.vercel.app/login" -ForegroundColor Green
Write-Host "Login: admin@rgmedia.local / ChangeMe123!`n"
