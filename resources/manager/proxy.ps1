# Caminho do arquivo hosts.ics e hosts
$hostsIcsPath = "C:\Windows\System32\drivers\etc\hosts.ics"
$hostsFilePath = "C:\Windows\System32\drivers\etc\hosts"

$scriptDirectory = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
$servicesFilePath = Join-Path -Path $scriptDirectory -ChildPath "services.json"

# Função para obter o IP da VM a partir do arquivo hosts.ics
function Get-VmIpFromHostsIcs {
    param (
        [string]$filePath
    )

    if ([string]::IsNullOrEmpty($filePath)) {
        Write-Host "Caminho do arquivo hosts.ics está vazio."
        return $null
    }

    if (Test-Path -Path $filePath) {
        $lines = Get-Content -Path $filePath
        foreach ($line in $lines) {
            if ($line -match "(\d{1,3}\.){3}\d{1,3}") {
                $ip = $matches[0]
                return $ip
            }
        }
    } else {
        Write-Host "Arquivo $filePath não encontrado."
    }

    return $null
}

# Função para configurar o redirecionamento de portas usando netsh
function Start-ReverseProxy {
    param (
        [int]$LocalPort,
        [string]$RemoteIp,
        [int]$RemotePort
    )

    Write-Host "Configurando redirecionamento de portas para localhost:${LocalPort} -> ${RemoteIp}:${RemotePort}..."
    $result = netsh interface portproxy add v4tov4 listenport=$LocalPort listenaddress=127.0.0.1 connectport=$RemotePort connectaddress=$RemoteIp
    if ($result -eq "") {
        Write-Host "Redirecionamento configurado: localhost:${LocalPort} -> ${RemoteIp}:${RemotePort}"
    } else {
        Write-Host "Erro ao configurar redirecionamento: $result"
    }
}

# Função para remover o redirecionamento de portas usando netsh
function Stop-ReverseProxy {
    param (
        [int]$LocalPort
    )

    Write-Host "Removendo redirecionamento de portas para localhost:${LocalPort}..."
    netsh interface portproxy delete v4tov4 listenport=$LocalPort listenaddress=127.0.0.1
    Write-Host "Redirecionamento removido: localhost:${LocalPort}"
}

# Função para atualizar o conteúdo do arquivo hosts
function AddToHostsFile {
    param (
        [string]$hostname,
        [string]$ip = "127.0.0.1",
        [ref]$hostsContent
    )

    $newEntry = "$ip`t$hostname"
    if ($hostsContent.Value -notcontains $newEntry) {
        $hostsContent.Value += $newEntry
    }
}

# Função para salvar o arquivo hosts atualizado
function SaveHostsFile {
    param (
        [array]$hostsContent
    )

    try {
        $hostsContent | Set-Content -Path $hostsFilePath -Force
        Write-Host "Arquivo hosts atualizado."
    } catch {
        Write-Host "Erro ao atualizar o arquivo hosts: $_"
    }
}

# Função para verificar conectividade com externalHost
function Test-ExternalHost {
    param (
        [string]$hostname
    )

    try {
        $pingResult = Test-Connection -ComputerName $hostname -Count 1 -ErrorAction Stop
        Write-Host "$hostname está acessível."
    } catch {
        Write-Host "Falha ao acessar $hostname."
    }
}

# Obter o IP atual da VM
$vmIp = Get-VmIpFromHostsIcs -filePath $hostsIcsPath

if ($vmIp) {
    Write-Host "Iniciando configuração de proxies reversos. IP da VM: $vmIp"

    # Verificar se o arquivo services.json existe
    if (-Not (Test-Path $servicesFilePath)) {
        Write-Host "Arquivo services.json não encontrado: $servicesFilePath"
        exit 1
    }

    # Ler o arquivo services.json
    $servicesJson = Get-Content -Path $servicesFilePath -Raw
    $services = ($servicesJson | ConvertFrom-Json).services

    # Inicializar conteúdo do arquivo hosts
    $hostsContent = Get-Content -Path $hostsFilePath -ErrorAction Stop

    # Inicializar porta local
    $localPort = 8080

    # Configurar proxies reversos para cada serviço
    foreach ($service in $services) {
        $internalHostName = $service.internalHostName
        $externalHostName = $service.externalHostName
        $internalPort = $service.internalPort
        $externalPort = $localPort

        Write-Host "Configurando serviço: $($service.name)"
        Write-Host "InternalHostName: $internalHostName"
        Write-Host "ExternalHostName: $externalHostName"
        Write-Host "InternalPort: $internalPort"
        Write-Host "ExternalPort: $externalPort"

        if (-not $internalHostName -or -not $externalHostName -or -not $internalPort -or -not $externalPort) {
            Write-Host "Configuração inválida para um dos serviços no arquivo JSON."
            continue
        }

        # Adicionar entrada no arquivo hosts
        AddToHostsFile -hostname $externalHostName -hostsContent ([ref]$hostsContent)

        # Configurar redirecionamento de portas
        Start-ReverseProxy -LocalPort $externalPort -RemoteIp $vmIp -RemotePort $internalPort

        # Incrementar a porta local para o próximo serviço
        $localPort++

        # Verificar conectividade com externalHost
        Test-ExternalHost -hostname $externalHostName
    }

    # Salvar o arquivo hosts atualizado
    SaveHostsFile -hostsContent $hostsContent

    Write-Host "Proxies reversos configurados com sucesso."
} else {
    Write-Host "Não foi possível obter o IP da VM a partir do arquivo hosts.ics"
}

# Adicionar um manipulador de evento para remover os redirecionamentos ao sair do PowerShell
Register-EngineEvent PowerShell.Exiting -Action {
    foreach ($service in $services) {
        Stop-ReverseProxy -LocalPort $service.externalPort
    }
}