import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { ModalService } from '@sicoob/ui';
import { Observable } from 'rxjs';

import { CleanValidateCooperativa, LoadCorretoras } from '../../actions/corretoras.actions';
import { ModalExclusaoCentralComponent } from '../../components/modal-exclusao-central/modal-exclusao-central.component';
import { ModalInclusaoVinculoComponent } from '../../components/modal-inclusao-vinculo/modal-inclusao-vinculo.component';
import { Corretoras } from '../../models/corretoras.model';
import * as fromCorretoras from '../../reducers/corretoras.reducer';

@Component({
  selector: 'sc-container-lista-corretoras',
  templateUrl: './container-lista-corretoras.component.html',
  styleUrls: ['./container-lista-corretoras.component.scss']
})
export class ContainerListaCorretorasComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  corretoras$ : Observable<Corretoras[]>;
  paginacao$: Observable<PaginacaoCorretora>;

  constructor(
    private store: Store<fromCorretoras.State>,
    private fb: FormBuilder,
    private modalService: ModalService
  ) { }


  ngAfterViewInit(): void {
    this.corretoras$ = this.store.pipe(select(fromCorretoras.getCorretoras));
    this.paginacao$ = this.store.pipe(select(fromCorretoras.getPaginacaoCorretora));
    this.store.dispatch(new LoadCorretoras({ nome: null, numeroSusep: null, pagina: 0 }));
  }

  ngOnInit() {
    this.carregarForm();
  }

  private carregarForm() {
    this.form = this.fb.group({
      nomeCorretora: [''],
      codigoSusep: [''],
    })
  }

  pesquisarCorretoras(pagina: number) {
    this.store.dispatch(new LoadCorretoras({ nome: this.form.value.nomeCorretora, numeroSusep: this.form.value.codigoSusep, pagina: pagina}));
  };


  desabilitarOutrosCampos(campo) {
    if (
      this.form.controls.nomeCorretora.value != "" ||
      (this.form.controls.codigoSusep.value != "" && this.form.controls.codigoSusep.value != null)
    ) {
      switch (campo.target.attributes.formcontrolname.value) {
        case "nomeCorretora" : {
          this.form.controls.codigoSusep.disable();
          return;
        }
        case "codigoSusep" : {
          this.form.controls.nomeCorretora.disable();
          return;
        }
      }
    }
    this.form.controls.nomeCorretora.enable();
    this.form.controls.codigoSusep.enable();
  }

  criarVinculo() {
    this.modalService.open(ModalInclusaoVinculoComponent)
    .afterClosed().subscribe((param) => {
      this.store.dispatch(new CleanValidateCooperativa());
      this.pesquisarCorretoras(0);
    })
  }

  pageChanged($event: number) {
    this.pesquisarCorretoras($event - 1);
  }

  excluirCentral(centralId : number) {
    this.modalService.open(ModalExclusaoCentralComponent, {
      data: centralId
    }).afterClosed().subscribe((param) => {
      this.store.dispatch(new CleanValidateCooperativa());
      this.pesquisarCorretoras(0);
    })
  }
}

export interface PaginacaoCorretora {
  ordemCrescente: boolean;
  pagina: number;
  tamanhoPagina: number;
  totalRegistros: number;
}
