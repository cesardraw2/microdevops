# Verificar se as credenciais já estão armazenadas na memória
if (-not $global:wsUsername) {
    $global:wsUsername = Read-Host -Prompt "Seu usuário do S.O:"
}

if (-not $global:wsPassword) {
    $securePassword = Read-Host -Prompt "Sua senha do S.O:" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    $global:wsPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

# Solicitar o caminho do arquivo EAR ou WAR
$appFilePath = Read-Host -Prompt "Digite o caminho do arquivo EAR ou WAR do aplicativo:"

# Nome do aplicativo no WebSphere
$appName = Read-Host -Prompt "Digite o nome do aplicativo no WebSphere:"

# Caminho para wsadmin
$wsadminPath = "C:\Program Files\IBM\WebSphere\AppServer\bin\wsadmin.bat"

# Construir o script wsadmin para atualizar o aplicativo
$wsadminScript = @"
# Parar o aplicativo antes da atualização
AdminApplication.stopApplication('$appName')

# Atualizar o aplicativo
AdminApp.update('$appName', 'app', '[-operation update -contents $appFilePath]')

# Salvar a configuração
AdminConfig.save()

# Iniciar o aplicativo após a atualização
AdminApplication.startApplication('$appName')
"@

# Salvar o script wsadmin em um arquivo temporário
$tempScriptPath = [System.IO.Path]::GetTempFileName() + ".py"
Set-Content -Path $tempScriptPath -Value $wsadminScript

# Executar o script wsadmin a partir do arquivo temporário
& $wsadminPath -conntype SOAP -user $global:wsUsername -password $global:wsPassword -f $tempScriptPath

# Remover o arquivo temporário
Remove-Item -Path $tempScriptPath

Write-Output "Aplicativo atualizado com sucesso."
