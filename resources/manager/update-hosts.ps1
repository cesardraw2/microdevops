# Lê o conteúdo do arquivo hosts.ics.
# Procura pela entrada que corresponde a dev-server.mshome.net e extrai o endereço IP associado.
# Lê o arquivo hosts e procura por uma entrada existente para desenv.local.
# Substitui a entrada existente ou adiciona uma nova entrada com o IP e desenv.local.

$hostsIcsPath = "C:\Windows\System32\drivers\etc\hosts.ics"
$hostsPath = "C:\Windows\System32\drivers\etc\hosts"
$targetHost = "dev-server.mshome.net"
$targetEntryRegex = "$targetHost\s*$"

function Get-DevServerEntry {
    $content = Get-Content -Path $hostsIcsPath
    foreach ($line in $content) {
        if ($line -match "(\d+\.\d+\.\d+\.\d+)\s+dev-server.mshome.net") {
            return $matches[1] + " " + $matches[2]
        }
    }
    return $null
}

function Update-HostsFile {
    $devServerEntry = Get-DevServerEntry
    if ($null -eq $devServerEntry) {
        Write-Host "dev-server.mshome.net entry not found in hosts.ics"
        return
    }

    $currentContent = Get-Content -Path $hostsPath
    $newContent = @()
    $entryFound = $false

    foreach ($line in $currentContent) {
        if ($line -match $targetEntryRegex) {
            $newContent += $devServerEntry + " " + $targetHost
            $entryFound = $true
        } else {
            $newContent += $line
        }
    }

    if (-not $entryFound) {
        $newContent += $devServerEntry + " " + $targetHost
    }

    $newContent | Set-Content -Path $hostsPath
    Write-Host "hosts file updated with: $devServerEntry $targetHost"
}

while ($true) {
    Update-HostsFile
    Start-Sleep -Seconds 600
}
