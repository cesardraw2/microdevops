import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BpmnService } from "./bpmn-lib";
import {MatButton} from "@angular/material/button";
import {BPMNActivity, BPMNEvent} from "app/modules/admin/bpmn/bpmn-activity-decorator";
import {delay} from "rxjs";
import {Delay} from "app/core/util/delay";
import {MetricMethod, TraceMethod} from "app/core/telemetry/opentelemetry-decorators";

@Component({
    selector: 'app-bpmn',
    templateUrl: './bpmn.component.html',
    standalone: true,
    imports: [
        MatButton
    ],
    styleUrls: ['./bpmn.component.scss']
})
export class BpmnComponent implements OnChanges, OnDestroy, OnInit {

    @ViewChild('ref', { static: true }) private diagramContainer: ElementRef;
    @Input() protected url?: string;

    constructor(private http: HttpClient, private bpmnService: BpmnService) {

        this.bpmnService.doExecuteMethod.subscribe((activity) => {
            if (activity) {
                const methodName:string =  bpmnService.getBodyForStartEvent(activity);
                if (typeof (this as any)[methodName] === 'function') {
                    (this as any)[methodName].bind(this)();
                } else {
                    console.warn(`Method for ${activity.id} does not exist`, activity);
                }
            }
        });

        this.bpmnService.processLoaded.subscribe((loaded)=>{
            if (loaded) {
                console.info('::Start Process::');
                this.bpmnService.startProcess('init');
                console.info(':: After Start Process::');
            }
        })

    }

    ngOnInit(): void {
        this.bpmnService.bpmnJS.attachTo(this.diagramContainer.nativeElement);
    }

    ngOnDestroy(): void {
        this.bpmnService.bpmnJS.detach();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.url && !changes.url.firstChange) {
            //this.startDynamicProcess(this.url!);
        }
    }

    startDynamicProcess(url: string) {
        this.bpmnService.startDynamicProcess(url,this);
    }

    @BPMNActivity('A001',2000)
    @TraceMethod('A001')
    @MetricMethod('A001')
    function001(): void {
        console.log(':::: EXECUTING function001');
        this.bpmnService.setVariable('result', 2);
        // this.function002();
    }

    @BPMNActivity('A002',2000)
    function002(): void {
        console.log(':::: EXECUTING  function002');

    }

    @BPMNActivity('A003',2000)
    function003(): void {
        console.log(':::: EXECUTING  function003');
    }

    @BPMNEvent('init')
    functionInit(): void {
        console.log(':::: EXECUTING  functionInit');
    }

    @BPMNEvent('end')
    functionEnd(): void {
        console.log(':::: EXECUTING  functionEnd');
    }

    @BPMNActivity('G001.1')
    decision001(): void {
        console.log(':::: EXECUTING  decision001');
        console.info('::::RESULT '+this.bpmnService.getVariable('result'));
    }


}
