import { Component, OnInit } from '@angular/core';
import { PessoaModel } from '@app/shared/components/capes/models/response/pessoa.model';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromCapes from '@shared/components/capes/reducers/capes.reducer';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { TipoPessoaEnum } from '@app/shared/enum/TipoPessoa.enum';


@Component({
  selector: 'sc-container-lista-produtos',
  templateUrl: './container-lista-produtos.component.html',
  styleUrls: ['./container-lista-produtos.component.scss']
})
export class ContainerListaProdutosComponent implements OnInit {

  proponente$: Observable<PessoaModel>;
  urlSve = `${environment.SERVICE_SVE}${environment.DOMAIN_SVE}/central-atendimento/consulta/`;
  urlVgbl = environment.SERVICE_VGBL + '/central-atendimento/consulta/';
  urlSvd = environment.SERVICE_SVD + environment.DOMAIN_SVD + '/central-atendimento/';
  urlSpr = environment.SERVICE_SPR + '/central-configuracao/seguro-prestamista/cancelamento-seguro/'

  isPessoaJuridica = false;
  constructor(private capesStore$: Store<fromCapes.State>,
              private router: Router) {
  }

  ngOnInit() {
    this.proponente$ = this.capesStore$.pipe(select(fromCapes.getCapes));
    this.proponente$.subscribe(prop => {
      this.isPessoaJuridica = prop?.codTipoPessoa == TipoPessoaEnum.PESSOA_JURIDICA;
      this.urlSve = this.urlSve + prop.cpfCnpj;
      this.urlVgbl = this.urlVgbl + prop.idPessoa;
      this.urlSvd = this.urlSvd + prop.idPessoa;
      this.urlSpr = this.urlSpr + prop.idPessoa + "/" + prop.idInstituicao
    });
  }

  encaminharTelaConsulta() {
    this.router.navigate(['central-atendimento']);
  }
}
