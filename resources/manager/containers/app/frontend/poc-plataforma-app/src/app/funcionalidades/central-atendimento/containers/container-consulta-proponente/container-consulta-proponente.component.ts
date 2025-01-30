import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PessoaModel } from '@app/shared/components/capes/models/response/pessoa.model';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as fromCapes from '@shared/components/capes/reducers/capes.reducer';
import { CapesComponent } from '@shared/components/capes/capes.component';
import { Router } from '@angular/router';
import { CustomAlertService } from '@app/shared/services/alert-custom.service';
import { Color } from '@sicoob/ui';
import { CapesFiltroComponent } from '@app/shared/components/capes-filtro/capes-filtro.component';



@Component({
  selector: 'sc-container-consulta-proponente',
  templateUrl: './container-consulta-proponente.component.html',
  styleUrls: ['./container-consulta-proponente.component.scss']
})
export class ContainerConsultaProponenteComponent implements OnInit, OnDestroy {

  subscription = new Subscription();
  proponente: Observable<PessoaModel>;
  showButton: boolean;

  @ViewChild('cpfCnpjComponent')
  cpfCnpjComponent: CapesFiltroComponent;

  constructor(private capesStore$: Store<fromCapes.State>,
    private router: Router, private customAlertService: CustomAlertService) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.proponente = this.capesStore$.pipe(select(fromCapes.getCapes));
  }

  encaminharProdutos() {
    this.cpfCnpjComponent.validateAllFormFields(this.cpfCnpjComponent.formulario);
    if (this.cpfCnpjComponent.formulario.valid) {
      this.subscription.add(this.proponente.subscribe(prop => {
        if (prop != null && prop.idPessoa != null) {
          this.router.navigate(['central-atendimento/lista-produtos']);
        } else {
          this.customAlertService.abrirAlert(Color.WARNING, 'O proponente não foi selecionado. Tecle ENTER para realizar a consulta.');
          this.subscription.unsubscribe();
        }
      }));
    }
  }

  
  showButtonHandler(showButton: boolean){
    this.showButton = showButton;
  }
}
