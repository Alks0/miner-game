Param(
  [int]$Port = 5173,
  [int]$BackendPort = 3002,
  [switch]$Rebuild,
  [switch]$Open,
  [switch]$KillExisting
)

Write-Host "[dev] Launching one-click dev (backend + H5)" -ForegroundColor Cyan

$env:FRONT_PORT = $Port
$env:PORT = $BackendPort

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error 'Node.js not found. Please install Node.js and run this script again.'
  exit 1
}

if ($KillExisting) {
  try {
    $cons = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($cons) {
      $pids = $cons | Select-Object -ExpandProperty OwningProcess -Unique
      foreach ($pid in $pids) {
        try { Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue; Write-Host "[dev] Killed process on :$Port (PID $pid)" -ForegroundColor Yellow } catch {}
      }
    }
  } catch {}
}

if ($Rebuild) {
  $es = Join-Path $PSScriptRoot 'node_modules/.bin/esbuild.cmd'
  if (-not (Test-Path $es)) { Write-Host '[dev] Installing esbuild...' -ForegroundColor Yellow; npm i -D esbuild | Out-Null }
  Write-Host '[dev] Rebuilding frontend...' -ForegroundColor Yellow
  & $es "$(Join-Path $PSScriptRoot 'frontend-scripts/App.ts')" --bundle --format=iife --platform=browser --target=es2018 --sourcemap --outfile="$(Join-Path $PSScriptRoot 'web/app.js')"
  if ($LASTEXITCODE -ne 0) { Write-Error '[dev] esbuild failed'; exit 1 }
  Write-Host '[dev] Build complete: web/app.js' -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Frontend: http://localhost:$Port" -ForegroundColor Green
Write-Host " Backend:  http://localhost:${BackendPort}" -ForegroundColor Green  
Write-Host " Watch:    Auto-rebuild enabled" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($Open) { Start-Process "http://localhost:$Port" }

node dev-server.js
