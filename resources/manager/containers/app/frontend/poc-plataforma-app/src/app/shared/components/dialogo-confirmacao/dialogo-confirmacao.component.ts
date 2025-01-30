import { Component, Inject, OnInit } from '@angular/core';
import { MODAL_DATA, ModalRef } from '@sicoob/ui';

@Component({
  selector: 'sc-dialogo-confirmacao',
  templateUrl: './dialogo-confirmacao.component.html',
  styleUrls: ['./dialogo-confirmacao.component.scss']
})
export class DialogoConfirmacaoComponent implements OnInit {


  constructor(
    public ref: ModalRef,
    @Inject(MODAL_DATA) public data: any) { }

  ngOnInit() {
  }

  close(s: boolean) {
    this.ref.close(s);
  }

}
