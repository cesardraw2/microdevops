import {Component, EventEmitter, OnDestroy, OnInit, Output, signal, ViewChild, WritableSignal} from '@angular/core';
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {ServiceCardComponent} from "app/modules/admin/service-card/service-card.component";
import {EnvironmentActionsComponent} from "app/modules/admin/environment-actions/environment-actions.component";
import {ServiceActionsComponent} from "app/modules/admin/service-actions/service-actions.component";
import {ConteinersService} from "app/modules/admin/services/conteiners.service";
import {Subject, takeUntil} from "rxjs";
import {IServiceContainer} from "app/modules/admin/models/service-conteiner.types";
import {NgForOf, NgIf} from "@angular/common";
import {TranslocoDirective} from "@ngneat/transloco";
import {BpmnComponent} from "app/modules/admin/bpmn/bpmn.component";
import {HttpClient} from "@angular/common/http";
import {InstallService} from "app/modules/admin/services/install.service";
import {ContainerInfo} from "app/modules/admin/services/ContainerInfo";
import {LogInstallService} from "app/core/log/log-service.service";
import {ConverterDecorator} from "app/core/util/converter-decorator";
import {toCapitalize} from "app/core/util/string-utils";
import {IServer} from "app/modules/admin/image-launch/IServer";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {TerminalComponent} from "app/modules/admin/terminal/terminal.component";
import {LogComponent} from "app/modules/admin/log/log.component";
import {WebBrowserComponent} from "app/modules/admin/web-browser/web-browser.component";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        MatTabGroup,
        MatTab,
        ServiceCardComponent,
        EnvironmentActionsComponent,
        ServiceActionsComponent,
        NgForOf,
        NgIf,
        TranslocoDirective,
        BpmnComponent,
        MatButton,
        MatIcon,
        TerminalComponent,
        LogComponent,
        WebBrowserComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {


    title = 'bpmn-js-angular';
    diagramUrl = 'assets/bpmn/diagram.bpmn';
    importError?: Error;
    protected devServerIsRunning = signal<boolean | null>(false);

    @ConverterDecorator<ContainerInfo>
    containerInfo: ContainerInfo;
    protected serviceConteiners: WritableSignal<IServiceContainer[]> = signal<IServiceContainer[]>([]);
    protected proxyService: IServiceContainer;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    protected selectedService: IServiceContainer;
    protected selectedTabIndex = 0;
    @Output() doViewInfo = new EventEmitter<any>();
    @Output() doOpenConfiguration = new EventEmitter<any>();

    protected readonly signal = signal;


    @ViewChild(BpmnComponent) ucBpmn: BpmnComponent;
    xml: string = '';
    json: string = '';
    protected server: IServer;
    pageUrl: string=null;

    constructor(private http: HttpClient,
                private containersService: ConteinersService,
                protected installService: InstallService,
                private logInstallService: LogInstallService) {

    }


    ngOnInit(): void {
        this.setServicesListEvents();
        this.installService.startProxyServer().then(value => {
            console.log('ProxyServer inicializado.');
        });
    }

    private writeLog(message: string) {
        this.logInstallService.writeLog(message);
        console.log(message);
    }

    protected getServices(){
        this.serviceConteiners.set([]);
        this.containersService.getServices().subscribe();
    }

    private setServicesListEvents() {
        // Service
        this.containersService.service$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((proxyService: IServiceContainer) => {
                this.proxyService = proxyService;
            });

        // Services
        this.containersService.services$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((proxyServices: IServiceContainer[]) => {
                console.log('proxyServices >>> ',proxyServices);
                this.serviceConteiners.set(proxyServices);
            });

        // Selected service
        this.containersService.service$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((proxyService: IServiceContainer) => {
                this.selectedService = proxyService;
            });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    ngOnDestroy(): void {
        this.installService.stopProxyServer().then(value => {
            this.writeLog('ProxyServer parado.');
        });
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    protected async destroyContainer(serverName:string, serviceContainer: IServiceContainer): Promise<void> {
        return await this.installService.destroyContainer(serverName,serviceContainer);
    }

    protected async createDynamicContainer(serviceContainer: IServiceContainer): Promise<void> {
        await this.installService.createDynamicContainer(this.server, serviceContainer);
    }

    protected restart(serviceContainer: IServiceContainer): void {
        this.installService.restartContainer(serviceContainer.serviceName).then(response => {
            this.changeContainerDataProvider(serviceContainer,'Running');
        });
    }

    private changeContainerDataProvider(serviceContainer: IServiceContainer, status: string) {
        const updatedItem = {...serviceContainer, status: status};
        const updatedList = this.serviceConteiners().map(container =>
            container.serviceName === serviceContainer.serviceName ? updatedItem : container
        );
        this.serviceConteiners.set(updatedList);
    }

    protected viewInBrowser(item: IServiceContainer) {
        this.pageUrl = item.url;
        this.selectedTabIndex = 1;
        console.log('URL::  ',this.pageUrl );
    }
    protected openTerminal(item: IServiceContainer) {
        this.selectedService = item;
        this.selectedTabIndex = 3;

    }

    protected viewInfo(serviceContainer: IServiceContainer) {
        const data: any = {selectedIndex: 1, serviceContainerSelected: serviceContainer};
        this.doViewInfo.emit(data);
    }

    protected openConfiguration(serviceContainer: IServiceContainer) {
        const data: any = {selectedIndex: 2, serviceContainerSelected: serviceContainer};
        this.doOpenConfiguration.emit(data);
    }

    async create(serviceContainer: IServiceContainer): Promise<void> {
        try {
            // Inicia o processo de criação do contêiner dinâmico
            console.log(`Iniciando a criação do contêiner para o serviço: ${serviceContainer.serviceName}`);
            await this.createDynamicContainer(serviceContainer);

            // Obtém informações do contêiner criado
            this.containerInfo = await this.installService.getContainerInfo(serviceContainer.serviceName);
            console.log('Informações do contêiner:', this.containerInfo);

            // Define o estado de criação do contêiner
            serviceContainer.isCreated = this.containerInfo.created !== null;

            // Atualiza o estado do contêiner no data provider
            this.changeContainerDataProvider(serviceContainer, toCapitalize(this.containerInfo.state.status));

            console.log(`Contêiner para o serviço ${serviceContainer.serviceName} foi criado com sucesso.`);

        } catch (error) {
            // Log detalhado do erro encontrado
            console.error(`Erro durante a criação do contêiner para o serviço ${serviceContainer.serviceName}:`, error);
        }
    }

    async destroy(serviceContainer: IServiceContainer) {
        this.destroyContainer(this.server.name, serviceContainer).then(
            async value => {
                this.containerInfo = await this.installService.getContainerInfo(serviceContainer.serviceName);
                console.log('C - containerInfo:: ', this.containerInfo);
                serviceContainer.isCreated = this.containerInfo.created !== null;
                this.changeContainerDataProvider(serviceContainer, toCapitalize(this.containerInfo.state.status));
            }
        );
    }

    start(serviceContainer: IServiceContainer) {
        this.installService.startContainer(serviceContainer.serviceName).then(response => {
            this.changeContainerDataProvider(serviceContainer, "Running");
        });
    }

    stop(serviceContainer: IServiceContainer) {
        this.installService.stopContainer(serviceContainer.serviceName).then(response => {
            this.changeContainerDataProvider(serviceContainer, "Running");
        });
    }

    handleDevServerStatusChanged($events: any | null) {
        this.server = $events.server;
        this.devServerIsRunning.set($events.running);
    }



    async restartProxyServer() {
        await this.installService.stopProxyServer();
        await this.installService.startProxyServer();
    }
}

