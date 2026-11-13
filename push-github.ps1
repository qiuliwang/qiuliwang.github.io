# Push to GitHub when the default SSH route keeps getting reset.
# Tries ssh.github.com:443, then two US endpoints, then reports what to do next.
# Usage: powershell -ExecutionPolicy Bypass -File .\push-github.ps1

$repo = "qiuliwang/qiuliwang.github.io"
$attempts = @(
    @{ name = "ssh.github.com:443"; url = "ssh://git@ssh.github.com:443/$repo.git"; hostkey = "ssh.github.com" },
    @{ name = "140.82.113.35:443";  url = "ssh://git@140.82.113.35:443/$repo.git";  hostkey = "ssh.github.com" },
    @{ name = "140.82.112.3:443";   url = "ssh://git@140.82.112.3:443/$repo.git";   hostkey = "ssh.github.com" }
)

foreach ($a in $attempts) {
    Write-Host ""
    Write-Host "== try $($a.name)" -ForegroundColor Cyan
    $env:GIT_SSH_COMMAND = "ssh -p 443 -o HostKeyAlias=$($a.hostkey) -o StrictHostKeyChecking=accept-new -o ConnectTimeout=15"
    git remote set-url origin $a.url
    git push origin master
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "PUSH OK via $($a.name)" -ForegroundColor Green
        git remote set-url origin "git@github.com:$repo.git"
        Write-Host "remote restored to git@github.com:$repo.git"
        exit 0
    }
    Start-Sleep -Seconds 3
}

Write-Host ""
Write-Host "All SSH routes failed." -ForegroundColor Yellow
Write-Host "Next steps:"
Write-Host "  1. start Clash, then retry:  git push"
Write-Host "  2. or push over HTTPS with a Personal Access Token:"
Write-Host "     git remote set-url origin https://github.com/$repo.git"
Write-Host "     git -c http.proxy=http://127.0.0.1:7890 push -u origin master"
Write-Host "  3. make sure your public key is on GitHub:  ssh -T git@github.com"
