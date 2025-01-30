import {Component, effect, EventEmitter, Input, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {ServiceConteiner} from "app/modules/admin/models/serviceConteiner";
import {IServiceContainer} from "app/modules/admin/models/service-conteiner.types";
import {ContainerInfo} from "app/modules/admin/services/ContainerInfo";
import {InstallService} from "app/modules/admin/services/install.service";
import {ConverterDecorator} from "app/core/util/converter-decorator";
import {toCapitalize} from "app/core/util/string-utils";
import {TimerComponent} from "app/modules/admin/timer/timer.component";

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [
    MatProgressSpinner,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    NgIf,
    TimerComponent
  ],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent implements OnInit {

  @ConverterDecorator<ContainerInfo>
  containerInfo: ContainerInfo;

  private _dataProvider: WritableSignal<IServiceContainer> = signal<IServiceContainer>(new ServiceConteiner());

  @Input()
  set dataProvider(value: IServiceContainer) {
    this._dataProvider.set(value);
    this.changeStatus(this.dataProvider.status);
    this.updateShowTimer(this.dataProvider.status);
  }

  get dataProvider(): IServiceContainer {
    return this._dataProvider();
  }

  @Input()
  devServerIsRunning: WritableSignal<boolean|null> = signal(false);

  @Output() doViewInBrowser = new EventEmitter<IServiceContainer>();
  @Output() doOpenTerminal = new EventEmitter<IServiceContainer>();
  @Output() doOpenConfiguration = new EventEmitter<IServiceContainer>();
  @Output() doClose = new EventEmitter<IServiceContainer>();
  @Output() doStop = new EventEmitter<IServiceContainer>();
  @Output() doViewInfo = new EventEmitter<IServiceContainer>();
  @Output() doStart = new EventEmitter<IServiceContainer>();
  @Output() doReload = new EventEmitter<IServiceContainer>();
  @Output() doDestroy = new EventEmitter<IServiceContainer>();
  @Output() doCreate = new EventEmitter<IServiceContainer>();

  protected enabledClass: string='bg-card';
  protected isLoading:WritableSignal<boolean> = signal<boolean>(false);
  protected showTimer: boolean = false;


  constructor(private installService:InstallService) {
    effect(() => {

      console.log(`this.devServerIsRunning():: `,this.devServerIsRunning());
      console.log(`effect chamado para ${this.dataProvider.serviceName} `,this.dataProvider.status);
      if (this.devServerIsRunning() === true) {
        this.verifyStatus().then(r => {
          console.log('Initialize executed on ngOnChanges.');
        });

        console.log('this.dataProvider.status:::', this.dataProvider.status);
        this.updateIsLoading(toCapitalize(this.dataProvider.status));
      }

    }, { allowSignalWrites: true });
  }

  loadOrReload() {
    if(this.dataProvider.status === 'Running'){
      this.changeStatus('Reloading');
      this.doReload.emit(this.dataProvider);
    } else if(this.dataProvider.status === 'Stopped' || this.dataProvider.status === 'Exited') {
      this.changeStatus('Loading');
      this.doStart.emit(this.dataProvider);
    }
  }

  stopOrStart() {
    console.log('stopOrStart',this.dataProvider);
    if(this.dataProvider.status === 'Running'){
      this.changeStatus('Stopping');
      this.doStop.emit(this.dataProvider);
    } else if(this.dataProvider.status === 'Stopped' || this.dataProvider.status === 'Exited') {
      this.changeStatus('Loading');
      this.doStart.emit(this.dataProvider);
    }
  }

  createOrDestroy() {
    if(this.dataProvider.isCreated !== null && this.dataProvider.isCreated === true){
      this.changeStatus('Destroying');
      this.doDestroy.emit(this.dataProvider);
    } else {
      this.dataProvider.isEnabled = true;
      this.changeStatus('Loading');
      this.doCreate.emit(this.dataProvider);
    }
  }

  viewInBrowser() {
    console.log('TODO: Implementar carregamento da URL do item no browser e abrir a aba WebBrowser.');
    this.doViewInBrowser.emit(this.dataProvider);
  }

  openTerminal() {
    this.doOpenTerminal.emit(this.dataProvider);
  }

  viewInfo() {
    console.log('TODO: Implementar carregamento da URL do item no browser e abrir a aba WebBrowser.');
    this.doViewInfo.emit(this.dataProvider);
  }

  openConfiguration() {
    console.log('TODO: Implementar carregamento da configuração (DockerFile e dockercompose.yml).');
    this.doOpenConfiguration.emit(this.dataProvider);
  }

  changeStatus(status:string){
    //if(status !== null && status !== 'Waiting') {
      this.dataProvider.status = toCapitalize(status);
      console.log('changeStatus:: ', this.dataProvider.status);
      this.updateIsLoading(this.dataProvider.status);
      this.updateShowTimer(this.dataProvider.status);
   // }
  }

  private updateIsLoading(status: string) {
    switch (status) {
      case 'Reloading':
      case 'Destroying':
      case 'Creating':
      case 'Loading':
      case 'Stopping':
        this.isLoading.set(true);
        break;
      default:
        this.isLoading.set(false);
        break;
    }
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

//@Delay(1000)
  //@Interval(60)
    async verifyStatus(): Promise<void> {
    if(!this.dataProvider.isEnabled){
      this.changeStatus('Disabled');
      console.log(`DataProvider não habilitado!`, this.dataProvider);
      return Promise.reject(false);
    }

    if (this.devServerIsRunning()===true) {
      try {
        console.log(`this.dataProvider ${this.dataProvider.serviceName} :: `, this.dataProvider);
        this.containerInfo = await this.installService.getContainerInfo(this.dataProvider.serviceName);
        console.log(`A - containerInfo ${this.dataProvider.serviceName} :: `, this.containerInfo);
        this.changeStatus(this.containerInfo.state?.status);
        //this.updateIsLoading(this.containerInfo.state.status);
        this.dataProvider.isCreated = this.containerInfo.created !== null;
      } catch (error) {
        console.error(`Erro ao obter informações do container ${this.dataProvider.serviceName}: `, error);
        return Promise.reject(error);
      }
    }
  }

  async initialize(){
      //## await this.verifyStatus();
  }

   ngOnInit(): void {
    this.initialize().then(r => {
      console.log('Initialize executed.');
      this.enabledClass = this.dataProvider.isEnabled ? 'bg-card' : 'NotIsEnabled';
    });
  }

  ngOnDestroy() {
    // ngOnDestroy logic (if any)
    console.log('Component is being destroyed. Cleaning up...');
  }

}
