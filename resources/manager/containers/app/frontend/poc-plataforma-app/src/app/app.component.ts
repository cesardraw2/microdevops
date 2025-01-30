import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sc-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: `./app.component.html`,
})
export class AppComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
