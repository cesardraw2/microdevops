import { Component, Inject, OnInit } from '@angular/core';
import { MODAL_DATA, ModalRef } from '@sicoob/ui';

@Component({
  selector: 'sc-popup-banner',
  templateUrl: './popup-banner.component.html',
  styleUrls: ['./popup-banner.component.scss']
})
export class PopupBannerComponent implements OnInit {


  constructor(
    public ref: ModalRef,
    @Inject(MODAL_DATA) public data: any) { }

  ngOnInit() {
  }

  close(s: boolean) {
    this.ref.close(s);
  }

}
