#!/bin/bash

# Título do instalador
echo "Instalador do Ambiente Local - CEF"

# Definição de variáveis de ambiente
ENVIRONMENT_PATH="."
CONTAINERS_PATH="$ENVIRONMENT_PATH/containers"
TOOLS_PATH="$CONTAINERS_PATH/tools"

INSTALLER_PATH="$TOOLS_PATH/multipass"

MQ_PATH="$TOOLS_PATH/mq"
SSO_PATH="$TOOLS_PATH/sso"
WS_LIBERTY_PATH="$TOOLS_PATH/servers/ws-liberty"
DB_PATH="$CONTAINERS_PATH/db"
ADMINER_PATH="$TOOLS_PATH/db/adminer"
PROXY_PATH="$TOOLS_PATH/servers/proxy"
ANGULAR_POC_PATH="$CONTAINERS_PATH/app/frontend/agular-poc-app"

VM_HOST="dev-server.local"
VM_HOST_API_TEST="http://$VM_HOST:5000"
VM_CONTAINERS_PATH="/home/ubuntu/containers"
VM_TOOLS_PATH="$VM_CONTAINERS_PATH/tools"
VM_PROXY_PATH="$VM_TOOLS_PATH/servers/proxy"
VM_FRONTEND_APP_PATH="$VM_CONTAINERS_PATH/app/frontend"
VM_BACKEND_APP_PATH="$VM_CONTAINERS_PATH/app/backend"
VM_DB_PATH="/home/ubuntu/containers/db"

# Obtendo data e hora atual
dt=$(date "+%Y%m%d%H%M%S")

# Log file
LOG_FILE="$dt.log"

# Função de inicialização
init() {
    echo "Inicializando o Instalador... $CONTAINERS_PATH"
    startInstall
}

# Função para iniciar a instalação
startInstall() {
    echo "Inicializando o Instalador..." >> "$LOG_FILE"
    showStartTime
    createVM
    updateLinux
    validateInstalation
    showEndTime
    echo "FIM" >> "$LOG_FILE"
}

# Função para mostrar o tempo de início
showStartTime() {
    starttime=$(date "+%T")
    startcsec="${starttime:9:2}"
    startsecs="${starttime:6:2}"
    startmins="${starttime:3:2}"
    starthour="${starttime:0:2}"
    starttime=$((starthour*60*60*100 + startmins*60*100 + startsecs*100 + startcsec))
    echo "$starttime" >> "$LOG_FILE"
}

# Função para mostrar o tempo de término
showEndTime() {
    endtime=$(date "+%T")
    endcsec="${endtime:9:2}"
    endsecs="${endtime:6:2}"
    endmins="${endtime:3:2}"
    endhour="${endtime:0:2}"
    if [ "$endhour" -lt "$starthour" ]; then
        endhour=$((endhour+24))
    fi
    endtime=$((endhour*60*60*100 + endmins*60*100 + endsecs*100 + endcsec))
    timetaken=$((endtime - starttime))
    timetakens=$((timetaken / 100))
    timetaken="$timetakens.${timetaken: -2}"
    echo "Tempo total: $timetaken sec." >> "$LOG_FILE"
}

# Função para validar a instalação
validateInstalation() {
    testHostVM
    echo "ERROR_LEVEL: $errorlevel" >> "$LOG_FILE"
    if [ "$errorlevel" = "1" ]; then
        continueInstalation
    else
        echo "Não foi possível acessar o HOST da VM, reiniciando o processo de instalação..." >> "$LOG_FILE"
        continueInstalation
    fi
}

# Função para testar o host da VM
testHostVM() {
    echo "Testando o host da VM antes de prosseguir..." >> "$LOG_FILE"
    HTTP=""
    for a in $(curl -s -o /dev/null -v -X GET -w "%{http_code}" "$VM_HOST_API_TEST"); do
        HTTP="$a"
    done

    if [ "$HTTP" == "200" ]; then
        echo "A comunicação com o HOST está OK." >> "$LOG_FILE"
        exit 1
    else
        echo "ERRO na comunicação com o HOST." >> "$LOG_FILE"
        exit 0
    fi
}

showInternalInterfaces() {
	echo "8 - Interfaces internas ::::::::::::"
	multipass exec dev-server -- ip -br address show scope 
}

# Função para continuar a instalação
continueInstalation() {
    configureLInux
    mountDefaultVolumes
	createDefaultConteiners
    showInfoServer
    showInternalInterfaces
    testContainerComunication
}

# Função para configurar o Linux
configureLInux() {
    echo "VM Inicializada, inicializando configuração do Linux..." >> "$LOG_FILE"
    transferDefaultFilesToVM
	setPerminssionsInDefaultFiles
	multipass exec dev-server -- sh -x /tmp/setup-instance.sh
	multipass exec dev-server -- sh -x /tmp/update-linux.sh
}

# Função para transferir arquivos padrões para a VM
transferDefaultFilesToVM() {
    echo "Transferindo arquivos para a VM" >> "$LOG_FILE"
    multipass transfer "$INSTALLER_PATH/setup-instance.sh" dev-server:/tmp/setup-instance.sh
    multipass transfer "$INSTALLER_PATH/update-linux.sh" dev-server:/tmp/update-linux.sh
}

setPerminssionsInDefaultFiles() {
    echo "Aplicando permissões e executando arquivos na VM" >> "$LOG_FILE"
    multipass exec dev-server -- chmod +x /tmp/setup-instance.sh    
    multipass exec dev-server -- chmod +x /tmp/update-linux.sh    
}

# Função para montar volumes
mountDefaultVolumes() {
    echo "Montando o volume que contém os arquivos do container Java" >> "$LOG_FILE"
    multipass exec dev-server -- mkdir -p "$VM_CONTAINERS_PATH" 
    multipass exec dev-server -- mkdir -p "$VM_DB_PATH" 
    multipass exec dev-server -- mkdir -p "$VM_PROXY_PATH" 
    multipass exec dev-server -- mkdir -p "$VM_FRONTEND_APP_PATH" 
    multipass exec dev-server -- mkdir -p "$VM_BACKEND_APP_PATH" 
    multipass exec dev-server -- mkdir -p "$VM_TOOLS_PATH"     
}

# Função para criar conteiners padrões
createDefaultConteiners(){
	echo "Criando os conteiners padrões..." >> "$LOG_FILE"
	createSsoContainer
	createAdminerContainer
    createAngularPOCContainer
    createMQContainer
	createWSLibertyContainer
}

# Função para criar conteiner SSO
createSsoContainer(){
	echo "Criando conteiner SSO..." >> "$LOG_FILE"
	#Montar os volumes do SSO na VM, usando o Multipass
	multipass mount "$SSO_PATH" dev-server:"$VM_TOOLS_PATH"/sso
	#Executar o docker-compose do SSO na VM
	#multipass exec dev-server -- docker-compose -f "$VM_TOOLS_PATH"/sso/docker-compose.yml up -d
	#Testar se o SSO está rodando na porta configurada no docker-compose.yml e adicionar a resposta no arquivo de LOG	($LOG_FILE)
}
# Função para criar conteiner Adminer
createAdminerContainer(){
	echo "Criando conteiner Adminer..." >> "$LOG_FILE"
	#Montar os volumes do Adminer na VM, usando o Multipass
	multipass mount "$ADMINER_PATH" dev-server:"$VM_TOOLS_PATH"/adminer
	#Executar o docker-compose do Adminer na VM
	#multipass exec dev-server -- docker-compose -f "$VM_TOOLS_PATH"/adminer/docker-compose.yml up -d
	#Testar se o Adminer está rodando na porta configurada no docker-compose.yml e adicionar a resposta no arquivo de LOG	($LOG_FILE)
}
# Função para criar conteiners AngularPOC
createAngularPOCContainer(){
	echo "Criando conteiner AngularPOC..." >> "$LOG_FILE"
	#Montar os volumes do AngularPOC na VM, usando o Multipass
	multipass mount "$ANGULAR_POC_PATH" dev-server:"$VM_FRONTEND_APP_PATH"/angular-poc-app
	#Executar o docker-compose do AngularPOC na VM
	#multipass exec dev-server -- docker-compose -f "$VM_FRONTEND_APP_PATH"/angular-poc-app/docker-compose.yml up -d
	#Testar se a AngularPOC está rodando na porta configurada no docker-compose.yml e adicionar a resposta no arquivo de LOG	($LOG_FILE)
}

# Função para criar conteiner MQ
createMQContainer(){
	echo "Criando conteiner MQ..." >> "$LOG_FILE"
	#Montar os volumes do MQ na VM, usando o Multipass
	multipass mount "$MQ_PATH" dev-server:"$VM_TOOLS_PATH"/mq
	#Executar o docker-compose do MQ na VM
	#multipass exec dev-server -- docker-compose -f "$VM_TOOLS_PATH"/mq/docker-compose.yml up -d
	#Testar se a MQ está rodando na porta configurada no docker-compose.yml e adicionar a resposta no arquivo de LOG
}

# Função para criar conteiner Websphere Liberty
createWSLibertyContainer(){
	echo "Criando conteiner WSLiberty..." >> "$LOG_FILE"
	#Montar os volumes do websphere-liberty na VM, usando o Multipass
	multipass mount "$WS_LIBERTY_PATH" dev-server:"$VM_TOOLS_PATH"/ws-liberty
	#Executar o docker-compose do websphere-liberty na VM
	#multipass exec dev-server -- docker-compose -f "$VM_TOOLS_PATH"/ws-liberty/docker-compose.yml up -d
	#Testar se no websphere-liberty está rodando na porta configurada no docker-compose.yml e adicionar a resposta no arquivo de LOG
}

# Função para verificar a existência da VM
function vmExists {
    multipass list | grep -q "dev-server"
    return $?
}

# Função para excluir a VM
function deleteVM {
    if vmExists; then
        echo "VM 'dev-server' encontrada. Excluindo..." >> "$LOG_FILE"
        multipass delete dev-server
        multipass purge
        echo "VM 'dev-server' excluída." >> "$LOG_FILE"
    else
        echo "VM 'dev-server' não existe." >> "$LOG_FILE"
    fi
}

# Função para criar a VM
createVM() {
    echo "Criando a VM dev-server [Ubuntu Server | cpus: 3 | mem: 4G | disk: 100G]" >> "$LOG_FILE"
    deleteVM
    multipass launch --name dev-server --cpus 3 --memory 4G --disk 50G
    showInternalInterfaces
}

# Main logic
if [ "$1" ]; then
    # Verificar se a função existe
    if [[ $(type -t $1) = "function" ]]; then
        $1  # Chamar a função
    else
        echo "Function $1 not found."
    fi
else
    # Se nenhum argumento foi fornecido, chamar a função init
    init
fi