# PowerShell script to download and set up portable Zig compiler locally

$ZigVersion = "0.16.0"
$ZipUrl = "https://ziglang.org/download/$ZigVersion/zig-x86_64-windows-$ZigVersion.zip"
$DestDir = Join-Path $PSScriptRoot ".zig-compiler"
$ZipFile = Join-Path $PSScriptRoot "zig-compiler.zip"

Write-Host "Creating local compiler directory at: $DestDir"
if (!(Test-Path $DestDir)) {
    New-Item -ItemType Directory -Force -Path $DestDir | Out-Null
}

Write-Host "Downloading portable Zig v$ZigVersion from: $ZipUrl"
try {
    Invoke-WebRequest -Uri $ZipUrl -OutFile $ZipFile -UserAgent "Mozilla/5.0"
} catch {
    Write-Error "Failed to download Zig compiler. Please verify internet connection."
    exit 1
}

Write-Host "Extracting Zig compiler ZIP..."
try {
    Expand-Archive -Path $ZipFile -DestinationPath $DestDir -Force
} catch {
    Write-Error "Extraction failed."
    exit 1
}

# Clean up ZIP
if (Test-Path $ZipFile) {
    Remove-Item $ZipFile -Force
}

# Find the executable directory inside the extracted zip content
$ZigExeDir = Get-ChildItem -Path $DestDir -Directory | Select-Object -First 1
$ZigExePath = Join-Path $ZigExeDir.FullName "zig.exe"

if (Test-Path $ZigExePath) {
    Write-Host "Local Zig compiler successfully installed!" -ForegroundColor Green
    Write-Host "Path: $ZigExePath" -ForegroundColor Green
    
    # Create the run-portable helper script
    $RunnerScript = @"
`$ZigDir = "$($ZigExeDir.FullName)"
`$env:Path = "`$ZigDir;" + `$env:Path
Write-Host "Running with local portable Zig..." -ForegroundColor Cyan
zig build run
"@
    
    $RunnerPath = Join-Path $PSScriptRoot "run-portable.ps1"
    Set-Content -Path $RunnerPath -Value $RunnerScript -Encoding utf8
    Write-Host "Created run script: $RunnerPath" -ForegroundColor Green
    Write-Host "You can now run: .\run-portable.ps1" -ForegroundColor Cyan
} else {
    Write-Error "Could not locate zig.exe in the extracted directory."
}
