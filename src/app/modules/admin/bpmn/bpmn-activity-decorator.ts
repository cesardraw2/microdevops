import {BpmnService} from './bpmn-lib';
import {Injector} from '@angular/core';
import {Delay} from "app/core/util/delay";

// Singleton injector to access the BpmnService
let injector: Injector;

export function setInjector(inj: Injector) {
    injector = inj;
}


export function BPMNActivity(id: string, timeOut: number = null) {

    function continueAndApply(originalMethod: Function, self: any, args: any[], bpmnService: BpmnService, currentActivity: any) {
        originalMethod.apply(self, args);
        console.log(`[BPMN] Activity with ID ${id} : ${originalMethod.name}`);
        bpmnService.hideSpinner(id);
        bpmnService.colorActivity(id);
        bpmnService.continueExecuting(currentActivity);
    }

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const bpmnService = injector.get(BpmnService);
            const self = this;

            if (bpmnService) {
                const currentActivity = bpmnService.activities[id];

                if (currentActivity !== undefined && currentActivity.type === 'bpmn:Task') {
                    bpmnService.showSpinner(id);

                    if (timeOut) {
                        setTimeout(() => {
                            continueAndApply(originalMethod, self, args, bpmnService, currentActivity);
                        }, timeOut);
                    } else {
                        continueAndApply(originalMethod, self, args, bpmnService, currentActivity);
                    }

                } else {
                    if (currentActivity === undefined) {
                        console.warn(`Activity with ID ${id} not found in activities: `, bpmnService.activities);
                    } else {
                        bpmnService.colorActivity(id);
                        bpmnService.continueExecuting(currentActivity);
                    }

                    originalMethod.apply(self, args);
                }
            } else {
                originalMethod.apply(self, args);
            }
        };
    };
}

export function BPMNEvent(id: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const bpmnService = injector.get(BpmnService); // Access the BpmnService via injector
            if (bpmnService) {

                originalMethod.apply(this, args);
                bpmnService.colorActivity(id);
                const currentEvent = bpmnService.activities[id];

                if (undefined !== currentEvent) {

                    const nextItem = bpmnService.flows[currentEvent.outgoing[0]];
                    if (nextItem) {
                        bpmnService.currentActivity = bpmnService.activities[nextItem.targetRef];
                        bpmnService.executeCurrentActivity();
                    }

                } else {
                    console.warn(`Event with ID ${id} not found in events: `, bpmnService.activities);
                }
            }
        };
    };
}


