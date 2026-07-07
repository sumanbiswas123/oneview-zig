# OneView Multi-Step Build Script
# This builds the frontend assets, compiles the Zig binary, and packages the Inno Setup installer.

$ErrorActionPreference = "Stop"

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "1/3: Building Frontend (Vite)..." -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Push-Location frontend
npm run vite:build
Pop-Location

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "2/3: Building Backend (Zig ReleaseFast)..." -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
.zig-compiler\zig-x86_64-windows-0.16.0\zig-x86_64-windows-0.16.0\zig.exe build -Doptimize=ReleaseFast

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "3/3: Packaging Installer (Inno Setup)..." -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
& "C:\Program Files (x86)\Inno Setup 6\ISCC.exe" oneview.iss

Write-Host "`nBuild complete! Installer generated at setup.exe." -ForegroundColor Green
