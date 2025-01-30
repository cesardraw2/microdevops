param (
    [string]$FunctionName,
    [int]$proxyId
)

# Título do instalador
Write-Host "Instalador do Ambiente Local - SICOOB"


# Atualizado para usar o diretório atual onde install.ps1 está localizado
$INSTALLER_PATH = "."

# Definição de variáveis de ambiente
$ENVIRONMENT_PATH = "."
$CONTAINERS_PATH = "$ENVIRONMENT_PATH/containers"
$TOOLS_PATH = "$CONTAINERS_PATH/tools"



$MQ_PATH = "$TOOLS_PATH/mq"
$DB_PATH = "$CONTAINERS_PATH/db"
$SSO_PATH = "$TOOLS_PATH/sso"
$PROXY_PATH = "$TOOLS_PATH/servers/proxy"
$ADMINER_PATH = "$TOOLS_PATH/db/adminer"
$PORTAINER_PATH = "$TOOLS_PATH/system/portainer"
$WS_LIBERTY_PATH = "$TOOLS_PATH/servers/ws-liberty"
$MONITORING_PATH = "$TOOLS_PATH/system/monitoring/glances"
$ANGULAR_POC_PATH = "$CONTAINERS_PATH/app/frontend/angular-poc-app"
$WS_OPEN_LIBERTY_PATH_APP = "C:\Users\antonio.cesar\desenv\projects\estudo\java\open-liberty\getting-started\finish"

$SERVER_NAME = "dev-server"
$VM_HOST = "$SERVER_NAME.mshome.net"
$VM_HOST_API_TEST = "http://$VM_HOST"
$VM_CONTAINERS_PATH = "/home/ubuntu/containers"

$VM_DB_PATH = "$VM_CONTAINERS_PATH/db"
$VM_TOOLS_PATH = "$VM_CONTAINERS_PATH/tools"
$VM_SERVERS_PATH = "$VM_TOOLS_PATH/servers"
$VM_FRONTEND_APP_PATH = "$VM_CONTAINERS_PATH/app/frontend"
$VM_BACKEND_APP_PATH = "$VM_CONTAINERS_PATH/app/backend"

$SSH_KEY_PATH = "$HOME/.ssh/id_rsa_multipass"


$JAVA_VERSION = "11"  # Pode ser "8", "11" ou "17"

# Obtendo data e hora atual
$dt = Get-Date -Format "yyyyMMddHHmmss"

# Log file
$LOG_FILE = "$dt.log"

#Configurações de proxy reverso da máquina host.
$global:proxyProcessId = $null
$proxyFilePath = "$ENVIRONMENT_PATH/ui/micro-devops-app/redbird-server/server.js"
$NODE_INTERPRETER_PATH = "C:\Users\antonio.cesar\AppData\Roaming\JetBrains\IntelliJIdea2024.1\node\node-v20.13.1-win-x64\node.exe"


# Função para verificar e habilitar o Hyper-V
function EnsureHyperV {
    $hyperV = Get-WindowsOptionalFeature -FeatureName Microsoft-Hyper-V-All -Online
    
    if ($hyperV.State -ne "Enabled") {
        Write-Host "Hyper-V não está habilitado. Tentando habilitar o Hyper-V..."
        try {
            Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
            Write-Host "Hyper-V habilitado com sucesso. Um reinício pode ser necessário."
            Start-Sleep -Seconds 5
            return $true
        } catch {
            Write-Host "Falha ao habilitar o Hyper-V. Por favor, habilite o Hyper-V manualmente."
            return $false
        }
    } else {
        Write-Host "Hyper-V já está habilitado."
        return $true
    }
}

function Init {
    Write-Host "Inicializando o Instalador... $CONTAINERS_PATH"
	enableMOuntVolumesInMultipass
    StartInstall
}

function enableMOuntVolumesInMultipass(){
	multipass set local.privileged-mounts=on
}

function StartInstall {
    Add-Content $LOG_FILE "Inicializando o Instalador..."
    ShowStartTime
    CreateServer
    ConfigureLinux
    ValidateInstalation
	
    ShowEndTime
    Add-Content $LOG_FILE "FIM"
}

function TestTimeCount{
	ShowStartTime
	ShowEndTime
}

function ShowStartTime {
    $global:startTime = Get-Date
	return $global:startTime
    Add-Content $LOG_FILE "Start Time: $global:startTime"
}

function ShowEndTime {
    $endTime = Get-Date
    $timeTaken = $endTime - $global:startTime
    $timeTakenSeconds = [math]::Floor($timeTaken.TotalSeconds)
    Add-Content $LOG_FILE "End Time: $endTime"
    Add-Content $LOG_FILE "Tempo total: $timeTakenSeconds sec."
}

function ValidateInstalation {
    $pingSuccess = PingHostVM
    if ($pingSuccess) {
        Add-Content $LOG_FILE "Ping foi bem-sucedido, continuando a instalação."
        ContinueInstalation
    } else {
        Add-Content $LOG_FILE "Não foi possível acessar o HOST da VM via ping, verificando conectividade..."
		return
        # @TODO adicionar mais lógica de verificação ou apenas finalizar.
        #ContinueInstalation
    }
}

function PingHostVM {
    Add-Content $LOG_FILE "Testando o host da VM via ping..."
    try {
        $ping = Test-Connection -ComputerName $VM_HOST -Count 1 -Quiet
        if ($ping) {
            Add-Content $LOG_FILE "Ping para o HOST ${VM_HOST} foi bem-sucedido."
            return $true
        } else {
            Add-Content $LOG_FILE "Ping para o HOST ${VM_HOST} falhou."
            return $false
        }
    } catch {
        Add-Content $LOG_FILE "Erro ao tentar pingar o HOST ${VM_HOST}: $_"
        return $false
    }
}

function TestHostVM {
    Add-Content $LOG_FILE "Testando o host da VM antes de prosseguir..."
    try {
        $HTTP_Request = Invoke-WebRequest -Uri $VM_HOST_API_TEST -Method Get -TimeoutSec 5 -UseBasicParsing
        if ($HTTP_Request.StatusCode -eq 200) {
            Add-Content $LOG_FILE "A comunicação com o HOST está OK."
            exit 1
        } else {
            Add-Content $LOG_FILE "ERRO na comunicação com o HOST, status code: $($HTTP_Request.StatusCode)."
            exit 0
        }
    } catch {
        Add-Content $LOG_FILE "ERRO na comunicação com o HOST: $_"
        exit 0
    }
}



function ShowInternalInterfaces {
    Write-Host "8 - Interfaces internas ::::::::::::"
    try {
        & multipass exec dev-server -- ip -br address show scope global
    } catch {
        Write-Host "Não foi possível mostrar interfaces internas. A VM 'dev-server' pode not exist."
    }
}

function ContinueInstalation {
    CreateDefaultFoldersToVolumes
    CreateDefaultContainers
    #ShowInfoServer
    ShowInternalInterfaces
    #TestContainerCommunication
	StartProxyServer
}
function CreateDefaultFoldersToVolumes {
    Add-Content $LOG_FILE "Criando diretórios para os volumes que contém os arquivos do container"
    if (ServerExists) {
        & multipass exec $SERVER_NAME -- sudo mkdir -p "$VM_CONTAINERS_PATH"
        & multipass exec $SERVER_NAME -- sudo mkdir -p "$VM_DB_PATH"
        & multipass exec $SERVER_NAME -- sudo mkdir -p "$VM_FRONTEND_APP_PATH"
        & multipass exec $SERVER_NAME -- sudo mkdir -p "$VM_BACKEND_APP_PATH"
        & multipass exec $SERVER_NAME -- sudo mkdir -p "$VM_BACKEND_APP_PATH/java/poc/open-liberty"
		& multipass exec $SERVER_NAME -- sudo mkdir -p "$VM_TOOLS_PATH"
        & multipass exec $SERVER_NAME -- sudo mkdir -p "$VM_TOOLS_PATH/system/monitoring"
        & multipass exec $SERVER_NAME -- sudo mkdir -p "$VM_TOOLS_PATH/db"
        & multipass exec $SERVER_NAME -- sudo mkdir -p "$VM_SERVERS_PATH"
        & multipass exec $SERVER_NAME -- sudo mkdir -p "$VM_SERVERS_PATH/proxy"
		
		Add-Content $LOG_FILE "Diretórios criados."

    } else {
        Write-Host "A VM '$SERVER_NAME' não está pronta para montar volumes."
    }
}


function CreateDefaultContainers {
    Add-Content $LOG_FILE "Criando os contêineres padrões..."
    CreatePortainerContainer
	CreateProxyContainer
    CreateMonitoringContainer
    CreateSsoContainer
    CreateAdminerContainer
    CreateAngularPOCContainer
    CreateMQContainer
    CreateOpenLibertyContainer
    CreateJaegerContainer
	CreatePrometheusContainer
}

function CreatePortainerContainer {
    Add-Content $LOG_FILE "Criando container Portainer..."
    & multipass mount $PORTAINER_PATH ${SERVER_NAME}:${VM_TOOLS_PATH}"/system/portainer"
	Add-Content $LOG_FILE "Executar o docker-compose do Portainer na VM"
	multipass exec $SERVER_NAME -- docker volume create --name=portainer_data
	multipass exec $SERVER_NAME -- docker-compose -f "$VM_TOOLS_PATH/system/portainer/docker-compose.yml" up -d
}

function MountMonitoringVolume(){
	& multipass mount $MONITORING_PATH ${SERVER_NAME}:${VM_TOOLS_PATH}"/system/monitoring"
}

function CreateMonitoringContainer {
    Add-Content $LOG_FILE "Criando container Monitoring..."
    MountMonitoringVolume
	Add-Content $LOG_FILE "Executar o docker-compose do Monitoring na VM"
	multipass exec $SERVER_NAME -- docker-compose -f "$VM_TOOLS_PATH/system/monitoring/docker-compose.yml" up -d
}

function CreateProxyContainer {
    Add-Content $LOG_FILE "Criando container Proxy..."
    & multipass mount $PROXY_PATH ${SERVER_NAME}:${VM_SERVERS_PATH}"/proxy"
	Add-Content $LOG_FILE "Executar o docker-compose do Proxy na VM"
	multipass exec $SERVER_NAME -- docker-compose -f "$VM_SERVERS_PATH/proxy/traefik/docker-compose.yml" up -d
}

function CreateSsoContainer {
    Add-Content $LOG_FILE "Criando container SSO..."
    & multipass mount $SSO_PATH ${SERVER_NAME}:${VM_TOOLS_PATH}"/sso"
}

function CreateAdminerContainer {
    Add-Content $LOG_FILE "Criando container Adminer..."
    & multipass mount $ADMINER_PATH ${SERVER_NAME}:${VM_TOOLS_PATH}"/db/adminer"
	multipass exec $SERVER_NAME -- docker-compose -f "$VM_TOOLS_PATH/db/adminer/docker-compose.yml" up -d
}

function CreateAngularPOCContainer {
    Add-Content $LOG_FILE "Criando container AngularPOC..."
    & multipass mount $ANGULAR_POC_PATH ${SERVER_NAME}:${VM_FRONTEND_APP_PATH}"/angular-poc-app"
	& multipass exec $SERVER_NAME -- docker-compose -f "$VM_FRONTEND_APP_PATH/angular-poc-app/docker-compose.yml" up -d
}

function CreateMQContainer {
    Add-Content $LOG_FILE "Criando container MQ..."
    & multipass mount $MQ_PATH ${SERVER_NAME}:${VM_TOOLS_PATH}"/mq"
}

function CreateWASTraditionalContainer {
    Add-Content $LOG_FILE "Criando container WASTraditional..."
    & multipass mount $WS_LIBERTY_PATH ${SERVER_NAME}:${VM_TOOLS_PATH}"/was-traditional"
}

function CreateWASLibertyContainer {
    Add-Content $LOG_FILE "Criando container WSLiberty..."
    & multipass mount $WS_LIBERTY_PATH ${SERVER_NAME}:${VM_TOOLS_PATH}"/was-liberty"
}

function CreateOpenLibertyContainer {
    Add-Content $LOG_FILE "Criando container WSLiberty..."
    
    if (Test-Path -Path $WS_OPEN_LIBERTY_PATH_APP) {
        $mountCommand = "multipass mount `"$WS_OPEN_LIBERTY_PATH_APP`" `"${SERVER_NAME}:${VM_BACKEND_APP_PATH}/java/poc/open-liberty`""
        Invoke-Expression $mountCommand
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Montagem concluída com sucesso."
            Add-Content $LOG_FILE "Montagem concluída com sucesso."
            GenerateKeystore -vmName $SERVER_NAME -keystorePath "$VM_BACKEND_APP_PATH/java/poc/open-liberty/src/main/liberty/config"
            RunOpenLibertyContainer
        } else {
            Write-Host "Falha ao montar o volume."
            Add-Content $LOG_FILE "Erro: Falha ao montar o volume."
        }
    } else {
        Write-Host "O caminho da fonte $WS_OPEN_LIBERTY_PATH_APP não existe."
        Add-Content $LOG_FILE "Erro: O caminho da fonte $WS_OPEN_LIBERTY_PATH_APP não existe."
    }
}

function UnmountOpenLibertyVolume {
    Write-Host "Desmontando o volume..."
    & multipass umount ${SERVER_NAME}:${VM_BACKEND_APP_PATH}"/java/poc/open-liberty"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Desmontagem concluída com sucesso."
        Add-Content $LOG_FILE "Desmontagem concluída com sucesso."
    } else {
        Write-Host "Falha ao desmontar o volume."
        Add-Content $LOG_FILE "Erro: Falha ao desmontar o volume."
    }
}





function ConfigureLinux {
    Add-Content $LOG_FILE "VM Inicializada, inicializando configuração do Linux..."
    
    if (-not (Test-Path "$INSTALLER_PATH/setup-instance.sh")) {
        Write-Host "O arquivo setup-instance.sh não existe em $INSTALLER_PATH"
        return
    }
    
    if (-not (Test-Path "$INSTALLER_PATH/update-linux.sh")) {
        Write-Host "O arquivo update-linux.sh não existe em $INSTALLER_PATH"
        return
    }
    
    TransferDefaultFilesToVM
    SetPermissionsInDefaultFiles
    
    # Verificar se os scripts estão presentes antes de executar
    if (ServerExists) {
        & multipass exec $SERVER_NAME -- bash -c "if [ -f /tmp/setup-instance.sh ]; then sh -x /tmp/setup-instance.sh; else echo 'setup-instance.sh not found'; fi"
        & multipass exec $SERVER_NAME -- bash -c "if [ -f /tmp/update-linux.sh ]; then sh -x /tmp/update-linux.sh; else echo 'update-linux.sh not found'; fi"
		ConfigureJavaEnviroment
	
	} else {
        Write-Host "A VM '$SERVER_NAME' não está acessível para configurar o Linux."
    }
}

function ConfigureJavaEnviroment{
	
		# Atualizar pacotes e instalar Java e Maven na VM
		Write-Host "Instalando pacotes na VM $SERVER_NAME..."
		& multipass exec $SERVER_NAME -- sudo apt-get update -y
		& multipass exec $SERVER_NAME -- sudo apt-get upgrade -y

		# Instalar JDK 8
		Write-Host "Instalando JDK 8..."
		& multipass exec $SERVER_NAME -- sudo apt-get install -y openjdk-8-jdk

		# Instalar JDK 11
		Write-Host "Instalando JDK 11..."
		& multipass exec $SERVER_NAME -- sudo apt-get install -y openjdk-11-jdk

		# Instalar JDK 17
		Write-Host "Instalando JDK 17..."
		& multipass exec $SERVER_NAME -- sudo apt-get install -y openjdk-17-jdk

		# Configurar alternatives para gerenciar as versões do Java
		Write-Host "Configurando alternatives para Java..."
		& multipass exec $SERVER_NAME -- sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-8-openjdk-amd64/bin/java 1081
		& multipass exec $SERVER_NAME -- sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-11-openjdk-amd64/bin/java 1111
		& multipass exec $SERVER_NAME -- sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-17-openjdk-amd64/bin/java 1171

		SetJavaVersion -SERVER_NAME $SERVER_NAME -JAVA_VERSION 11

		# Instalar Maven
		Write-Host "Instalando Maven..."
		& multipass exec $SERVER_NAME -- sudo apt-get install -y maven

		# Verificar instalações
		Write-Host "Verificando as instalações..."
		& multipass exec $SERVER_NAME -- java -version
		& multipass exec $SERVER_NAME -- mvn -version

		Write-Host "Configuração do JAVA concluída."
	
}

#Exemplo de uso: SetJavaVersion -SERVER_NAME dev-server -JAVA_VERSION 11
function SetJavaVersion {
    param (
        [string]$SERVER_NAME,
        [string]$JAVA_VERSION
    )

    # Verificar se a versão do Java é suportada
    if ($JAVA_VERSION -notin @("8", "11", "17")) {
        Write-Host "Versão do Java não suportada. Use 8, 11 ou 17."
        return
    }

    # Construir o caminho do Java dinamicamente
    $javaPath = "/usr/lib/jvm/java-$JAVA_VERSION-openjdk-amd64/bin/java"
    
    # Definir a versão padrão do Java
    Write-Host "Definindo a versão padrão do Java como JDK $JAVA_VERSION..."
    multipass exec $SERVER_NAME -- sudo update-alternatives --set java $javaPath
}

function TransferDefaultFilesToVM {
    Add-Content $LOG_FILE "Transferindo arquivos para a VM"
    if (ServerExists) {
        & multipass transfer "$INSTALLER_PATH/setup-instance.sh "${SERVER_NAME}:"/tmp/setup-instance.sh"
        & multipass transfer "$INSTALLER_PATH/update-linux.sh "${SERVER_NAME}:"/tmp/update-linux.sh"
    } else {
        Write-Host "A VM '$SERVER_NAME' não está pronta para receber arquivos."
		return
    }
}

function SetPermissionsInDefaultFiles {
    if (ServerExists) {
        Add-Content $LOG_FILE "Aplicando permissões e executando arquivos na VM"
        & multipass exec $SERVER_NAME -- chmod +x /tmp/setup-instance.sh
        & multipass exec $SERVER_NAME -- chmod +x /tmp/update-linux.sh
    } else {
        Write-Host "A VM '$SERVER_NAME' não está pronta para configurar permissões."
		return
    }
}





	function GenerateKeystore {
		param (
			[string]$vmName,
			[string]$keystorePath
		)

		Write-Host "Gerando keystore na VM $vmName..."
		#TODO aumentar a expiração do keystore
		$command = "keytool -genkeypair -alias liberty -keyalg RSA -keystore $keystorePath/keystore.jks -storepass changeit -validity 365 -keysize 2048"
		& multipass exec $vmName -- bash -c $command

		if ($LASTEXITCODE -eq 0) {
			Write-Host "Keystore gerado com sucesso em $keystorePath."
		} else {
			Write-Host "Falha ao gerar o keystore."
		}
	}

# Roda a aplicação no open-liberty dentro de um container construído a partir do docker-compose
function RunOpenLibertyContainer {
    Write-Host "Verificando se o container open-liberty está em execução..."
    if (IsContainerRunning -containerName "open-liberty") {
        StopAndRemoveContainer -containerName "open-liberty"
    }

    Write-Host "Construindo o projeto e iniciando Docker Compose..."
    & multipass exec $SERVER_NAME -- bash -c "cd $VM_BACKEND_APP_PATH/java/poc/open-liberty && mvn clean package && docker-compose up -d --build"
}

# Roda a aplicação no open-liberty dentro de um container construído a partir do Dockerfile (não usa o docker-compose pra isso)
function ExecuteLibertAppDev{	
	Write-Host "Verificando se o container open-liberty está em execução..."
    if (IsContainerRunning -containerName "open-liberty") {
        StopAndRemoveContainer -containerName "open-liberty"
    }
	& multipass exec $SERVER_NAME -- bash -c "cd $VM_BACKEND_APP_PATH/java/poc/open-liberty && mvn liberty:devc"	
}


function CreateJaegerContainer {
    Add-Content $LOG_FILE "Criando container Jaeger..."
    & multipass mount $PROXY_PATH ${SERVER_NAME}:${VM_TOOLS_PATH}"/system/monitoring/jaeger"
	Add-Content $LOG_FILE "Executar o docker-compose do Gerenciador de Rastreamento na VM"
	multipass exec $SERVER_NAME -- docker-compose -f "$VM_TOOLS_PATH/system/monitoring/jaeger/docker-compose.yml" up -d
}

function CreatePrometheusContainer {
    Add-Content $LOG_FILE "Criando container Prometheus..."
    & multipass mount $PROXY_PATH ${SERVER_NAME}:${VM_TOOLS_PATH}"/system/monitoring/prometheus"
	Add-Content $LOG_FILE "Executar o docker-compose do Gerenciador de Métricas na VM"
	multipass exec $SERVER_NAME -- docker-compose -f "$VM_TOOLS_PATH/system/monitoring/prometheus/docker-compose.yml" up -d
}


# Função para verificar se o container está em execução
function IsContainerRunning {
    param (
        [string]$containerName
    )

    $result = & multipass exec $SERVER_NAME -- docker ps --filter "name=$containerName" --filter "status=running" --format "{{.Names}}"
    return $result -eq $containerName
}

# Função para parar e remover o container
function StopAndRemoveContainer {
    param (
        [string]$containerName
    )

    Write-Host "Parando e removendo o container $containerName..."
    & multipass exec $SERVER_NAME -- docker stop $containerName
    & multipass exec $SERVER_NAME -- docker rm $containerName
}

# Função para verificar a existência da VM
function ServerExists {
    try {
        $VMs = & multipass list
        return $VMs -match "$SERVER_NAME"
    } catch {
        return $false
    }
}

# Função para excluir a VM
function DeleteServer {
    if (ServerExists) {
        Write-Host "VM '$SERVER_NAME' encontrada. Excluindo..."
        & multipass stop $SERVER_NAME
        & multipass delete $SERVER_NAME
        & multipass purge
        Write-Host "VM '$SERVER_NAME' excluída."
    } else {
        Write-Host "VM '$SERVER_NAME' não existe."
    }
}

# Função para criar a VM
function CreateServer {
    Write-Host "Criando a VM $SERVER_NAME [Ubuntu Server | cpus: 3 | mem: 4G | disk: 50G]"
    if (ServerExists) {
        DeleteServer
    }
    # Tenta habilitar o Hyper-V se não estiver habilitado
    if (-not (EnsureHyperV)) {
        Write-Host "Não foi possível habilitar o Hyper-V. Abortando a criação da VM."
        return
    }
    try {
        & multipass launch --name $SERVER_NAME --cpus 3 --memory 4G --disk 50G --cloud-init cloud-init.yaml
        Start-Sleep -Seconds 10  # Garante que a VM tenha tempo para inicializar
        ShowInternalInterfaces
    } catch {
        Write-Host "Falha ao lançar a VM '$SERVER_NAME'. Tentando habilitar o Hyper-V e relançar a VM."
        if (EnsureHyperV) {
            try {
                & multipass launch --name $SERVER_NAME --cpus 3 --mem 4G --disk 50G
                ShowInternalInterfaces
            } catch {
                Write-Host "Falha persistente ao lançar a VM '$SERVER_NAME' após habilitar o Hyper-V."
            }
        }
    }
}

# Função para iniciar o servidor proxy
function StartProxyServerOld {
    $process = Start-Process -FilePath $NODE_INTERPRETER_PATH -ArgumentList $proxyFilePath -PassThru -NoNewWindow
    if ($process -and $process.Id) {
        $global:proxyProcessId = $process.Id
        Write-Host "Iniciado o processo Node.js com ID $($global:proxyProcessId)"
    } else {
        Write-Host "Falha ao iniciar o processo Node.js."
    }
}

# Função para iniciar o servidor proxy
function StartProxyServer {
	$tempLogFile = [System.IO.Path]::GetTempFileName()
    $process = Start-Process -FilePath $NODE_INTERPRETER_PATH -ArgumentList $proxyFilePath -PassThru -NoNewWindow -RedirectStandardOutput "NUL" -RedirectStandardError $tempLogFile

    if ($process) {
        $global:proxyProcessId = $process.Id
        Write-Host "Iniciado o processo Node.js com ID $($global:proxyProcessId) arquivo de Log: $tempLogFile"
    } else {
        Write-Host "Falha ao iniciar o processo Node.js."
    }
}

# Função para parar o servidor proxy
#Ex: powershell .\install.ps1 -FunctionName StopProxyServer -proxyId 49020
function StopProxyServer {
    param (
        [int]$proxyId
    )
	
    Write-Host "Vamos finalizar o processo Node.js com ID $proxyId"
	
    # Use o ID de processo fornecido ou o ID global
    $processIdToStop = if ($PSBoundParameters.ContainsKey('proxyId')) { $proxyId } else { $global:proxyProcessId }

    Write-Host "Tentando finalizar o processo Node.js com ID $($processIdToStop)"
    if ($null -ne $processIdToStop) {
        Stop-Process -Id $processIdToStop
        Write-Host "Processo Node.js com ID $processIdToStop finalizado."
        
        # Limpe a variável global se o ID de processo for o global
        if ($processIdToStop -eq $global:proxyProcessId) {
            $global:proxyProcessId = $null
        }
    } else {
        Write-Host "Nenhum processo Node.js ativo encontrado para finalizar."
    }
}

function GenerateCertPem {
    # Definir o diretório onde os certificados serão gerados
    $certsDir = "C:\Users\antonio.cesar\desenv\projects\devops\microdevops-local\manager\ui\micro-devops-app\resources\manager\certs"  # Substitua pelo caminho desejado
    $keytool  = "C:\Users\antonio.cesar\desenv\projects\devops\microdevops-local\manager\ui\micro-devops-app\resources\manager\keytool.exe"
    
    if (-Not (Test-Path -Path $keytool)) {
        Write-Output "O keytool.exe não foi encontrado no caminho especificado: $keytool"
        return
    }

    if (-Not (Test-Path -Path $certsDir)) {
        New-Item -ItemType Directory -Path $certsDir
    }

    # Definir o nome dos arquivos
    $keyStore = "$certsDir\dev-keystore.jks"
    $keyAlias = "devkey"
    $keyPassword = "changeit"  # Substitua por uma senha forte
    $csrFile = "$certsDir\dev-csr.pem"
    $certFile = "$certsDir\dev-cert.pem"

    # Gerar uma chave privada e armazená-la no KeyStore
    Write-Output "Gerando chave privada..."
    $genKeypairArgs = @(
        "-genkeypair"
        "-alias $keyAlias"
        "-keyalg RSA"
        "-keysize 2048"
        "-keystore $keyStore"
        "-storepass $keyPassword"
        "-keypass $keyPassword"
        "-dname `"CN=localhost, OU=Dev, O=YourCompany, L=YourCity, S=YourState, C=YourCountry`""
    )
    $output = & $keytool $genKeypairArgs 2>&1
    Write-Output "Comando: keytool $($genKeypairArgs -join ' ')"
    Write-Output $output
    if (-Not (Test-Path -Path $keyStore)) {
        Write-Output "Erro: KeyStore $keyStore não foi criado."
        return
    }

    # Criar um Certificate Signing Request (CSR)
    Write-Output "Gerando CSR..."
    $certreqArgs = @(
        "-certreq"
        "-alias $keyAlias"
        "-keystore $keyStore"
        "-file $csrFile"
        "-storepass $keyPassword"
        "-keypass $keyPassword"
    )
    $output = & $keytool $certreqArgs 2>&1
    Write-Output "Comando: keytool $($certreqArgs -join ' ')"
    Write-Output $output
    if (-Not (Test-Path -Path $csrFile)) {
        Write-Output "Erro: CSR não foi criado."
        return
    }

    # Gerar um certificado autoassinado
    Write-Output "Gerando certificado autoassinado..."
    $gencertArgs = @(
        "-gencert"
        "-infile $csrFile"
        "-outfile $certFile"
        "-alias $keyAlias"
        "-keystore $keyStore"
        "-storepass $keyPassword"
        "-keypass $keyPassword"
        "-validity 365"
    )
    $output = & $keytool $gencertArgs 2>&1
    Write-Output "Comando: keytool $($gencertArgs -join ' ')"
    Write-Output $output
    if (-Not (Test-Path -Path $certFile)) {
        Write-Output "Erro: Certificado não foi criado."
        return
    }

    Write-Output "Certificados gerados com sucesso no diretório $certsDir"
}

# Verifique e execute a função fornecida pelo parâmetro $FunctionName
if ($FunctionName) {
    if (Get-Command $FunctionName -ErrorAction SilentlyContinue) {
        if ($FunctionName -eq "StopProxyServer") {
            & $FunctionName -proxyId $proxyId
        } else {
            & $FunctionName
        }
    } else {
        Write-Host "Função $FunctionName não encontrada."
    }
} else {
    # Iniciar a instalação por padrão se nenhum nome de função for fornecido
    Init
}



