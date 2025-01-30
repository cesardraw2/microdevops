import { Component, OnInit, Inject } from '@angular/core';
import { ModalRef, MODAL_DATA } from '@sicoob/ui';
import { Proposta } from '../../models/proposta.model';

@Component({
  selector: 'app-modal-motivo-relatorio',
  templateUrl: './modal-motivo-relatorio.component.html',
  styleUrls: ['./modal-motivo-relatorio.component.css']
})
export class ModalMotivoRelatorioComponent implements OnInit {

  titulo: string;
  venda: Proposta;

  constructor(public ref: ModalRef,
    @Inject(MODAL_DATA) public data: any) { }

  ngOnInit() {
    this.venda = this.data.venda;
    this.titulo = "Motivo " + this.data.titulo;
  }

  close(s: boolean) {
    this.ref.close(s);
  }

}
