# Build script for The Last IceyPop -> Aurora launcher drop-in folder.
#
# Usage:
#   pwsh ./build.ps1
#
# Prereqs (Windows dev box):
#   - Rust toolchain (rustup, msvc target):  https://rustup.rs
#   - Tauri CLI:                              cargo install tauri-cli --version "^2"
#   - WebView2 SDK is pulled automatically by Tauri's build.
#
# Output:
#   dist/the-last-icey/
#     ├── the-last-icey.exe
#     ├── launcher.json
#     └── README.md
#
# This folder is what the Aurora launcher drops into
# %LOCALAPPDATA%\Aurora\Games\the-last-icey\.

$ErrorActionPreference = "Stop"

$repoRoot   = $PSScriptRoot
$srcTauri   = Join-Path $repoRoot "src-tauri"
$iconsDir   = Join-Path $srcTauri "icons"
$iconSource = Join-Path $repoRoot "web/assets/images/icee-icee2.png"
$distRoot   = Join-Path $repoRoot "dist"
$dropFolder = Join-Path $distRoot "the-last-icey"

# 1. Generate icons on first build (cached after that)
$icoPath = Join-Path $iconsDir "icon.ico"
if (-not (Test-Path $icoPath)) {
    Write-Host "[build] generating icons from $iconSource ..." -ForegroundColor Cyan
    Push-Location $srcTauri
    try {
        cargo tauri icon $iconSource
    } finally {
        Pop-Location
    }
}

# 2. Build the Tauri app (produces target/release/the-last-icey.exe)
Write-Host "[build] running cargo tauri build ..." -ForegroundColor Cyan
Push-Location $srcTauri
try {
    cargo tauri build --no-bundle
} finally {
    Pop-Location
}

# 3. Assemble the launcher drop-in folder
Write-Host "[build] assembling dist/the-last-icey/ ..." -ForegroundColor Cyan
if (Test-Path $dropFolder) {
    Remove-Item -Recurse -Force $dropFolder
}
New-Item -ItemType Directory -Path $dropFolder | Out-Null

$builtExe = Join-Path $srcTauri "target/release/the-last-icey.exe"
if (-not (Test-Path $builtExe)) {
    throw "Built exe not found at $builtExe — check cargo tauri build output."
}

Copy-Item $builtExe                              (Join-Path $dropFolder "the-last-icey.exe")
Copy-Item (Join-Path $repoRoot "launcher.json")   (Join-Path $dropFolder "launcher.json")
Copy-Item (Join-Path $repoRoot "dist-readme.md")  (Join-Path $dropFolder "README.md")

$exeSize = (Get-Item (Join-Path $dropFolder "the-last-icey.exe")).Length / 1MB
Write-Host ""
Write-Host "[build] done." -ForegroundColor Green
Write-Host "        drop folder:   $dropFolder"
Write-Host ("        exe size:      {0:N1} MB" -f $exeSize)
Write-Host ""
Write-Host "Zip the drop folder or copy it into Aurora's Games directory."
