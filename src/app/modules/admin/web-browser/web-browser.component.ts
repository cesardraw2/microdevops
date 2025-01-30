import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  NO_ERRORS_SCHEMA,
  ViewChild
} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-web-browser',
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  templateUrl: './web-browser.component.html',
  styleUrl: './web-browser.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebBrowserComponent implements AfterViewInit{

  private _url!: string;

  calcular(){
    const X:number = 10;
    const Y:number = 20;
    let Z:number = 30;
    Z = Z + 1;
    let w:number = X + Y + Z;
    console.log('NEGUINHA:: ', w);

  }



  @Input()
  set url(value: string) {
    this._url = value;
    this.updateWebviewSrc();
  }

  get url(): string {
    return this._url;
  }

  @ViewChild('webviewElement', { static: true }) webviewRef!: ElementRef;

  ngAfterViewInit() {
    this.updateWebviewSrc();
    this.calcular();
  }

  private updateWebviewSrc(): void {
    if (this.webviewRef && this._url) {
      this.webviewRef.nativeElement.src = this._url;
    }
  }
}
