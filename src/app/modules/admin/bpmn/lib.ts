import { Observable } from 'rxjs';

/**
 * An operator that imports the first XML piped via the piped diagram XML
 * into the passed BpmnJS instance.
 */
export const importDiagram = (bpmnJS: any) => <Object>(source: Observable<string>) =>
    new Observable<string>(observer => {

        const subscription = source.subscribe({
            next(xml: string) {
                // canceling the subscription as we are interested
                // in the first diagram to display only
                subscription.unsubscribe();

                bpmnJS.importXML(xml, function(err: any, warnings: any) {

                    if (err) {
                        observer.error(err);
                    } else {
                        observer.next(warnings);
                    }

                    observer.complete();
                });
            },
            error(e) {
                console.log('ERROR:', e);
                observer.error(e);
            },
            complete() {
                observer.complete();
            }
        });
    });

export async function importBpmnDiagram(modeler: any, bpmnXML: string): Promise<void> {
    try {
        await modeler.importXML(bpmnXML);
        console.log('BPMN diagram imported successfully');
    } catch (error) {
        console.error('Error importing BPMN diagram:', error);
        throw error;
    }
}


