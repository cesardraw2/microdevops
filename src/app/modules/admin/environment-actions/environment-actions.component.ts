import {Component, EventEmitter, inject, Output, signal, WritableSignal} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatIcon} from "@angular/material/icon";
import {MatRipple} from "@angular/material/core";
import {InstallService} from "app/modules/admin/services/install.service";
import {ServerInfo} from "app/modules/admin/services/ServerInfo";
import {CorpAlertService} from "corp/components/alert";
import {JsonPipe, NgIf} from "@angular/common";
import {IServer} from "app/modules/admin/image-launch/IServer";
import {Server} from "app/modules/admin/image-launch/Server";
import {CorpDrawerComponent} from "corp/components/drawer";
import {ImageLaunchComponent} from "app/modules/admin/image-launch/image-launch.component";
import {BooleanInput} from "@angular/cdk/coercion";
import {TimerComponent} from "app/modules/admin/timer/timer.component";


@Component({
  selector: 'app-environment-actions',
  standalone: true,
  imports: [
    MatButton,
    MatFormFieldModule,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatIcon,
    MatRipple,
    JsonPipe,
    CorpDrawerComponent,
    MatIconButton,
    ImageLaunchComponent,
    NgIf,
    TimerComponent
  ],
  templateUrl: './environment-actions.component.html',
  styleUrl: './environment-actions.component.scss'
})
export class EnvironmentActionsComponent {
  protected selectedProjectName: string = 'dev-server';
  protected server:IServer;
  protected devServerStatus:string;
  private corpAlertService = inject(CorpAlertService);

  protected devServerIsRunning = signal<boolean | null>(false);
  @Output() devServerStateChange = new EventEmitter<any | null>;
  protected drawerOpened: BooleanInput=false;
  showTimer: boolean = false;
  protected isLoading:WritableSignal<boolean> = signal<boolean>(false);

  constructor(private installService:InstallService) {
    this.devServerStatus = 'Waiting';
    this.isLoading.set(false);
    this.devServerIsRunning.set(false);
    this.setDefaultServer('dev-server');
    console.info('InstallService:: ',this.installService);

    this.getDevServerInfo().then(r => {
      this.isLoading.set(false);
      //this.devServerIsRunning.set(true);
      //this.devServerStatus = 'Running';
      // Carregar info dos conteiners.
    });
  }

   async launchServerTeste(server:IServer){
    try {
      const result = await this.installService.init(server); // Uso correto do await
      console.log('Resultado da inicialização:', result);
    } catch (error) {
      console.error('Erro durante a inicialização:', error);
    }
  };

  async launchServer(server:IServer=null) {
    this.isLoading.set(true);
    this.devServerStatus = "Creating";
    this.updateShowTimer(this.devServerStatus);
    server = !server?this.server:server;

    try {
      await this.installService.init(server).then(result=>{
      console.log('init RESULT:: ',result);
      const exists = this.installService.serverExists(server);
          if (!exists) {
            this.installService.writeLog(`O não existe uma instância de ${server.name}.`);
            throw new Error(`O não existe uma instância de ${server.name}.`);
          }

          this.installService.writeLog(`Passou aqui.`);
          this.devServerStatus = "Created";
          this.updateShowTimer(this.devServerStatus);
          this.devServerStateChange.emit({ server: server, running: true });
      }).catch(error =>{
        console.log('init Error:: ',error);
      });

    } catch (error) {
      this.installService.writeLog(`Erro ao criar o servidor: ${error}`);
      console.error('Erro ao criar o servidor: ', error);
      this.devServerStatus = "Error";
    } finally {
      this.isLoading.set(false);
    }

  }

  async startServer() {
    this.isLoading.set(true);
    this.devServerStatus = "Starting";
    this.updateShowTimer(this.devServerStatus);
    await this.installService.startServer(this.selectedProjectName).then(response=>{
      this.devServerStatus = "Running";
      this.handleDevServerStatusChanged(true);
      this.updateShowTimer(this.devServerStatus);
      this.isLoading.set(false);
    }).catch(reason=>{
      this.devServerStatus = "Error";
      console.log('Falha ao iniciar o server: ',reason);
    });
  }

  async stopServer() {
    this.isLoading.set(true);
    this.devServerStatus = "Stopping";
    this.updateShowTimer(this.devServerStatus);
    await this.installService.stopServer(this.selectedProjectName).then(response=>{
      this.devServerStatus = "Stopped";
      this.updateShowTimer(this.devServerStatus);
      this.isLoading.set(false);
    }).catch(reason=>{
      this.devServerStatus = "Error";
      console.log('Falha ao parar o server: ',reason);
    })
  }



  async launchVM() {
    try {
      const vmInfo = await this.installService.getServerInfo(this.selectedProjectName);
      if (vmInfo.state==='Deleted') {
        this.installService.writeLog(`\nVM ${this.selectedProjectName} is in deleted state. Deleting and recreating...`);
        await this.destroyServer();
        await this.installService.createServer(this.server);
        this.installService.writeLog(`\nVM ${this.selectedProjectName} recreated successfully.`);
      } else {
        this.installService.writeLog(`\nVM ${this.selectedProjectName} is not in deleted state. Launching...`);
        await this.installService.createServer(this.server);
        this.installService.writeLog(`\nVM ${this.selectedProjectName} launched successfully.`);
      }
    } catch (error) {
      this.installService.writeLog(`\nError: ${error.message}`);
    }
  }

  async destroyServer(): Promise<any> {
    this.isLoading.set(true);

    await this.stopServer().then(async response => {
      this.devServerStatus = "Stopped";
      this.updateShowTimer(this.devServerStatus);

      await this.deleteServer();
      this.isLoading.set(false);

    }).catch(reason=>{
      this.devServerStatus = "Error";
      console.log('Falha ao parar o server: ',reason);
    });
  }

  async deleteServer(): Promise<any> {
    this.devServerStatus = "Deleting";
    this.devServerStateChange.emit({server:this.server, running:false});
    return this.installService.deleteServer(this.selectedProjectName).then(value1 => {
      this.devServerStatus = "Deleted";
    });
  }

  async purge(): Promise<any> {
    this.devServerStatus = "Purging";
    this.devServerStateChange.emit({server:this.server, running:false});
    return this.installService.purge().then(value1 => {
      this.devServerStatus = "Purged";
    });
  }

  handleDevServerStatusChanged($events: boolean | null) {
    this.devServerIsRunning.set($events);
    this.devServerStateChange.emit({server:this.server, running:$events});
  }

  checkStringStatus(devServerInfo:any): string {
    if (devServerInfo['infoFailed'].includes('info failed')) {
      if (devServerInfo['infoFailed'].includes('does not exist')) {
        return 'NotCreated';
      }
    }
    return 'Error'; // Ou qualquer outro valor que você queira retornar se as verificações não forem verdadeiras
  }

  async getDevServerInfo() {
    //if(this.devServerIsRunning()){
    try {
      //this.devServerIsRunning.set(true);
      this.devServerStatus = 'Waiting';

      const devServerInfo: ServerInfo = await this.installService.getServerInfo(this.selectedProjectName);
      this.isLoading.set(false);
      this.devServerIsRunning.set(false);

      if (devServerInfo) { // Verifica se devServerInfo não é undefined
        if (typeof devServerInfo['infoFailed'] !== 'undefined') {
          this.devServerStatus = this.checkStringStatus(devServerInfo);
        } else {
          this.devServerStatus = devServerInfo.state;
        }
        this.handleDevServerStatusChanged(devServerInfo.state === 'Running');
        this.updateShowTimer(this.devServerStatus);
        console.log('devServerInfo:: ', JSON.stringify(devServerInfo));
      } else {
        // Tratar o caso em que devServerInfo é undefined
        this.devServerStatus = 'NotRunning';
        console.warn('Não foi possível obter informações do dev-server: o objeto retornado é undefined.');
      }
    } catch (error) {
      this.devServerStatus = 'NotRunning';
      //this.corpAlertService.show('alert-actions');
      console.info('Não foi possível obter informações do dev-server:', error);
    }

    //}
  }

  private updateShowTimer(status: string) {
    switch (status) {
      case 'Waiting':
      case 'NotCreated':
      case 'Exited':
      case 'NotIsEnabled':
      case null:
        this.showTimer = false;
        break;
      default:
        this.showTimer = true;
        break;
    }
  }

  showServerDatails() {

  }

  setSelectedServer($event) {
    console.log();
/*    this.server = $event.;
    this.selectedProjectName = this.server.name;*/
  }

  async onMenuItemClick(projectName: string): Promise<void> {
    this.setDefaultServer(projectName);
    await this.getDevServerInfo();
  }

  private setDefaultServer(projectName: string) {
    this.selectedProjectName = projectName;
    this.server = new Server();
    this.server.name = projectName;
    this.server.mem = '4G';
    this.server.disk = '50G';
    this.server.cpus = 3;
  }

  drawerOpenedChanged(opened: boolean): void
  {
    this.drawerOpened = opened;
  }
}
