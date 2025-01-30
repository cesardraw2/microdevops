# Exemplo de uso: .\kill-port-process.ps1 -Port 8880:

param (
    [int]$Port
)

# Verificar se a porta foi fornecida
if (-not $Port) {
    Write-Output "Por favor, forneça a porta como parâmetro."
    exit
}

# Obter a linha que contém a porta fornecida
$netstatOutput = netstat -noa | Select-String ":$Port"

# Verificar se a porta está sendo usada
if ($netstatOutput) {
    # Extrair o PID da saída
    $processId = $netstatOutput -replace '.*\s(\d+)$','$1'
    
    # Verificar se o PID foi extraído corretamente
    if ($pid -match '^\d+$') {
        # Executar o taskkill com o PID extraído
        taskkill /pid $processId /f
        Write-Output "Processo com PID $processId foi finalizado."
    } else {
        Write-Output "PID não pôde ser extraído."
    }
} else {
    Write-Output "Nenhum processo encontrado na porta $Port."
}
