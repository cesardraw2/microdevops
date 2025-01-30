import {Component, Injector} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BpmnService} from "app/modules/admin/bpmn/bpmn-lib";
import {setInjector} from "app/modules/admin/bpmn/bpmn-activity-decorator";
import {HttpInterceptorService} from "app/core/telemetry/http-interceptor.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss'],
    standalone : true,
    imports    : [RouterOutlet],
    providers  : [
        BpmnService,
        { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
    ]
})
export class AppComponent
{
    /**
     * Constructor
     */
    constructor(injector: Injector)
    {
        setInjector(injector);
    }
}
