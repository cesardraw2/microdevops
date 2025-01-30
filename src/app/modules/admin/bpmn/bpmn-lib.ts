import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import {Subject, Observable, BehaviorSubject} from 'rxjs';

interface BPMNActivity {
    id: string;
    name: string;
    type: string;
    incoming: string[];
    outgoing: string[];
    extensionElements: {
        $type: string;
        values: ExtensionElement[];
    };
}

interface BPMNEvent {
    id: string;
    name: string;
    type: string;
    incoming: string[];
    outgoing: string[];
    extensionElements: {
        $type: string;
        values: ExtensionElement[];
    };

}

interface BPMNFlow {
    id: string;
    sourceRef: string;
    targetRef: string;
    conditionExpression?: string;
}

interface ExtensionElement {
    $type: string;
    [key: string]: any;
}

interface BPMNElement {
    id: string;
    name: string;
    type: string;
    incoming: string[];
    outgoing: string[];
    extensionElements: {
        $type: string;
        values: ExtensionElement[];
    };
}


@Injectable({
    providedIn: 'root',
})
export class BpmnService {
    public bpmnJS: BpmnJS;
    public objToExecute: any;

    public flows: { [key: string]: BPMNFlow } = {};
    public events:  { [key: string]: BPMNEvent } = {};
    public gateways: { [key: string]: BPMNActivity } = {};
    public activities: { [key: string]: BPMNActivity } = {};
    public currentActivity: BPMNActivity | null = null;

    private completedActivities: Set<string> = new Set();
    public processLoaded = new BehaviorSubject<boolean>(false);

    public doExecuteMethod = new BehaviorSubject<BPMNActivity>(null);
    private bpmnXML: string = ''; // Atributo para armazenar o XML

    private variables: { [key: string]: any } = {};

    constructor(private http: HttpClient) {
        this.bpmnJS = new BpmnJS();
    }

    loadBpmnDiagram(url: string): Observable<string> {
        return this.http.get(url, { responseType: 'text' });
    }

    async importBpmnDiagram(bpmnXML: string): Promise<void> {
        this.bpmnXML = bpmnXML;
        console.log('3 - importBpmnDiagram');
        try {
            const {warnings} = await this.bpmnJS.importXML(bpmnXML);
            if (warnings.length) {
                console.warn('Warnings during BPMN import:', warnings);
            }

            this.processXmlElements();
            this.processLoaded.next(true);
        } catch (err) {
            console.error('Error importing BPMN diagram:', err);
            throw err;
        }
    }

    processXmlElements(): void {
        if (!this.bpmnXML) return;
                const definitions = this.bpmnJS.getDefinitions();
                const process = definitions.rootElements.find((el: any) => el.$type === 'bpmn:Process');
                if (!process) {
                    console.error('No process found in BPMN definitions.');
                    return;
                }

                process.flowElements.forEach((element: any) => {
                    if (element.$type === 'bpmn:ExclusiveGateway' || element.$type === 'bpmn:InclusiveGateway'
                        || element.$type === 'bpmn:ParallelGateway' || element.$type === 'bpmn:ComplexGateway'
                        || element.$type === 'bpmn:EventBasedGateway') {
                        this.activities[element.id] = {
                            id: element.id,
                            name: element.name,
                            type: element.$type,
                            incoming: element.incoming ? element.incoming.map((inc: any) => inc.id) : [],
                            outgoing: element.outgoing ? element.outgoing.map((out: any) => out.id) : [],
                            extensionElements: element.extensionElements ? element.extensionElements: {},
                        };
                    } else  if (element.$type === 'bpmn:StartEvent' || element.$type === 'bpmn:EndEvent') {
                        this.activities[element.id] = {
                            id: element.id,
                            name: element.name,
                            type: element.$type,
                            incoming: element.incoming ? element.incoming.map((inc: any) => inc.id) : [],
                            outgoing: element.outgoing ? element.outgoing.map((out: any) => out.id) : [],
                            extensionElements: element.extensionElements ? element.extensionElements : {},
                        };
                    } else  if (element.$type === 'bpmn:SequenceFlow') {
                        this.flows[element.id] = {
                            id: element.id,
                            sourceRef: element.sourceRef.id,
                            targetRef: element.targetRef.id,
                            conditionExpression: element.conditionExpression ? element.conditionExpression.body : undefined,
                        };
                    } else {
                        this.activities[element.id] = {
                            id: element.id,
                            name: element.name,
                            type: element.$type,
                            incoming: element.incoming ? element.incoming.map((inc: any) => inc.id) : [],
                            outgoing: element.outgoing ? element.outgoing.map((out: any) => out.id) : [],
                            extensionElements: element.extensionElements ? element.extensionElements : {},

                        };
                    }
                });
    }

    startProcess(startEventId: string): void {
        console.log('4 - startProcess',this.activities);
        this.currentActivity = this.activities[startEventId];
        this.doExecuteMethod.next(this.currentActivity);
    }

    executeCurrentActivity(): void {
        console.log('5 - executeCurrentActivity ',this.currentActivity);
        if (!this.currentActivity) return;

        const activity = this.currentActivity;


        this.doExecuteMethod.next(activity);

        //## this.continueExecuting(activity);
    }

    public continueExecuting(activity: BPMNActivity) {
        // Add to completed activities
        this.completedActivities.add(activity.id);

        // Move to next activities based on gateway logic
        if (activity.outgoing.length > 0) {
            if (activity.type === 'bpmn:ExclusiveGateway' || activity.type === 'bpmn:InclusiveGateway') {
                this.executeNextActivityBasedOnCondition(activity);
            } else if (activity.type === 'bpmn:ParallelGateway') {
                this.executeParallelActivities(activity);
            } else {
                this.executeNextActivity(activity.outgoing[0]);
            }
        } else {
            console.log(`Process ended after activity: ${activity.name}`);
        }
    }

    executeNextActivityBasedOnCondition(activity: BPMNActivity): void {
        for (const flowId of activity.outgoing) {
            const flow = this.flows[flowId];
            let conditionMet = true;
            if (flow.conditionExpression) {
                try {
                    // Validate and sanitize condition expression
                    const sanitizedCondition = this.sanitizeCondition(flow.conditionExpression);
                    const conditionFunc = new Function(...Object.keys(this.variables), 'return ' + sanitizedCondition);
                    conditionMet = conditionFunc(...Object.values(this.variables));
                } catch (error) {
                    console.error('Error evaluating condition expression:', error);
                    conditionMet = false;
                }
            }
            if (conditionMet) {
                this.currentActivity = this.activities[flow.targetRef];
                this.executeCurrentActivity();
                break;
            }
        }
    }

    sanitizeCondition(condition: string): string {
        // Remove any unwanted characters or patterns
        return condition.replace(/[{}$]/g, '');
    }

    executeParallelActivities(activity: BPMNActivity): void {
        for (const flowId of activity.outgoing) {
            const flow = this.flows[flowId];
            const nextActivity = this.activities[flow.targetRef];
            if (nextActivity) {
                setTimeout(() => {
                    this.currentActivity = nextActivity;
                    this.executeCurrentActivity();
                }, 0);
            }
        }
    }

    private executeNextActivity(flowId: string): void {
        const flow = this.flows[flowId];
        if (flow) {
            this.currentActivity = this.activities[flow.targetRef];
            this.executeCurrentActivity();
        }
    }

    setVariable(name: string, value: any): void {
        this.variables[name] = value;
    }

    getVariable(name: string): any {
        return this.variables[name];
    }

    log(message: string): void {
        console.log(message);
    }

    colorActivity(activityId: string): void {
        const elementRegistry = this.bpmnJS.get('elementRegistry') as any;
        const modeling = this.bpmnJS.get('modeling') as any;
        const element = elementRegistry.get(activityId);
        if (element) {
            modeling.setColor([element], {
                fill: '#c8e6c9',
                stroke: '#43a047'
            });
        }
    }

    startDynamicProcess(url: string, objToExecute:any): void {

            this.loadBpmnDiagram(url)
                .subscribe({
                    next: (bpmnXML) => {
                        console.log('2 - loadBpmnDiagram');
                        this.importBpmnDiagram(bpmnXML)
                            .then(() => {
                                console.log('BPMN diagram imported successfully');
                            })
                            .catch(err => {
                                console.error('Failed to import BPMN diagram', err);
                            });
                    }
                });

        this.objToExecute = objToExecute;
        console.log('1 - startDynamicProcess');

    }

    showSpinner(activityId: string): void {
        const elementRegistry = this.bpmnJS.get('elementRegistry') as any;
        const element = elementRegistry.get(activityId);
        if (element) {
            const gfx = elementRegistry.getGraphics(element);
            const spinner = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            spinner.setAttribute('x', '2');
            spinner.setAttribute('y', '2');
            spinner.setAttribute('width', '20');
            spinner.setAttribute('height', '20');
            spinner.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'assets/images/ui/loading.svg'); // Substitua pelo caminho da sua imagem
            spinner.setAttribute('class', 'spinner');
            //spinner.setAttribute('style', 'animation: spin 1s linear infinite;');
            gfx.appendChild(spinner);
        }
    }


    hideSpinner(activityId: string): void {
        const elementRegistry = this.bpmnJS.get('elementRegistry') as any;
        const element = elementRegistry.get(activityId);
        if (element) {
            const gfx = elementRegistry.getGraphics(element);
            const spinner = gfx.querySelector('.spinner');
            if (spinner) {
                gfx.removeChild(spinner);
            }
        }
    }

    getBodyForStartEvent(bpmnElement: BPMNActivity): string | null {
        if (!bpmnElement.extensionElements || !bpmnElement.extensionElements.values) {
            return null;
        }

        for (const extensionElement of bpmnElement.extensionElements.values) {
            if (extensionElement.$type === "camunda:executionListener" && extensionElement.event === "start") {
                for (const child of extensionElement.$children) {
                    if (child.$type === "camunda:script" && child.$body) {
                        return child.$body;
                    }
                }
            }
        }

        return null;
    }
}


