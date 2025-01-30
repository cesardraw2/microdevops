import { Component, Inject, OnInit } from '@angular/core';
import { MODAL_DATA, ModalRef } from '@sicoob/ui';
import { CorretorasService } from './../../corretoras.service';

@Component({
  selector: 'app-modal-exclusao-central',
  templateUrl: './modal-exclusao-central.component.html',
  styleUrls: ['./modal-exclusao-central.component.scss']
})
export class ModalExclusaoCentralComponent implements OnInit {


  constructor(
    public modalRef: ModalRef, // Passar parametros ao fechar no modalRef.close({nome: 'test'})
    @Inject(MODAL_DATA) public data: number,
    private corretorasService : CorretorasService
  ) { }

  ngOnInit(): void {
  }

  excluirCentral() {
    let vinculo = {
      idHerarquia : this.data,
      comercializa : false
    }

    this.corretorasService.excluirCorretora(vinculo).subscribe(cor => {
      this.fechar();
    });
  }

  fechar() {
    this.modalRef.close();
  }

}
