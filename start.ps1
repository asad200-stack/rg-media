$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
Set-Location $root

Write-Host "`n=== RG Media Platform ===" -ForegroundColor Cyan

# 1) Docker
Write-Host "`n[1/4] Checking Docker..." -ForegroundColor Yellow
try {
  docker info 2>$null | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "Docker not running" }
} catch {
  Write-Host "Docker Desktop is not running. Starting it..." -ForegroundColor Yellow
  $dockerExe = "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
  if (Test-Path $dockerExe) {
    Start-Process $dockerExe
    $ready = $false
    for ($i = 0; $i -lt 36; $i++) {
      Start-Sleep -Seconds 5
      docker info 2>$null | Out-Null
      if ($LASTEXITCODE -eq 0) { $ready = $true; break }
    }
    if (-not $ready) {
      Write-Host "ERROR: Wait for Docker Desktop to start, then run this script again." -ForegroundColor Red
      Read-Host "Press Enter to exit"
      exit 1
    }
  } else {
    Write-Host "ERROR: Install Docker Desktop first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
  }
}

# 2) Database
Write-Host "[2/4] Starting database..." -ForegroundColor Yellow
docker compose up -d
Start-Sleep -Seconds 3

# 3) Free ports 3000 / 3001 if stuck from old session
Write-Host "[3/5] Freeing ports if needed..." -ForegroundColor Yellow
foreach ($port in @(3000, 3001)) {
  $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($conn) {
    $procId = $conn.OwningProcess
    $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
    if ($proc -and $proc.ProcessName -eq "node") {
      Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
      Write-Host "  Stopped old node process on port $port"
    }
  }
}

# 4) Public tunnel for Vercel / mobile
Write-Host "[4/5] Starting online tunnel..." -ForegroundColor Yellow
& "$root\scripts\online-tunnel.ps1" | Out-Null

# 5) Start app
Write-Host "[5/5] Starting web + API..." -ForegroundColor Yellow
Write-Host "`n  Web:  http://localhost:3000" -ForegroundColor Green
Write-Host "  API:  http://localhost:3001/api/v1/health" -ForegroundColor Green
Write-Host "  Mobile: https://web-three-sigma-54.vercel.app (keep this window open)`n" -ForegroundColor Green

Start-Process "http://localhost:3000"
npm run dev
