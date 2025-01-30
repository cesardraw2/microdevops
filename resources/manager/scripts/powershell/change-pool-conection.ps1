# Verificar se as credenciais já estão armazenadas na memória
if (-not $global:wsUsername) {
    $global:wsUsername = Read-Host -Prompt "Seu usuário do S.O:"
}

if (-not $global:wsPassword) {
    $securePassword = Read-Host -Prompt "Sua senha do S.O:" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    $global:wsPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

# Solicitar outros parâmetros
$testConnectionInterval = Read-Host -Prompt "Digite o intervalo em segundos (Ex:600):"
$reapRetryCount = Read-Host -Prompt "Digite a quantidade de tentativas (Ex:3):"

$connectionTestQuery = "SELECT 1 FROM SYSIBM.SYSDUMMY1"

$wsadminPath = "C:\Program Files\IBM\WebSphere\AppServer\bin\wsadmin.bat"

# Construir o script wsadmin para localizar o DataSource e o ConnectionPool associado e adicionar propriedades
$wsadminScript = @"
# Localizar o JDBCProvider
jdbcProvider = AdminConfig.getid('/Cell:cell01/Node:nd1/Server:server1/JDBCProvider:Derby JDBC Provider/')
print(jdbcProvider)

# Localizar o DataSource associado ao JDBCProvider
dataSource = AdminConfig.list('DataSource', jdbcProvider)
print(dataSource)

# Localizar o ConnectionPool associado ao DataSource
connectionPool = AdminConfig.showAttribute(dataSource, 'connectionPool')
print(connectionPool)

# Adicionar propriedades customizadas ao ConnectionPool
AdminConfig.create('Property', connectionPool, '[[name testConnectionInterval] [value $testConnectionInterval]]')
AdminConfig.create('Property', connectionPool, '[[name reapRetryCount] [value $reapRetryCount]]')
AdminConfig.create('Property', connectionPool, '[[name connectionTestQuery] [value \"$connectionTestQuery\"]]')
AdminConfig.save()
"@

# Salvar o script wsadmin em um arquivo temporário
$tempScriptPath = [System.IO.Path]::GetTempFileName() + ".py"
Set-Content -Path $tempScriptPath -Value $wsadminScript

# Executar o script wsadmin a partir do arquivo temporário
& $wsadminPath -conntype SOAP -user $global:wsUsername -password $global:wsPassword -f $tempScriptPath

# Remover o arquivo temporário
Remove-Item -Path $tempScriptPath

Write-Output "Propriedades customizadas do pool de conexões configuradas com sucesso."
