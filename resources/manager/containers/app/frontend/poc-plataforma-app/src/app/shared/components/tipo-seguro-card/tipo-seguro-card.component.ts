import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validacao } from '@app/models/validacao.model';
import { CleanCapesAction } from '@app/shared/components/capes/actions/capes.actions';
import { PessoaModel } from '@app/shared/components/capes/models/response/pessoa.model';
import { ModalValidacaoComponent } from '@app/shared/components/modal-validacao/modal-validacao.component';
import { environment } from '@env/environment';
import { select, Store } from '@ngrx/store';
import * as fromCapes from '@shared/components/capes/reducers/capes.reducer';
import { ModalConfig, ModalService } from '@sicoob/ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sgr-tipo-seguro-card',
  templateUrl: './tipo-seguro-card.component.html',
  styleUrls: ['./tipo-seguro-card.component.scss']
})
export class TipoSeguroCardComponent implements OnInit, OnDestroy {

  @Input() icon = '';

  @Input() titulo = '';

  @Input() descricao = '';

  @Input() linkOpenButton = '';

  @Input() productName = '_self';

  @Input() linkRouterButton = '';

  proponente: PessoaModel;

  subscription$: Subscription = new Subscription();

  config: ModalConfig;

  constructor(private store: Store<fromCapes.State>,
    private modalService: ModalService,
    private router: Router) { }

  ngOnInit() {
    this.subscription$.add(this.store.pipe(select(fromCapes.getCapes)).pipe().subscribe(prop => {
      this.proponente = prop;
    }));
  }

  executarBotao() {
    if (this.linkOpenButton !== '')
      window.open(this.linkOpenButton, this.productName);
    else if (this.linkRouterButton !== '') {
      this.router.navigate([this.linkRouterButton]);

    }
  }


  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  abrirModalValidacao(validacao: Validacao) {
    this.modalService.open(ModalValidacaoComponent, {
      data: validacao
    }).afterClosed();
  }

}
