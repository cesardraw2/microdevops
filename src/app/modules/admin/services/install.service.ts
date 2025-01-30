import {inject, Injectable} from '@angular/core';
import {PowershellService} from './powershell.service';
import {ServerInfo} from "app/modules/admin/services/ServerInfo";
import {ContainerInfo} from "app/modules/admin/services/ContainerInfo";
import {toCamelCase} from "app/core/util/string-utils";
import {CorpLoadingService} from "corp/services/loading";
import {IServiceContainer} from "app/modules/admin/models/service-conteiner.types";
import * as path from 'path';
import {LogInstallService} from "app/core/log/log-service.service";
import {IServer} from "app/modules/admin/image-launch/IServer";
import {HostsService} from "app/modules/admin/services/hosts-service.service";
import {forkJoin, lastValueFrom, of, switchMap} from "rxjs";
import {catchError} from "rxjs/operators";
import {ConverterDecorator, convertToClass} from "app/core/util/converter-decorator";
import {BPMNActivity} from "app/modules/admin/bpmn/bpmn-activity-decorator";

@Injectable({
    providedIn: 'root'
})
export class InstallService {

    //# Atualizado para usar o diretório atual onde install.ps1 está localizado
    DB_PATH: string;
    MQ_PATH: string;
    SSO_PATH: string;
    TOOLS_PATH: string;
    PROXY_PATH : string;
    ADMINER_PATH: string;
    PORTAINER_PATH: string;
    CONTAINERS_PATH: string;
    WS_LIBERTY_PATH: string;
    MONITORING_PATH: string;
    ANGULAR_POC_PATH: string;
    INSTALLER_PATH: string = "manager";
    ENVIRONMENT_PATH: string = "manager";

    SERVER_HOST: string;
    SERVER_DB_PATH: string;
    SERVER_NAME:string = "dev-server";
    SERVER_HOST_API_TEST:string  = "http://$SERVER_HOST";
    SERVER_HOME_PATH:string  = "/home/ubuntu";
    SERVER_CONTAINERS_PATH:string  = "/home/ubuntu/containers";

    SERVER_TOOLS_PATH: string;
    SERVER_SERVERS_PATH: string;
    SERVER_BACKEND_APP_PATH: string;
    SERVER_BACKEND_VIDA_PATH: string;
    SERVER_FRONTEND_APP_PATH: string;
    WS_OPEN_LIBERTY_PATH_APP: string;
    WS_OPEN_LIBERTY_PATH_SEGUROS: string;

    $SSH_KEY_PATH:string=null;

    //# Obtendo data e hora atual
    $dt:Date;

    //# Log file
    $LOG_FILE = null;
    $LOG_CONTENT = '';

    //#Configurações de proxy reverso da máquina host.
    private reverseProxyProcessId: number;
    private reverseProxyFilePath = null
    private nodeInterpreterPath: string;

    private cpus: number = 3;
    private startTime: string;
    private mem: string = '4G';
    private disk:string = '20G';
    private DEV_SERVER_NAME: string = 'dev-server';

    protected defaultJavaVersion = 11; //# Pode ser "8", "11" ou "17"

    protected certsDir = 'C:\\Users\\antonio.cesar\\desenv\\projects\\devops\\microdevops-local\\manager\\certs';
    protected KeytoolExecutable = 'C:\\Users\\antonio.cesar\\desenv\\projects\\devops\\microdevops-local\\manager\\keytool.exe';
    protected JAEGER_PATH: string;
    protected PROMETHEUS_PATH: string;
    private corpLoadingService = inject(CorpLoadingService);
    private resourcesPath: string;
    private homeDir: string;
    private server: IServer;


    constructor(private powerShellService: PowershellService,
                private logInstallService: LogInstallService,
                private hostService: HostsService) {
        this.$dt = new Date();
        this.resourcesPath = this.getResourcesPath();
        this.homeDir = this.getHomeDirectory();
        this.setDefaultConfigurations();
    }

    private setDefaultConfigurations() {
        try {

            this.$LOG_FILE = this.getCurrentDateTime() + '.log';
            console.log(`:::: HOME_DIR ::::   ${this.getHomeDirectory()}`);
            console.log(`:::: HOME_DIR ::::   ${this.homeDir}`);
            console.log(`:::: resourcesPath ::::   ${this.resourcesPath}/${this.INSTALLER_PATH}`);
            //this.INSTALLER_PATH = this.powershellService.getAbsolutePath(`${this.resourcesPath}/${this.INSTALLER_PATH}`);
            this.INSTALLER_PATH = `${this.resourcesPath}/${this.INSTALLER_PATH}`;
            this.$SSH_KEY_PATH = this.homeDir + "/.ssh/id_rsa_multipass";
            this.reverseProxyFilePath = path.normalize(`${this.resourcesPath}/${this.ENVIRONMENT_PATH}/redbird-server/server.js`);
            // C:\Users\antonio.cesar\desenv\projects\devops\microdevops-local\manager\ui\micro-devops-app\resources\manager\redbird-server\server.js
            // C:\Users\antonio.cesar\desenv\projects\devops\microdevops-local\manager\ui\micro-devops-app\resources/manager/redbird-server/server.js

            this.SERVER_HOST = this.SERVER_NAME + ".mshome.net";
            this.SERVER_NAME = "dev-server";
            this.SERVER_HOST = `${this.SERVER_NAME}.mshome.net`;
            this.SERVER_HOST_API_TEST = `http://${this.SERVER_HOST}`;
            this.SERVER_DB_PATH = this.SERVER_CONTAINERS_PATH + "/db";
            this.SERVER_TOOLS_PATH = this.SERVER_CONTAINERS_PATH + "/tools";
            this.SERVER_SERVERS_PATH = this.SERVER_TOOLS_PATH + "/servers";
            this.SERVER_FRONTEND_APP_PATH = this.SERVER_CONTAINERS_PATH + "/app/frontend";
            this.SERVER_BACKEND_APP_PATH = this.SERVER_CONTAINERS_PATH + "/app/backend";

            this.CONTAINERS_PATH = `${this.resourcesPath}/${this.ENVIRONMENT_PATH}/containers`;
            this.TOOLS_PATH = this.CONTAINERS_PATH + "/tools";
            this.DB_PATH = this.CONTAINERS_PATH + "/db";
            this.WS_LIBERTY_PATH = this.TOOLS_PATH + "/servers/ws-liberty";
            this.MQ_PATH = this.TOOLS_PATH + "/mq";
            this.SSO_PATH = this.TOOLS_PATH + "/sso";
            this.PROXY_PATH = this.TOOLS_PATH + "/servers/proxy";
            this.ADMINER_PATH = this.TOOLS_PATH + "/db/adminer";
            this.PORTAINER_PATH = this.TOOLS_PATH + "/system/portainer";
            this.MONITORING_PATH = this.TOOLS_PATH + "/system/monitoring/glances";
            this.JAEGER_PATH = this.TOOLS_PATH + "/system/monitoring/jaeger";
            this.PROMETHEUS_PATH = this.TOOLS_PATH + "/system/monitoring/prometheus";
            this.ANGULAR_POC_PATH = this.CONTAINERS_PATH + "/app/frontend/angular-poc-app";

            this.nodeInterpreterPath = `${this.homeDir}/AppData/Roaming/JetBrains/IntelliJIdea2024.1/node/node-v20.13.1-win-x64/node.exe`;
            this.WS_OPEN_LIBERTY_PATH_APP = `${this.homeDir}/desenv/projects/estudo/java/open-liberty/getting-started/finish`;
            this.WS_OPEN_LIBERTY_PATH_SEGUROS = `${this.homeDir}/desenv/projects/sicoob/seguros/sicoobseguros/EAR`;

        } catch (error) {
            this.writeLog(`Erro ao configurar os paths: ${error}`);
            console.error(`Erro ao configurar os paths: `, error);
        }

    }

    getResourcesPath(): string {
        if (window.electronAPI) {
            return window.electronAPI.getResourcesPath();
        } else {
            throw new Error('electronAPI não está disponível.');
        }
    }

    getHomeDirectory(): string {
        if (window.electronAPI) {
            return window.electronAPI.getHomeDirectory();
        } else {
            throw new Error('electronAPI não está disponível.');
        }
    }

    getCurrentDateTime(): string {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }

    getDateTime(dt:Date): string {

        const year = dt.getFullYear();
        const month = String(dt.getMonth() + 1).padStart(2, '0');
        const day = String(dt.getDate()).padStart(2, '0');
        const hours = String(dt.getHours()).padStart(2, '0');
        const minutes = String(dt.getMinutes()).padStart(2, '0');
        const seconds = String(dt.getSeconds()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }

    async executeCommand(command:string): Promise<string> {
        try {
            return await this.powerShellService.runCommand(command);
        } catch (error) {
            console.error('Error executing command:', error);
            throw new Error(error);
        }
    }

    //@BPMNActivity('C004')
    async checkAndEnableHyperV(): Promise<boolean> {
        console.log('::: Running checkAndEnableHyperV');
        const enabled =  await this.powerShellService.ensureHyperV();
        console.log('::: Running checkAndEnableHyperV:: ',enabled);
        return enabled;
    }

    writeLog(message:string){
        this.logInstallService.writeLog(message);
    }

    @BPMNActivity('C001')
    async init(server: IServer): Promise<any> {
        try {
            this.writeLog('1 - Inicializando o Instalador...');
            return this.startInstall(server);
        } catch (error) {
            console.error('Houve um erro ao executar o instalador: ', error);
            throw error;
        }
    }

    //@BPMNActivity('C006')
    async enableMountVolumesInMultipass(): Promise<string> {
        this.writeLog('3 - Habilitando volumes...');
        return await this.executeCommand('multipass set local.privileged-mounts=on');
    }

    //@BPMNActivity('C002')
    async startInstallTeste(server:IServer): Promise<void> {
        this.writeLog('startInstall');
        const hyperVEnabled = await this.checkAndEnableHyperV();
        console.log('hyperVEnabled:: ',hyperVEnabled);
        return Promise.resolve();
    }

    //@BPMNActivity('C002')
    async startInstall(server: IServer): Promise<void> {
        this.writeLog('run startInstall...');
        try {
            await this.setStartTime();
            this.writeLog('2 - StartTime: ' + this.startTime);


            const hyperVEnabled = await this.checkAndEnableHyperV();
            console.log('hyperVEnabled:: ', hyperVEnabled);

            if (hyperVEnabled) {
                console.log(':: hyperVEnabled :: ', hyperVEnabled);
                this.configLoading();
                const volumesEnabled = await this.enableMountVolumesInMultipass();
                this.writeLog('Command result: ' + volumesEnabled);

                await this.createServer(server);

                await this.executeCommand(`docker network create ${server.name}-network`);

                await this.mountVolume(this.server, `${this.resourcesPath}/app`, `${this.SERVER_HOME_PATH}/app`);
                this.corpLoadingService.setProgress(20);

                await this.transferDefaultFilesToSERVER();
                this.corpLoadingService.setProgress(40);

                await this.setPermissionsInDefaultFiles();
                this.corpLoadingService.setProgress(45);

                await this.executeDefaultScripts();
                this.corpLoadingService.setProgress(50);

                await this.configureJavaEnvironment();
                this.corpLoadingService.setProgress(60);

                await this.createDefaultFoldersToVolumes();
                this.corpLoadingService.setProgress(70);

                await this.createDefaultContainers();
                this.corpLoadingService.setProgress(80);

                await this.showVMInternalInterfaces();
                this.corpLoadingService.setProgress(90);

                await this.setEndTime();
                this.corpLoadingService.setProgress(100);
                this.corpLoadingService.hide();
                this.powerShellService.showNotification(` ${server.name} criado com sucesso!`, ``);
            } else {
                console.log('NOT hyperVEnabled:: ', hyperVEnabled);
                this.writeLog('Hyper-V não pôde ser habilitado.');
                this.corpLoadingService.hide();
            }
        } catch (error) {
            this.writeLog('Erro durante a instalação: ' + error);
            console.error('Erro durante a instalação:', error);
            this.corpLoadingService.hide();
        }
    }

    //@BPMNActivity('C005')
    private configLoading() {
        this.corpLoadingService.setAutoMode(false);
        this.corpLoadingService.setMode('determinate');
        this.corpLoadingService.show();
        this.corpLoadingService.setProgress(10);
    }

    async restartMultipass(): Promise<string> {
        try {
            this.writeLog(`Executando Restart...`);
            const restart = await this.executeCommand('restart-service Multipass');
            this.writeLog('restart-service Multipass executed: ' + restart);
            return restart;
        } catch (error) {
            console.error('Erro ao reiniciar o serviço Multipass: ', error);
            this.writeLog('Erro ao reiniciar o serviço Multipass: ' + error.toString());
            throw error;
        }
    }

    async testTimeCount(): Promise<void> {
        await this.powerShellService.runCommand('ShowStartTime');
        await this.powerShellService.runCommand('ShowEndTime');
    }


    //@BPMNActivity('C007.1')
    async serverExists(server:IServer): Promise<boolean> {
        this.writeLog('x - Verify with server exists: '+server.name);
        const exists:boolean = await this.powerShellService.runCommand('multipass list').then(vms => {
                this.writeLog('VMs::: '+vms);
                this.writeLog('SERVER NAME::: '+server.name);
                return vms.includes(server.name);

            });
        console.log('exists::: ',exists);
        return exists;
    }

    //@BPMNActivity('C003')
    async setStartTime(): Promise<string> {
        return this.startTime = await this.powerShellService.runCommand('Get-Date -Format o');
    }

    //@BPMNActivity('C0016')
    async setEndTime(): Promise<void> {
        try {
            // Obter o End Time
            const endTime = await this.powerShellService.runCommand('Get-Date -Format o');
            console.log('Start Time:', this.startTime);
            console.log('End Time:', endTime);

            // Calcular o Tempo Total
            const endTimeDate = new Date(endTime.trim());
            const startTimeDate = new Date(this.startTime.trim());
            const timeTaken = (endTimeDate.getTime() - startTimeDate.getTime()) / 1000;
            const timeTakenSeconds = Math.floor(timeTaken);

            // Adicionar o Tempo Total ao Arquivo de Log
            //await this.runCommand(`Add-Content ${logFile} "Tempo total: ${timeTakenSeconds} sec."`);
            this.writeLog(`Tempo total: ${timeTakenSeconds} sec ( ${timeTakenSeconds/60} min ).`);
        } catch (error) {
            console.error('Erro ao executar comandos do PowerShell:', error);
        }
    }

    async validateInstalation(): Promise<void> {
        await this.powerShellService.runCommand('pingSuccess = PingHostSERVER');
        await this.powerShellService.runCommand('if (pingSuccess) {');
        await this.powerShellService.runCommand('Add-Content LOG_FILE "Ping foi bem-sucedido, continuando a instalação."');
        await this.powerShellService.runCommand('ContinueInstalation');
        await this.powerShellService.runCommand('} else {');
        await this.powerShellService.runCommand('Add-Content LOG_FILE "Ping falhou, abortando a instalação."');
        await this.powerShellService.runCommand('}');
    }

    async testHostSERVER(): Promise<void> {
        await this.powerShellService.runCommand('Test-Connection -ComputerName SERVER_NAME -Count 2 -Quiet');
    }



    async pingHostSERVER(): Promise<void> {
        await this.powerShellService.runCommand('Test-Connection -ComputerName SERVER_NAME -Count 2 -Quiet');
    }

    async continueInstalation(): Promise<void> {
        await this.powerShellService.runCommand('Add-Content LOG_FILE "Continuação da instalação."');
        await this.powerShellService.runCommand('ConfigureJavaEnviroment');
    }

    async configureLinux(): Promise<void> {

    }

    //@BPMNActivity('C0012')
    async configureJavaEnvironment(): Promise<void> {
        try {
            this.writeLog(`Instalando pacotes no servidor ${this.server.name}...`);
            await this.powerShellService.runCommand(`multipass exec ${this.server.name} -- sudo apt-get update -y`);
            await this.powerShellService.runCommand(`multipass exec ${this.server.name} -- sudo apt-get upgrade -y`);

            this.writeLog('Instalando JDK 8...');
            await this.powerShellService.runCommand(`multipass exec ${this.server.name} -- sudo apt-get install -y openjdk-8-jdk`);

            this.writeLog('Instalando JDK 11...');
            await this.powerShellService.runCommand(`multipass exec ${this.server.name} -- sudo apt-get install -y openjdk-11-jdk`);

            this.writeLog('Instalando JDK 17...');
            await this.powerShellService.runCommand(`multipass exec ${this.server.name} -- sudo apt-get install -y openjdk-17-jdk`);

            this.writeLog('Configurando alternatives para Java...');
            await this.powerShellService.runCommand(`multipass exec ${this.server.name} -- sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-8-openjdk-amd64/bin/java 1081`);
            await this.powerShellService.runCommand(`multipass exec ${this.server.name} -- sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-11-openjdk-amd64/bin/java 1111`);
            await this.powerShellService.runCommand(`multipass exec ${this.server.name} -- sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-17-openjdk-amd64/bin/java 1171`);

            await this.setJavaVersion(this.server.name, this.defaultJavaVersion);

            this.writeLog('Instalando Maven...');
            await this.powerShellService.runCommand(`multipass exec ${this.server.name} -- sudo apt-get install -y maven`);

            this.writeLog('Verificando as instalações...');
            const javaVersion = await this.powerShellService.runCommand(`multipass exec ${this.server.name} -- java -version`);
            this.writeLog(`Java Version: ${javaVersion}`);
            const mavenVersion = await this.powerShellService.runCommand(`multipass exec ${this.server.name} -- mvn -version`);
            this.writeLog(`Maven Version: ${mavenVersion}`);

            this.writeLog('Configuração do JAVA concluída.');
        } catch (error) {
            this.writeLog(`Erro ao configurar o ambiente Java: ${error}`);
            console.error('Erro ao configurar o ambiente Java:', error);
        }
    }

    async setJavaVersion(serverName: string, javaVersion: number): Promise<void> {
        try {
            const command = `multipass exec ${serverName} -- sudo update-alternatives --set java /usr/lib/jvm/java-${javaVersion}-openjdk-amd64/bin/java`;
            await this.powerShellService.runCommand(command);
            this.writeLog(`Java ${javaVersion} configurado como versão padrão.`);
        } catch (error) {
            this.writeLog(`Erro ao configurar Java ${javaVersion} como versão padrão: ${error}`);
            console.error(`Erro ao configurar Java ${javaVersion} como versão padrão:`, error);
        }
    }

    //@BPMNActivity('C009')
    private async transferDefaultFilesToSERVER(): Promise<string> {
        try {
            this.writeLog("Transferindo arquivos para o dev-server");

            const exists = await this.serverExists(this.server);
            if (exists) {
                await this.powerShellService.runCommand(`multipass transfer ${this.INSTALLER_PATH}/setup-instance.sh ${this.server.name}:/tmp/setup-instance.sh`);
                await this.powerShellService.runCommand(`multipass transfer ${this.INSTALLER_PATH}/update-linux.sh ${this.server.name}:/tmp/update-linux.sh`);
                //await this.powershellService.runCommand(`multipass transfer ${this.INSTALLER_PATH}/run-open-liberty.sh ${this.server.name}:/tmp/run-open-liberty.sh`);
                //await this.powershellService.runCommand(`multipass transfer ${this.INSTALLER_PATH}/run-open-liberty-seguro-vida-backend.sh ${this.server.name}:/tmp/run-open-liberty-seguro-vida-backend.sh`);
                this.writeLog("Arquivos transferidos com sucesso.");
            } else {
                this.writeLog(`O server '${this.server.name}' não está pronto para receber arquivos.`);
            }

            return 'ok';
        } catch (error) {
            this.writeLog(`Erro ao transferir arquivos para o dev-server: ${error}`);
            throw error;
        }
    }

    //@TODO Vou usar isso para transferir arquivos dinamicamente, como os do projeto VIDA, por exemplo.
    async transferFileToSERVER(filePathOrigin:string, filePathDestiny:string): Promise<string> {
        try {
            this.writeLog("Transferindo arquivos para o dev-server");

            const exists = await this.serverExists(this.server);
            if (exists) {
                //Exemplo: await this.powershellService.runCommand(`multipass transfer ${this.INSTALLER_PATH}/run-open-liberty-seguro-vida-backend.sh ${this.server.name}:/tmp/run-open-liberty-seguro-vida-backend.sh`);
                await this.powerShellService.runCommand(`multipass transfer ${filePathOrigin} ${this.server.name}:${filePathDestiny}`);
                this.writeLog("Arquivo transferido com sucesso.");
            } else {
                this.writeLog(`O server '${this.server.name}' não está pronto para receber arquivos.`);
            }

            return 'ok';
        } catch (error) {
            this.writeLog(`Erro ao transferir arquivos para o dev-server: ${error}`);
            throw error;
        }
    }

    //@BPMNActivity('C0010')
    private async setPermissionsInDefaultFiles(): Promise<string> {
        try {
            this.writeLog("Aplicando permissões e executando arquivos no dev-server");

            const exists = await this.serverExists(this.server);
            if (exists) {
                await this.powerShellService.runCommand(`multipass exec ${this.server.name} -- chmod +x /tmp/setup-instance.sh`);
                await this.powerShellService.runCommand(`multipass exec ${this.server.name} -- chmod +x /tmp/update-linux.sh`);
                //await this.powershellService.runCommand(`multipass exec ${this.server.name} -- chmod +x /tmp/run-open-liberty.sh`);
                //await this.powershellService.runCommand(`multipass exec ${this.server.name} -- chmod +x /tmp/run-open-liberty-seguro-vida-backend.sh`);
                this.writeLog("Permissões aplicadas com sucesso.");
            } else {
                this.writeLog(`O server '${this.server.name}' não está pronto para aplicar permissões nos arquivos.`);
            }

            return 'ok';
        } catch (error) {
            this.writeLog(`Erro ao aplicar permissões nos arquivos do dev-server: ${error}`);
            throw error;
        }
    }

    async executeSetupScript(): Promise<void> {
        try {
            const command = `multipass exec ${this.server.name} -- bash -c 'if [ -f /tmp/update-linux.sh ]; then bash /tmp/update-linux.sh; else echo "update-linux.sh not found"; fi'`;
            await this.powerShellService.runCommand(command);
            this.writeLog('Script update-linux.sh executado com sucesso.');
        } catch (error) {
            this.writeLog(`Erro ao executar o script update-linux.sh: ${error}`);
            console.error('Erro ao executar o script update-linux.sh:', error);
            //await this.powershellService.stopMultipass();
        }
    }

    //@BPMNActivity('C0011')
    private async executeDefaultScripts(): Promise<string> {
        try {
            this.writeLog("Executando scripts de configuração no dev-server");

            const exists = await this.serverExists(this.server);
            if (exists) {
                await this.powerShellService.runCommand(
                    `multipass exec ${this.server.name} -- bash -c 'if [ -f /tmp/setup-instance.sh ]; then sh -x /tmp/setup-instance.sh; else echo "setup-instance.sh not found"; fi'`
                );

                await this.executeSetupScript();
                this.writeLog("Scripts de configuração executados com sucesso.");
            } else {
                this.writeLog(`O server '${this.server.name}' não está pronto para executar os scripts de configuração.`);
            }

            return 'ok';
        } catch (error) {
            this.writeLog(`Erro ao aplicar permissões nos arquivos do dev-server: ${error}`);
            throw error;
        }
    }

    async createFolderOnServer(folderPath: string): Promise<void> {
        try {
            const command = `multipass exec ${this.server.name} -- sudo mkdir -p ${folderPath}`;
            await this.powerShellService.runCommand(command);
            this.writeLog(`Diretório criado: ${folderPath}`);
        } catch (error) {
            this.writeLog(`Erro ao criar diretório ${folderPath}: ${error}`);
            console.error(`Erro ao criar diretório ${folderPath}:`, error);
        }
    }

    //@BPMNActivity('C0013')
    private async createDefaultFoldersToVolumes(): Promise<void> {
        try {
            this.writeLog("Criando diretórios para os volumes que contém os arquivos do container");

            const exists = await this.serverExists(this.server);
            if (exists) {
                await this.createFolderOnServer(`${this.SERVER_HOME_PATH}/app`);
                await this.createFolderOnServer(this.SERVER_CONTAINERS_PATH);
                await this.createFolderOnServer(this.SERVER_DB_PATH);
                await this.createFolderOnServer(this.SERVER_FRONTEND_APP_PATH);
                await this.createFolderOnServer(this.SERVER_BACKEND_APP_PATH);
                await this.createFolderOnServer(`${this.SERVER_BACKEND_APP_PATH}/java`);
                await this.createFolderOnServer(this.SERVER_TOOLS_PATH);
                await this.createFolderOnServer(`${this.SERVER_TOOLS_PATH}/system/monitoring`);
                await this.createFolderOnServer(`${this.SERVER_TOOLS_PATH}/system/orchestration`);
                await this.createFolderOnServer(`${this.SERVER_TOOLS_PATH}/db`);
                await this.createFolderOnServer(this.SERVER_SERVERS_PATH);
                await this.createFolderOnServer(`${this.SERVER_SERVERS_PATH}/proxy`);
                this.writeLog("Diretórios criados.");
            } else {
                this.writeLog(`A VM '${this.server.name}' não está pronta para montar volumes.`);
            }
        } catch (error) {
            this.writeLog(`Erro ao criar diretórios: ${error}`);
            console.error('Erro ao criar diretórios:', error);
        }
    }


    //@BPMNActivity('C0014')
    async createDefaultContainers(): Promise<void> {
        try {
            this.writeLog("Criando os contêineres padrões...");
            //TODO fazer loop e executar o trecho abaixo (por enquanto vou subir os containers manualmente):

            /*this.createDynamicContainer(serviceContainer).then(
                async value => {
                    this.containerInfo =  await this.installService.getContainerInfo(serviceContainer.serviceName);
                    console.log('B - containerInfo:: ', this.containerInfo);
                    serviceContainer.status  = toCapitalize(this.containerInfo.state.status);
                    serviceContainer.isCreated = this.containerInfo.created !== null;
                }
            );*/



/*            await this.createPortainerContainer();
            await this.createJaegerContainer();
            await this.createPrometheusContainer();
            await this.createOpenLibertyContainer();
            await this.createAngularPOCContainer();
            await this.createProxyContainer();
            await this.createMonitoringContainer();
            await this.createSsoContainer();
            await this.createAdminerContainer();
            await this.createMQContainer();*/

        } catch (error) {
            this.writeLog(`Erro ao criar contêineres: ${error}`);
            console.error('Erro ao criar contêineres:', error);
        }
    }

    async showLocalInternalInterfaces(): Promise<void> {
        try {
            const command = `Get-NetIPAddress | Where-Object { $_.AddressState -eq 'Preferred' -and $_.PrefixOrigin -eq 'Manual' }`;
            const result = await this.powerShellService.runCommand(command);
            console.log('Interfaces Internas Locais:', result);
        } catch (error) {
            console.error('Erro ao mostrar interfaces internas locais:', error);
        }
    }

    //@BPMNActivity('C0015')
    async showVMInternalInterfaces(): Promise<void> {
        this.writeLog("8 - Interfaces internas ::::::::::::");
        try {
            const command = `multipass exec ${this.server.name} -- ip -br address show scope global`;
            const result = await this.powerShellService.runCommand(command);
            this.writeLog(result);
        } catch (error) {
            this.writeLog("Não foi possível mostrar interfaces internas. A VM 'dev-server' pode não existir.");
            console.error("Erro ao mostrar interfaces internas:", error);
        }
    }

    async createPortainerContainer(): Promise<void> {
        try {
            this.writeLog("Criando container Portainer...");
            await this.mountVolume(this.server, this.PORTAINER_PATH, `${this.SERVER_TOOLS_PATH}/system/portainer`);
            await this.runCommandOnServer(`docker volume create --name=portainer_data`);
            await this.runCommandOnServer(`docker-compose -f "${this.SERVER_TOOLS_PATH}/system/portainer/docker-compose.yml" up -d`);
            await this.runCommandOnServer(`curl https://localhost:9443`);
            await this.runCommandOnServer(`docker restart portainer`);
        } catch (error) {
            this.writeLog(`Erro ao criar container Portainer: ${error}`);
            console.error('Erro ao criar container Portainer:', error);
        }
    }

    async unmountContainerVolume(serverName:string, volumePath:string): Promise<void> {
        try {

            this.writeLog(`Desmontando o volume ${volumePath}`);

            const command = `multipass umount ${serverName}:${volumePath}`;

            const result = await this.powerShellService.runCommand(command);

            if (result.trim().length === 0) {
                this.writeLog("Desmontagem concluída com sucesso.");
            } else {
                this.writeLog("Erro: Falha ao desmontar o volume.");
                throw new Error("Falha ao desmontar o volume.");
            }
        } catch (error) {
            this.writeLog(`Erro ao desmontar o volume: ${error}`);
            console.error('Erro ao desmontar o volume:', error);
        }
    }

    async destroyContainer(serverName:string,container:IServiceContainer): Promise<void> {
        try {
            this.writeLog(`Destruindo container ${container.serviceName}... `);

            const volumePath = `${this.SERVER_CONTAINERS_PATH}/${container.category}/${container.serviceName}`;


            await this.runCommandOnServer(`docker stop ${container.serviceName}`);
            const resultA =  await this.runCommandOnServer(`docker rm ${container.serviceName}`);
            console.log(resultA);
            await this.unmountContainerVolume(serverName, volumePath);
            const resultB =  await this.runCommandOnServer(`sudo rm -Rf ${volumePath}`);
            console.log(resultB);
            //await this.runCommandOnServer(`docker image prune -a`);

           /* this.writeLog(`Destruindo imagem ... `);
            await this.runCommandOnServer(`docker image prune -a`);
            return result;*/
        } catch (error) {
            this.writeLog(`Erro ao criar container Portainer: ${error}`);
            console.error('Erro ao criar container Portainer:', error);
        }
    }

    async createMonitoringContainer(): Promise<void> {
        try {
            this.writeLog("Criando container Monitoring...");
            await this.mountVolume(this.server, this.MONITORING_PATH, `${this.SERVER_TOOLS_PATH}/system/monitoring/glances`);
            await this.runCommandOnServer(`docker-compose -f "${this.SERVER_TOOLS_PATH}/system/monitoring/glances/docker-compose.yml" up -d`);
        } catch (error) {
            this.writeLog(`Erro ao criar container Monitoring: ${error}`);
            console.error('Erro ao criar container Monitoring:', error);
        }
    }

    async createProxyContainer(): Promise<void> {
        try {
            this.writeLog("Criando container Proxy...");
            await this.mountVolume(this.server, this.PROXY_PATH, `${this.SERVER_SERVERS_PATH}/proxy`);
            await this.runCommandOnServer(`docker-compose -f "${this.SERVER_SERVERS_PATH}/proxy/traefik/docker-compose.yml" up -d`);
        } catch (error) {
            this.writeLog(`Erro ao criar container Proxy: ${error}`);
            console.error('Erro ao criar container Proxy:', error);
        }
    }

    async createSsoContainer(): Promise<void> {
        try {
            this.writeLog("Criando container SSO...");
            await this.mountVolume(this.server, this.SSO_PATH, `${this.SERVER_TOOLS_PATH}/sso`);
        } catch (error) {
            this.writeLog(`Erro ao criar container SSO: ${error}`);
            console.error('Erro ao criar container SSO:', error);
        }
    }

    async createAdminerContainer(): Promise<void> {
        try {
            this.writeLog("Criando container Adminer...");
            await this.mountVolume(this.server, this.ADMINER_PATH, `${this.SERVER_TOOLS_PATH}/db/adminer`);
            await this.runCommandOnServer(`docker-compose -f "${this.SERVER_TOOLS_PATH}/db/adminer/docker-compose.yml" up -d`);
        } catch (error) {
            this.writeLog(`Erro ao criar container Adminer: ${error}`);
            console.error('Erro ao criar container Adminer:', error);
        }
    }

    async createAngularPOCContainer(): Promise<void> {
        try {
            this.writeLog(`Criando container AngularPOC...  ${this.SERVER_FRONTEND_APP_PATH}/angular-poc-app`);
            await this.mountVolume(this.server, this.ANGULAR_POC_PATH, `${this.SERVER_FRONTEND_APP_PATH}/angular-poc-app`);
            await this.runCommandOnServer(`docker-compose -f "${this.SERVER_FRONTEND_APP_PATH}/angular-poc-app/docker-compose.yml" up -d`);
        } catch (error) {
            this.writeLog(`Erro ao criar container AngularPOC: ${error}`);
            console.error('Erro ao criar container AngularPOC:', error);
        }
    }

    async createMQContainer(): Promise<void> {
        try {
            this.writeLog("Criando container MQ...");
            await this.mountVolume(this.server, this.MQ_PATH, `${this.SERVER_TOOLS_PATH}/mq`);
        } catch (error) {
            this.writeLog(`Erro ao criar container MQ: ${error}`);
            console.error('Erro ao criar container MQ:', error);
        }
    }

    async createOpenLibertyContainer(): Promise<void> {
        try {
            this.writeLog("Criando container Open Liberty...");
            if (await this.pathExists(this.WS_OPEN_LIBERTY_PATH_APP)) {
                await this.mountVolume(this.server, this.WS_OPEN_LIBERTY_PATH_APP, `${this.SERVER_BACKEND_APP_PATH}/java/poc/open-liberty`);
                await this.generateKeystore(this.server.name, `${this.SERVER_BACKEND_APP_PATH}/java/poc/open-liberty/src/main/liberty/config`);
                await this.buildAndRunDynamicContainer(this.server, 'open-liberty','/tmp/run_open_liberty_container.sh');
            } else {
                this.writeLog(`O caminho da fonte ${this.WS_OPEN_LIBERTY_PATH_APP} não existe.`);
            }
        } catch (error) {
            this.writeLog(`Erro ao criar container Open Liberty: ${error}`);
            console.error('Erro ao criar container Open Liberty:', error);
        }
    }

    async updateHosts(serverName: string, containerHostsDirPath: string, hosts:string[]=[]): Promise<void> {
        try {
            //const hosts = await lastValueFrom(this.hostService.getHosts());
            if(hosts.length >0) {
                const updateObservables = hosts.map(host => {
                    return forkJoin([
                        this.powerShellService.updateHostsFilesInServer(serverName, host).pipe(
                            catchError(error => {
                                console.error(`Error adding host ${host} to server:`, error);
                                return of({success: false, message: error});
                            })
                        ),
                        this.powerShellService.updateHostsFilesInContainer(serverName, containerHostsDirPath, host).pipe(
                            catchError(error => {
                                console.error(`Error adding host ${host} to container:`, error);
                                return of({success: false, message: error});
                            })
                        )
                    ]);
                });
                const results = await lastValueFrom(forkJoin(updateObservables));
                results.forEach(resultArray => {
                    resultArray.forEach(result => {
                        if (result.success) {
                            console.log('Hosts files updated successfully');
                        } else {
                            console.error('Error updating hosts files:', result.message);
                        }
                    });
                });
            }
        } catch (error) {
            console.error('Error updating hosts files:', error);
        }
    }

    async createDynamicContainer(server: IServer, serviceContainer: IServiceContainer): Promise<void> {
        try {
            this.writeLog("Criando container...");

            const sourcePath = `${this.homeDir}/${serviceContainer.sourcePath}`;
            const volumePath = `${this.SERVER_CONTAINERS_PATH}/${serviceContainer.category}/${serviceContainer.serviceName}`;
            const runPath = `${volumePath}/run-app.sh`;
            const containerConfigPath = `${volumePath}/docker/config`;
            const containerHostsDirPath = `${containerConfigPath}/hosts`;

            console.log(`:::: serviceContainer.sourcePath ::::  ${serviceContainer.sourcePath}`);

            // Cria o diretório de configuração do contêiner no servidor
            await this.powerShellService.runCommand(`multipass exec ${server.name} -- mkdir -p ${containerConfigPath}`);

            // Atualiza os arquivos de hosts do contêiner
            await this.updateHosts(server.name, containerHostsDirPath, serviceContainer.hosts);

            // Removal suspensa pode ser comentada para simplificação: await this.powershellService.runCommand(`rm -rf ${volumePath}/docker/config/lib/*`);

            if (await this.pathExists(sourcePath)) {
                // Realiza montagem e configuração
                await this.mountVolume(server, sourcePath, volumePath);
                await this.configLibs(server, sourcePath, volumePath, serviceContainer);
                await this.buildAndRunDynamicContainer(server, serviceContainer.serviceName, runPath);

                // TODO: Verifique a necessidade de geração de keystore
                // await this.generateKeystore(server.name, `${volumePath}/docker/`);

                // Comentado pois o chmod é executado em um ponto anterior
                // await this.runCommandInContainer(server.name, serviceContainer.serviceName, `chown -Rf 1001:0 /config/lib`);
            } else {
                this.writeLog(`O caminho da fonte ${sourcePath} não existe.`);
            }
        } catch (error) {
            this.writeLog(`Erro ao criar container ${serviceContainer.name} no servidor ${server.name}: ${error}`);
            console.error(`Erro ao criar container ${serviceContainer.name} no servidor ${server.name}:`, error);
        }
    }
    //@BPMNActivity('C008.1')
    private async configLibs(server: IServer, sourcePath: string, volumePath: string, serviceContainer: IServiceContainer) {

        let i = 0;
        for (let lib of serviceContainer.libs) {
            const dir = path.dirname(lib);
            const fileName = path.basename(lib);
            const fullDirPath = `${volumePath}/docker/config/lib/${dir}`.replace('/.', '');
            const sourceLib = `${sourcePath}/docker/config/libs/${lib}`;
            this.writeLog(` ${++i} - Transferindo lib ${sourceLib} para ${fullDirPath}/${fileName} ...`);
            await this.powerShellService.runCommand(`multipass exec ${server.name} -- mkdir -p ${fullDirPath}`);
            await this.powerShellService.runCommand(`multipass transfer ${sourcePath}/docker/config/libs/${lib} ${server.name}:${fullDirPath}/${fileName}`);
            await this.powerShellService.runCommand(`multipass exec ${server.name} -- chown -Rf 1001:0 ${fullDirPath}`);
        }
    }

    //@BPMNActivity('C008')
    async mountVolume(server: IServer, localPath: string, vmPath: string): Promise<void> {
        try {
            // Verifica se localPath contém "C:\" e substitui "/" por "\"
            if (localPath.includes("C:\\")) {
                localPath = localPath.replace(/\//g, '\\');
            }

            const result = await this.powerShellService.runCommand(`multipass mount ${localPath} ${server.name}:${vmPath}`);
            this.writeLog(`Volume de ${localPath} montado em ${vmPath}: ${result}`);
        } catch (error) {
            if (error.message && error.message.includes('is already mounted in')) {
                this.writeLog(`Volume de ${localPath} já está montado em ${vmPath}`);
            } else {
                this.writeLog(`Erro ao montar volume de ${localPath} para ${vmPath}: ${error}`);
                throw error;
            }
        }
    }


    //@BPMNActivity('C008.5')
    async runServerScript(filePath: string): Promise<void> {
        try {
            const command = `multipass exec ${this.DEV_SERVER_NAME} -- bash ${filePath}`;
            await this.powerShellService.runCommand(`multipass exec ${this.DEV_SERVER_NAME} -- chmod +x ${filePath}` );
            console.log(`chmod +x ${filePath} executado com sucesso.`);
            const result:string = await this.powerShellService.runCommand(command);
            console.log(`Script ${filePath} executado com sucesso.`);
            console.log(`Resultado do script:`,result);
            this.writeLog(`Script ${filePath} executado com sucesso.`);
        } catch (error) {
            this.writeLog(`Erro ao executar o script ${filePath}: ${error}`);
            console.error(`Erro ao executar o script ${filePath}:`, error);
            //await this.powershellService.stopMultipass();
        }
    }

    //@BPMNActivity('C00X.0')
    async runCommandOnServer(command: string): Promise<void> {
        try {
            await this.powerShellService.runCommand(`multipass exec ${this.DEV_SERVER_NAME} -- ${command}`);
        } catch (error) {
            this.writeLog(`Erro ao executar comando no servidor: ${command}, erro: ${error}`);
            throw error;
        }
    }

    async pathExists(path: string): Promise<boolean> {
        try {
            const result = await this.powerShellService.runCommand(`Test-Path -Path ${path}`);
            return result.trim().toLowerCase() === 'true';
        } catch (error) {
            this.writeLog(`Erro ao verificar se o caminho existe: ${path}, erro: ${error}`);
            throw error;
        }
    }

    async generateKeystore(serverName: string, keystorePath: string): Promise<void> {
        try {
            this.writeLog(`Gerando keystore no servidor ${serverName}...`);

            const command = `keytool -genkeypair -alias liberty -keyalg RSA -keystore ${keystorePath}/keystore.jks -storepass changeit -validity 365 -keysize 2048`;
            const result = await this.powerShellService.runCommand(`multipass exec ${serverName} -- bash -c "${command}"`);
            console.log(`RESULT ao gerar keystore: `, result);

            if (result.includes("Keystore gerado com sucesso")) {
                this.writeLog(`Keystore gerado com sucesso em ${keystorePath}.`);
            } else {
                this.writeLog(`Falha ao gerar o keystore: ${result}`);
                throw new Error(`Falha ao gerar o keystore: ${result}`);
            }
        } catch (error) {
            this.writeLog(`Erro ao gerar keystore: ${error}`);
            console.error(`Erro ao gerar keystore:`, error);
        }
    }

    async createJaegerContainer(): Promise<void> {
        try {
            this.writeLog("Criando container Jaeger...");
            await this.mountVolume(this.server,this.JAEGER_PATH,`${this.SERVER_TOOLS_PATH}/system/monitoring/jaeger`);
            await this.runCommandOnServer(`docker-compose -f "${this.SERVER_TOOLS_PATH}/system/monitoring/jaeger/docker-compose.yml" up -d`);
            this.writeLog("Contêiner Jaeger criado com sucesso.");
        } catch (error) {
            this.writeLog(`Erro ao criar container Jaeger: ${error}`);
            console.error('Erro ao criar container Jaeger:', error);
        }
    }

    async createPrometheusContainer(): Promise<void> {
        try {
            this.writeLog("Criando container Prometheus...");
            await this.mountVolume(this.server,this.PROMETHEUS_PATH, `${this.SERVER_TOOLS_PATH}/system/monitoring/prometheus`);
            await this.runCommandOnServer(`docker-compose -f "${this.SERVER_TOOLS_PATH}/system/monitoring/prometheus/docker-compose.yml" up -d`);
            this.writeLog("Contêiner Prometheus criado com sucesso.");
        } catch (error) {
            this.writeLog(`Erro ao criar container Prometheus: ${error}`);
            console.error('Erro ao criar container Prometheus:', error);
        }
    }

    //@BPMNActivity('C008.3')
    async isContainerRunning(containerName: string): Promise<boolean> {
        try {
            const command = `multipass exec ${this.DEV_SERVER_NAME} -- bash -c "docker ps --filter 'name=${containerName}' --filter 'status=running' --format '{{.Names}}'"`;
            const result = await this.powerShellService.runCommand(command);
            return result.trim() === containerName;
        } catch (error) {
            console.error(`Erro ao verificar se o container ${containerName} está em execução:`, error);
            return false;
        }
    }

    //TODO Deixar mais genérico, e criar o arquivo localmente em sourcePath/docker
    async createTempScript(command: string,scriptPath:string,containerName:string ): Promise<string> {
        const tempScriptPath = `/tmp/run_${containerName}.sh`;
        const scriptContent = `#!/bin/bash\n${command}`;
        const escapedScriptContent = scriptContent.replace(/"/g, '\\"').replace(/\n/g, '\\n');
        await this.powerShellService.runCommand(`multipass exec ${this.DEV_SERVER_NAME} -- bash -c "echo -e \\"#!/bin/bash\\n${escapedScriptContent}\\" > ${tempScriptPath}"`);
        await this.powerShellService.runCommand(`multipass exec ${this.DEV_SERVER_NAME} -- chmod +x ${tempScriptPath}`);
        return tempScriptPath;
    }

    /**
     *  Constrói um containerName a partir do docker-compose e roda e faz build da aplicação
     *  Caso o script de build não esteja no run.sh, a compilação pode ser feita na IDE
     *  e o deploy no conteiner ocorrerá automaticamemnte.
     */
    //@BPMNActivity('C008.2')
    async buildAndRunDynamicContainer(server:IServer, containerName:string, runScriptPath:string): Promise<void> {
        try {
            this.server = server;
            this.writeLog(`Verificando se o container ${containerName} está em execução...`);
            const isRunning = await this.isContainerRunning(containerName);
            if (isRunning) {
                await this.stopAndRemoveContainer(containerName);
            }
            this.writeLog("Construindo o projeto e iniciando Docker Compose...");
            console.log("Rodando executor: ",runScriptPath);
            await this.runServerScript(runScriptPath);

            this.writeLog(`Contêiner ${containerName} iniciado com sucesso.`);
        } catch (error) {
            this.writeLog(`Erro ao iniciar o container ${containerName}: ${error}`);
            console.error(`Erro ao iniciar o container ${containerName}:`, error);
        }
    }

    /**
     *
     * Roda a aplicação no open-liberty dentro de um container construído a partir do Dockerfile
     * (não usa o docker-compose pra isso)
     *
     */
    async executeLibertyAppDev(): Promise<void> {
        try {
            this.writeLog("Verificando se o container open-liberty está em execução...");
            const isRunning = await this.isContainerRunning('open-liberty');
            if (isRunning) {
                await this.stopAndRemoveContainer('open-liberty');
            }

            this.writeLog("Executando Liberty App em modo dev...");
            const command = `-- bash -c "cd ${this.SERVER_BACKEND_APP_PATH}/java/poc/open-liberty && mvn liberty:devc"`;
            await this.runCommandOnServer(command);
            this.writeLog("Liberty App em modo dev iniciado com sucesso.");
        } catch (error) {
            this.writeLog(`Erro ao executar Liberty App em modo dev: ${error}`);
            console.error('Erro ao executar Liberty App em modo dev:', error);
        }
    }

    async unmountOpenLibertyVolume(): Promise<void> {
        try {
            this.writeLog("Desmontando o volume...");
            const command = `multipass umount ${this.DEV_SERVER_NAME}:${this.SERVER_BACKEND_APP_PATH}/java/poc/open-liberty`;
            const result = await this.powerShellService.runCommand(command);

            if (result.trim().length === 0) {
                this.writeLog("Desmontagem concluída com sucesso.");
            } else {
                this.writeLog("Erro: Falha ao desmontar o volume.");
                throw new Error("Falha ao desmontar o volume.");
            }
        } catch (error) {
            this.writeLog(`Erro ao desmontar o volume: ${error}`);
            console.error('Erro ao desmontar o volume:', error);
        }
    }

    //@BPMNActivity('C008.4')
    async stopAndRemoveContainer(containerName: string): Promise<void> {
        try {
            this.writeLog(`Parando e removendo o container ${containerName}...`);

            await this.runCommandOnServer(`docker stop ${containerName}`);
            this.writeLog(`Contêiner ${containerName} parado.`);

            await this.runCommandOnServer(`docker rm ${containerName}`);
            this.writeLog(`Contêiner ${containerName} removido.`);

        } catch (error) {
            this.writeLog(`Erro ao parar e remover o container ${containerName}: ${error}`);
        }
    }

    async restartContainer(containerName: string): Promise<void> {
        try {
            this.writeLog(`Reiniciando o container ${containerName}...`);

            await this.runCommandOnServer(`docker restart ${containerName}`);
            this.writeLog(`Contêiner ${containerName} reiniciado.`);
            //this.powershellService.showNotification('Aviso!',`Contêiner ${containerName} reiniciado.`);

        } catch (error) {
            this.writeLog(`Erro ao reiniciar o container ${containerName}: ${error}`);
        }
    }

    async stopContainer(containerName: string): Promise<void> {
        try {
            this.writeLog(`Parando o container ${containerName}...`);
            console.log(`Parando o container ${containerName}...`);

            await this.runCommandOnServer(`docker stop ${containerName}`);
            this.writeLog(`Contêiner ${containerName} parado.`);
            console.log(`Contêiner ${containerName} parado.`);

        } catch (error) {
            this.writeLog(`Erro ao parar o container ${containerName}: ${error}`);
            console.log(`Erro ao parar o container ${containerName}: ${error}`);
        }
    }

    async startContainer(containerName: string): Promise<void> {
        try {
            this.writeLog(`Inicializando o container ${containerName}...`);

            await this.runCommandOnServer(`docker start ${containerName}`);
            this.writeLog(`Contêiner ${containerName} inicializado.`);

        } catch (error) {
            this.writeLog(`Erro ao inicializar o container ${containerName}: ${error}`);
        }
    }

    async startProxyServer(): Promise<any> {
        try {
            const command = `${this.nodeInterpreterPath}`;
            const response =  await this.powerShellService.runBackgroundProcess(command,this.reverseProxyFilePath);

            console.log(`::PROXY::: `, response);

        } catch (error) {
            console.error(`Falha ao iniciar o processo Node.js: `, error);
            //this.powershellService.showNotification('ERRO',`Falha ao iniciar o processo Node.js`);
            return false;
        }
    }

    async stopProxyServer(proxyId?: number): Promise<void> {
        try {
            const processIdToStop = proxyId || this.reverseProxyProcessId;
            if (processIdToStop) {
                await this.powerShellService.runCommand(`Stop-Process -Id ${processIdToStop}`);
                this.writeLog(`Processo Node.js com ID ${processIdToStop} finalizado.`);
                if (!proxyId) {
                    await this.clearGlobalProxyProcessId();
                }
            } else {
                this.writeLog('Nenhum processo Node.js ativo encontrado para finalizar.');
            }
        } catch (error) {
            this.writeLog(`Erro ao parar o servidor proxy: ${error}`);
            console.error('Erro ao parar o servidor proxy:', error);
        }
    }

    async generateCertPem(): Promise<void> {
        const certsDir = this.certsDir;
        const keytool = this.KeytoolExecutable;
        const keyAlias = 'devkey';
        const keyPassword = 'changeit'; // Use uma senha forte
        const keyStore = `${certsDir}\\dev-keystore.jks`;
        const csrFile = `${certsDir}\\dev-csr.pem`;
        const certFile = `${certsDir}\\dev-cert.pem`;

        try {
            if (!await this.pathExists(keytool)) {
                this.writeLog(`O keytool.exe não foi encontrado no caminho especificado: ${keytool}`);
                return;
            }

            if (!await this.pathExists(certsDir)) {
                await this.powerShellService.runCommand(`New-Item -ItemType Directory -Path ${certsDir}`);
            }

            this.writeLog('Gerando chave privada para armazená-la no KeyStore...');
            await this.runKeytoolCommand([
                '-genkeypair',
                `-alias ${keyAlias}`,
                '-keyalg RSA',
                '-keysize 2048',
                `-keystore ${keyStore}`,
                `-storepass ${keyPassword}`,
                `-keypass ${keyPassword}`,
                `-dname "CN=localhost, OU=Dev, O=YourCompany, L=YourCity, S=YourState, C=YourCountry"`
            ], keytool);

            if (!await this.pathExists(keyStore)) {
                this.writeLog(`Erro: KeyStore ${keyStore} não foi criado.`);
                return;
            }

            this.writeLog('Gerando um Certificate Signing Request (CSR)...');
            await this.runKeytoolCommand([
                '-certreq',
                `-alias ${keyAlias}`,
                `-keystore ${keyStore}`,
                `-file ${csrFile}`,
                `-storepass ${keyPassword}`,
                `-keypass ${keyPassword}`
            ], keytool);

            if (!await this.pathExists(csrFile)) {
                this.writeLog('Erro: CSR não foi criado.');
                return;
            }


            this.writeLog('Gerando certificado autoassinado...');
            await this.runKeytoolCommand([
                '-gencert',
                `-infile ${csrFile}`,
                `-outfile ${certFile}`,
                `-alias ${keyAlias}`,
                `-keystore ${keyStore}`,
                `-storepass ${keyPassword}`,
                `-keypass ${keyPassword}`,
                '-validity 365'
            ], keytool);

            if (!await this.pathExists(certFile)) {
                this.writeLog('Erro: Certificado não foi criado.');
                return;
            }

            this.writeLog(`Certificados gerados com sucesso no diretório ${certsDir}`);
        } catch (error) {
            this.writeLog(`Erro ao gerar certificados: ${error}`);
            console.error('Erro ao gerar certificados:', error);
        }
    }

    async getTempLogFile(): Promise<string> {
        const result = await this.powerShellService.runCommand('[System.IO.Path]::GetTempFileName()');
        return result.trim();
    }

    async getGlobalProxyProcessId(): Promise<number> {
        // Implemente a lógica para obter o ID do processo global do proxy
        return 0; // Exemplo
    }

    async clearGlobalProxyProcessId(): Promise<void> {
        // TODO Implementar a lógica para limpar o ID do processo global do proxy
    }

    async runKeytoolCommand(args: string[], keytool: string): Promise<void> {
        const command = `${keytool} ${args.join(' ')}`;
        const output = await this.powerShellService.runCommand(command);
        this.writeLog(`Comando: ${command}`);
        this.writeLog(output);
    }

    extractProcessId(processOutput: string): number {
        const regexJson = /"pid":\s*(\d+)/;
        const matchJson = processOutput.match(regexJson);

        if (matchJson && matchJson[1]) {
            return parseInt(matchJson[1], 10);
        }

        return null;
    }

    matchServerName(serversList: string, serverName: string): boolean {
        const regex = new RegExp(serverName, 'i'); // 'i' para case insensitive match
        return regex.test(serversList);
    }

    //@BPMNActivity('C007.6')
    async stopServer(serverName:string): Promise<any> {
        return this.powerShellService.runCommand('multipass stop '+serverName);
    }

    async startServer(serverName:string): Promise<any> {
        return this.powerShellService.runCommand('multipass start '+serverName);
    }

    //@BPMNActivity('C007.4')
    async purge(): Promise<any> {
        return this.executeCommand('multipass purge');
    }

    //@BPMNActivity('C007.5')
    async deleteServer(serverName:string='dev-server'): Promise<string> {
        let response:string;
        //const exists = await this.serverExists(serverName);
       // if (exists) {
            this.writeLog('D1 - SERVER '+serverName+' encontrada. Excluindo...');
            await this.stopServer(serverName);
            await this.executeCommand('multipass delete '+serverName);
            response = await this.executeCommand('multipass purge');
            this.writeLog('D2 - SERVER '+serverName+' excluído.');
       // }
        return response;
    }

    //@BPMNActivity('C007')
    async createServer(server:IServer):Promise<string> {
        this.server = server;
        this.writeLog(`4 - Criando o SERVER '+server.name+' [Ubuntu Server | cpus: ${server.cpus} | mem: ${server.mem} | disk: ${server.disk}]`);
        return await this.serverExists(server).then(async result => {
            console.log('Server Exists:: ', result);
            if (result===true) {
                console.log('call deleteSERVER:: ', result);
                const vmInfo = await this.getServerInfo(this.server.name);
                if (vmInfo.state==='Deleted') {
                    await this.purge();
                    return await this.launch(server);
                }else{
                    return await this.deleteServer().then(async value1 => {
                        console.log('deleteSERVER executed:: ', value1);
                        return await this.launch(server);
                    });
                }
            }else{
                return await this.launch(server);
            }
        });
    }


    //@BPMNActivity('C007.2')
    private async launch(server:IServer) {
        return await this.launchServer(server).then(async value1 =>{
            this.writeLog('launchServer executado:: '+ value1);
            return value1;
        });
    }

    //@BPMNActivity('C007.3')
    private launchServer(server:IServer) {
        console.log('Executando launchServer::');
        //return new Promise((resolve) => 'OK');
        return this.executeCommand('multipass launch --name '+server.name+` --cpus ${server.cpus} --memory ${server.mem} --disk ${server.disk}`);
    }

    async killMultipassProcesses(): Promise<void> {
        try {
            await this.powerShellService.killProcess('multipass');
            await this.powerShellService.killProcess('multipassd');
            this.writeLog('Processos multipass e multipassd finalizados com sucesso.');
        } catch (error) {
            this.writeLog(`Erro ao finalizar processos multipass e multipassd: ${error}`);
            console.error('Erro ao finalizar processos multipass e multipassd:', error);
        }
    }

    //@BPMNActivity('C007.2')
    async getServerInfo(serverName: string): Promise<ServerInfo> {
        const result = await this.executeCommand(`multipass info ${serverName}`);
        return this.parseServerInfo(result);
    }

    private parseServerInfo(data: string): ServerInfo {

        if (data.includes('info failed')) {
            const lines = data.split('\n');
            const errorMessage = lines.slice(1).join(' ').trim().split('"').join("'");
            return { error: errorMessage };
        }

        const lines = data.split('\n');
        const serverInfo: Partial<ServerInfo> = {};

        lines.forEach(line => {
            const [key, value] = line.split(':').map(part => part.trim());

            switch (key) {
                case 'Name':
                    serverInfo.name = value;
                    break;
                case 'State':
                    serverInfo.state = value;
                    break;
                case 'Snapshots':
                    serverInfo.snapshots = parseInt(value, 10);
                    break;
                case 'IPv4':
                    if (!serverInfo.ipv4) serverInfo.ipv4 = [];
                    serverInfo.ipv4.push(...value.split(/\s+/));
                    break;
                case 'Release':
                    serverInfo.release = value;
                    break;
                case 'Image hash':
                    serverInfo.imageHash = value;
                    break;
                case 'CPU(s)':
                    serverInfo.cpus = parseInt(value, 10);
                    break;
                case 'Load':
                    serverInfo.load = value.split(' ');
                    break;
                case 'Disk usage':
                    serverInfo.diskUsage = value;
                    break;
                case 'Memory usage':
                    serverInfo.memoryUsage = value;
                    break;
                case 'Mounts':
                    // Mounts could also be multiline, just storing as array for now
                    serverInfo.mounts = value ? [value] : [];
                    break;
            }
        });

        return serverInfo as ServerInfo;
    }


    async getContainerInfo(containerName: string): Promise<ContainerInfo> {
        try {
            const result = await this.executeCommand(`multipass exec ${this.SERVER_NAME} -- docker inspect ${containerName}`);
            console.log('1 - containerInfo result:: ', result);
            //console.log('2 - containerInfo result:: ', JSON.parse(result));
            const match = this.verifyIfServerExists(result);
            if (match) {
                throw new Error(`O ${this.SERVER_NAME} não existe.`);
            }



            return this.parseContainerInfo(containerName,result);
        } catch (error: any) {
            console.log('error.message:: ',error.message);
            if (error.message.includes(`Error: No such object: ${containerName}`)) {
                return this.parseContainerInfo(containerName,undefined);
            } else {
                console.error(`An error occurred while retrieving container info: ${error.message}`);
                return Promise.reject(error);
            }
        }
    }

    verifyIfServerExists(result: string) {
        const regex = /exec failed: The following errors occurred:\s+instance "([a-zA-Z0-9]+)" does not exist/;
        const match = result.match(regex);
        return match;
    }

    private parseContainerInfo(containerName:string, infoString: string): ContainerInfo {




        let infoArray:any;
        let containerInfo:ContainerInfo;

        const infoStringTemplate = `[
                            {
                                "Id": null,
                                "Created": null,
                                "Path": null,
                                "Args": [],
                                "State": {
                                    "Status": null,
                                    "Running": false,
                                    "Paused": false,
                                    "Restarting": false,
                                    "OOMKilled": false,
                                    "Dead": false,
                                    "Pid": null,
                                    "ExitCode": 0,
                                    "Error": "",
                                    "StartedAt": null,
                                    "FinishedAt": null
                               }
                            }
                        ]`;
        if(undefined === infoString || infoString == '[]') {
            containerInfo = this.getContainerInfoParsed(infoStringTemplate);
            console.log('1 - ::::STATE:::: ', containerInfo.state);
            console.log('1 - ::::containerInfo:::: ', containerInfo);
            containerInfo.state.status = 'NotCreated';
        } else {
            infoArray = JSON.parse(infoString);

            if( infoArray.length === 0){
                containerInfo = this.getContainerInfoParsed(infoStringTemplate);
                console.log('1 - ::::STATE:::: ', containerInfo.state);
                containerInfo.state.status = 'NotCreated';
                console.log('1 - ::::Parsing:::: ', containerInfo);
            } else {
                containerInfo =  convertToClass<ContainerInfo>(infoArray[0]);
                console.log('2 - ::::Parsing:::: ', containerInfo);
                if(undefined === containerInfo.state || null === containerInfo.state?.status){
                    const stateTemplate:string = `{
                                        "status": null,
                                        "running": false,
                                        "paused": false,
                                        "restarting": false,
                                        "oOMKilled": false,
                                        "dead": false,
                                        "pid": null,
                                        "exitCode": 0,
                                        "error": "",
                                        "startedAt": null,
                                        "finishedAt": null
                                   }`;
                    containerInfo.state = JSON.parse(stateTemplate);
                    if( null !== containerInfo.created ){
                        console.log('3 - ::::STATE:::: ', containerInfo.state);
                        containerInfo.state.status = 'Stopped';
                    }else{
                        console.log('4 - ::::STATE:::: ', containerInfo.state);
                        containerInfo.state.status = 'NotCreated';
                    }
                }
            }
        }

        if (null !== containerInfo) {
            return containerInfo;
        } else {
            containerInfo = this.getContainerInfoParsed(infoStringTemplate);
            this.writeLog(`No information found for the ${containerName} container`);
            //this.powershellService.showNotification('ERRO!',`No information found for the specified container`);
            return containerInfo;
        }
    }

    private getContainerInfoParsed(infoStringTemplate: string) {
        return convertToClass<ContainerInfo>(JSON.parse(infoStringTemplate)[0]);
    }

    async runCommandInContainer(serverName: string, containerName: string, command: string): Promise<string> {
        const fullCommand = `multipass exec ${serverName} -- docker exec ${containerName} ${command}`;
        return this.executeCommand(fullCommand);
    }
}
