import { Component, OnInit, Inject } from '@angular/core';
import { ModalRef, MODAL_DATA } from '@sicoob/ui';
import { Validacao } from '@app/models/validacao.model';


@Component({
  selector: 'sc-modal-validacao',
  templateUrl: './modal-validacao.component.html',
  styleUrls: ['./modal-validacao.component.css']
})
export class ModalValidacaoComponent implements OnInit {

  constructor(public ref: ModalRef,
    @Inject(MODAL_DATA) public data: Validacao) { }

  ngOnInit() {
  }

  close() {
    this.ref.close();
  }

}