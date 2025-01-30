import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { VinculoCorretoraCooperativa } from '@app/models/vinculoCorretoraCooperativa.model';
import { Store, select } from '@ngrx/store';
import { MODAL_DATA, ModalRef } from '@sicoob/ui';
import { Observable } from 'rxjs';
import { AddVinculoCorretoraCooperativa, CleanCorretora } from '../../actions/corretoras.actions';
import * as fromCorretoras from '../../reducers/corretoras.reducer';

@Component({
  selector: 'app-modal-nome-corretora',
  templateUrl: './modal-nome-corretora.component.html',
  styleUrls: ['./modal-nome-corretora.component.scss']
})
export class ModalNomeCorretoraComponent implements OnInit, OnDestroy {
  nomeCorretora: string;
  vinculoCorretora: Observable<VinculoCorretoraCooperativa>;
  constructor(
    public modalRef: ModalRef,
    @Inject(MODAL_DATA) public data: any,
    private store: Store<fromCorretoras.State>,
  ) { }

  ngOnInit(): void {
    this.store.pipe(select(fromCorretoras.addVinculoCorretora)).subscribe((prop:VinculoCorretoraCooperativa) => {
      if (prop) {
        this.modalRef.close({resultado: true});
      }
    })
  }
  ngOnDestroy(): void {
    this.fechar();
  }
  adicionarVinculo() {
    this.store.dispatch(new AddVinculoCorretoraCooperativa(this.data.vinculo));
  }

  fechar() {
    this.store.dispatch(new CleanCorretora());
    this.modalRef.close({ resultado: false });
  }

}
