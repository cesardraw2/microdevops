import {
  AfterContentInit,
  Component,
  ElementRef, EventEmitter, Input,
  OnChanges,
  OnDestroy,
  OnInit, Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { HttpClient } from "@angular/common/http";
import { from, map, Observable, Subscription, switchMap } from "rxjs";
import { ImportDoneEvent, ImportXMLResult } from "bpmn-js/lib/BaseViewer";
import { Canvas } from "bpmn-js/lib/features/context-pad/ContextPadProvider";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-bpmn-diagram',
  standalone: true,
  imports: [],
  templateUrl: './bpmn-diagram.component.html',
  styleUrls: ['./bpmn-diagram.component.scss']
})
export class DiagramComponent implements AfterContentInit, OnChanges, OnDestroy, OnInit {

  @ViewChild('ref', { static: true }) private el: ElementRef;
  @Input() private url?: string;
  @Output() private importDone: EventEmitter<ImportDoneEvent> = new EventEmitter();
  private bpmnJS: BpmnJS = new BpmnJS();

  constructor(private http: HttpClient, private domSanitizer: DomSanitizer) {
    this.bpmnJS.on<ImportDoneEvent>('import.done', ({ error }) => {
      if (!error) {
        this.bpmnJS.get<Canvas>('canvas').zoom('fit-viewport');
      }
    });
  }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(this.el.nativeElement);
  }

  ngOnInit(): void {
    if (this.url) {
      this.loadUrl(this.url);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // re-import whenever the url changes
    if (changes.url) {
      this.loadUrl(changes.url.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  /**
   * Load diagram from URL and emit completion event
   */
  loadUrl(url: string): Subscription {
    const sanitizedUrl = this.domSanitizer.sanitize(1, url);
    if (!sanitizedUrl) {
      console.error('URL sanitization failed');
      return;
    }

    return this.http.get(sanitizedUrl, { responseType: 'text' }).pipe(
        switchMap((xml: string) => this.importDiagram(xml)),
        map(result => result.warnings)
    ).subscribe(
        warnings => this.importDone.emit({ warnings }),
        err => this.importDone.emit({warnings: [], error: err })
    );
  }

  /**
   * Creates a Promise to import the given XML into the current
   * BpmnJS instance, then returns it as an Observable.
   *
   * @see https://github.com/bpmn-io/bpmn-js-callbacks-to-promises#importxml
   */
  private importDiagram(xml: string): Observable<ImportXMLResult> {
    return from(this.bpmnJS.importXML(xml).then(result => {
      // Check for non-finite values in the import result
      if (result && result.warnings) {
        result.warnings.forEach(warning => {
          if (!isFinite(Number(warning))) {
            console.error('Non-finite value detected in import result', warning);
          }
        });
      }
      return result;
    }).catch(error => {
      console.error('Error importing XML', error);
      throw error;
    }));
  }
}
