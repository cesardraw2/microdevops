import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import * as fromCapes from '@shared/components/capes/reducers/capes.reducer';
import { Router } from '@angular/router';
import { CapesComponent } from '@shared/components/capes/capes.component';
import { CustomAlertService } from '@app/shared/services/alert-custom.service';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { PessoaModel } from '@app/shared/components/capes/models/response/pessoa.model';
import { Color } from '@sicoob/ui';

@Component({
  selector: 'app-quero-vender',
  templateUrl: './quero-vender.component.html',
  styleUrls: ['./quero-vender.component.scss']
})
export class QueroVenderComponent implements OnInit {
  subscription = new Subscription();
  @Output() retornarMenuInicial = new EventEmitter<boolean>();

  @ViewChild('cpfCnpjComponent')
  cpfCnpjComponent: CapesComponent;
  showButton: boolean;
  isAcessoCpfCnpj: boolean = true;
  
  proponente: Observable<PessoaModel>;

  constructor(private router: Router, private capesStore$: Store<fromCapes.State>, private customAlertService: CustomAlertService) { }

  ngOnInit() {
    this.proponente = this.capesStore$.pipe(select(fromCapes.getCapes));
  }

  irParaMenuInicial() {
    this.retornarMenuInicial.emit(true);
  }

  irParaSicoobSeguradora() {
    this.router.navigate(['central-atendimento']);
  }

  showButtonHandler(showButton: boolean){
    this.showButton = showButton;
  }

  mudarAcessoCpfCnpj() {
    this.isAcessoCpfCnpj = true;
  }

  mudarAcessoNomeRazao() {
    this.isAcessoCpfCnpj = false;
  }

  encaminharProdutos() {
    this.cpfCnpjComponent.validateAllFormFields(this.cpfCnpjComponent.formulario);
    if (this.cpfCnpjComponent.formulario.valid) {
            
      this.subscription.add(this.proponente.subscribe(prop => {
        if (prop != null && prop.idPessoa != null) {
          this.subscription.unsubscribe();
          this.router.navigate(['central-vendas']);
          
        } else {
          this.customAlertService.abrirAlert(Color.WARNING, 'O proponente não foi selecionado. Tecle ENTER para realizar a consulta.');
          this.subscription.unsubscribe();
        }
      }));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
