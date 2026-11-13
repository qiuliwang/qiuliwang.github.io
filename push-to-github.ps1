# Publish this site to an existing GitHub repo (replaces old files, keeps history).
# Usage:  powershell -ExecutionPolicy Bypass -File .\push-to-github.ps1
# Optional: -Repo "user/repo" -Branch "master"
param(
    [string]$Repo = "qiuliwang/qiuliwang.github.io",
    [string]$Branch = "master"
)

$ErrorActionPreference = "Stop"
$src = $PSScriptRoot
$tmp = Join-Path $env:TEMP ("homepage-push-" + (Get-Random))

Write-Host "== clone $Repo" -ForegroundColor Cyan
git clone "https://github.com/$Repo.git" $tmp
if ($LASTEXITCODE -ne 0) { throw "git clone failed (network / proxy?)" }

Write-Host "== remove old files (history is kept in git)" -ForegroundColor Cyan
Get-ChildItem $tmp -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force

Write-Host "== copy new site" -ForegroundColor Cyan
Get-ChildItem $src -Force |
    Where-Object { $_.Name -notin @("node_modules", "_site", ".git") } |
    Copy-Item -Destination $tmp -Recurse -Force

Set-Location $tmp
if (-not (git config user.email)) { git config user.email "qiuliwang@users.noreply.github.com" }
if (-not (git config user.name))  { git config user.name "qiuliwang" }

Write-Host "== commit" -ForegroundColor Cyan
git add -A
git commit -m "replace with new academic homepage"
if ($LASTEXITCODE -ne 0) { throw "nothing to commit or commit failed" }

Write-Host "== push to $Branch" -ForegroundColor Cyan
git push origin $Branch
if ($LASTEXITCODE -ne 0) { throw "git push failed (proxy / credentials?)" }

Write-Host ""
Write-Host "Done. Next step on GitHub:" -ForegroundColor Green
Write-Host "  Settings -> Pages -> Build and deployment -> Source: GitHub Actions"
Write-Host "  Then wait ~2 minutes: https://qiuliwang.github.io"
