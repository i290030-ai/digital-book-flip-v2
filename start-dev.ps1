$env:PATH = 'C:\Users\nagar\.lmstudio\.internal\utils;' + $env:PATH
Set-Location $PSScriptRoot
Write-Host "Starting dev server..." -ForegroundColor Green
& ".\node_modules\.bin\vite.cmd"
