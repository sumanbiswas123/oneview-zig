$ZigDir = "C:\Users\SumanBiswas\Downloads\oneview_port\.zig-compiler\zig-x86_64-windows-0.16.0\zig-x86_64-windows-0.16.0"
$env:Path = "$ZigDir;" + $env:Path
Write-Host "Running with local portable Zig..." -ForegroundColor Cyan
zig build run
