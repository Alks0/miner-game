Param(
  [int]$Port = 5173
)

Write-Host "[dev] Launching one-click dev (backend + H5 demo)" -ForegroundColor Cyan

$env:FRONT_PORT = $Port
$env:PORT = 3002

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error 'Node.js not found. Please install Node.js and run this script again.'
  exit 1
}

node dev-server.js
