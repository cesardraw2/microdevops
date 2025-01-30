import {Component, ViewEncapsulation} from '@angular/core';
import {DashboardComponent} from "app/modules/admin/dashboard/dashboard.component";
import {LogComponent} from "app/modules/admin/log/log.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {IServiceContainer} from "app/modules/admin/models/service-conteiner.types";
import {JsonPipe} from "@angular/common";
import {CorpDrawerComponent} from "corp/components/drawer";
import {BooleanInput} from "@angular/cdk/coercion";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
    selector: 'example',
    standalone: true,
    templateUrl: './example.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        DashboardComponent,
        LogComponent,
        MatTab,
        MatTabGroup,
        JsonPipe,
        CorpDrawerComponent,
        MatIcon,
        MatIconButton
    ]
})
export class ExampleComponent
{
    protected selectedIndex: number = 0;
    protected serviceInfo: IServiceContainer = null;
    protected serviceConfig: IServiceContainer = null;
    protected drawerOpened: BooleanInput=false;

    constructor()
    {
    }

    openConfiguration($event: any) {
        this.selectedIndex = $event.selectedIndex;
        this.serviceConfig = $event.serviceContainerSelected;
        this.drawerOpened = true;
    }


    viewInfo($event: any) {
        this.selectedIndex = $event.selectedIndex;
        this.serviceInfo = $event.serviceContainerSelected;
        this.drawerOpened  = true;
    }

    toggleDrawerOpen(): void
    {
        this.drawerOpened = !this.drawerOpened;
    }

    drawerOpenedChanged(opened: boolean): void
    {
        this.drawerOpened = opened;
    }

}
