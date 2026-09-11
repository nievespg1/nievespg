# Runs on Windows before container creation/start. Never print the token.
$ErrorActionPreference = 'Stop'
$authDirectory = Join-Path $env:APPDATA 'nievespg-devcontainer\gh'
$null = New-Item -ItemType Directory -Path $authDirectory -Force

# Restrict the exported credential to this Windows user and SYSTEM.
$acl = New-Object System.Security.AccessControl.DirectorySecurity
$acl.SetAccessRuleProtection($true, $false)
$currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().User
foreach ($sid in @($currentUser, [System.Security.Principal.SecurityIdentifier]::new('S-1-5-18'))) {
    $rule = [System.Security.AccessControl.FileSystemAccessRule]::new(
        $sid, 'FullControl', 'ContainerInherit, ObjectInherit', 'None', 'Allow')
    $acl.AddAccessRule($rule)
}
# Persist only the modified DACL. PowerShell's Set-Acl can also try to write
# audit security information, which requires SeSecurityPrivilege.
[System.IO.Directory]::SetAccessControl($authDirectory, $acl)

$authFile = Join-Path $authDirectory 'hosts.yml'
$utf8 = New-Object System.Text.UTF8Encoding($false)
# Clear any previous token if the host login is no longer available.
[System.IO.File]::WriteAllText($authFile, '', $utf8)
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Warning 'GitHub CLI is unavailable on Windows; skipping credential export.'
    exit 0
}
try {
    $ErrorActionPreference = 'Continue'
    $token = & gh auth token --hostname github.com 2>$null
} finally {
    $ErrorActionPreference = 'Stop'
}
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($token)) {
    Write-Warning 'No Windows GitHub.com token available. Run gh auth login on Windows, then reopen the container.'
    exit 0
}
try {
    $quotedToken = ConvertTo-Json -InputObject $token.Trim() -Compress
    [System.IO.File]::WriteAllText($authFile, "github.com:`n    oauth_token: $quotedToken`n    git_protocol: https`n", $utf8)
} finally {
    $token = $null
    $quotedToken = $null
}
Write-Output 'GitHub CLI credentials exported outside the repository for the devcontainer.'
