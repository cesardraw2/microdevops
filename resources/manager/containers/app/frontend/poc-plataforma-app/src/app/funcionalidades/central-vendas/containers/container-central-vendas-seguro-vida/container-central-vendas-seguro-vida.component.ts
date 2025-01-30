import { Component, OnInit } from '@angular/core';
import { PessoaModel } from '@app/shared/components/capes/models/response/pessoa.model';
import { environment } from '@env/environment';
import { Store, select } from '@ngrx/store';
import * as fromCapes from '@shared/components/capes/reducers/capes.reducer';
import { Observable } from 'rxjs';
import { TipoPessoaEnum } from './../../../../shared/enum/TipoPessoa.enum';

@Component({
  selector: 'sc-container-central-vendas',
  templateUrl: './container-central-vendas-seguro-vida.component.html',
  styleUrls: ['./container-central-vendas-seguro-vida.component.scss']
})
export class ContainerCentralVendasSeguroVidaComponent implements OnInit {

  proponente: Observable<PessoaModel>;
  urlSve = `${environment.SERVICE_SVE}${environment.DOMAIN_SVE}/seguro/contratacao-seguro/`;
  urlSvd = `${environment.SERVICE_SVD}${environment.DOMAIN_SVD}/contratacao/`;
  urlSeguroResidencial = `${environment.SERVICE_SRE}`;
  urlSgrPatrimonial = `${environment.SERVICE_SGR_PATRIMONIAL}`;
  urlSgt = `${environment.SERVICE_SGT}`;
  urlSgcel = `${environment.SERVICE_SGCEL}`;
  urlSvgc = environment.SERVICE_VIDA_COTADO;

  isPessoaJuridica = false;

  constructor(private store: Store<fromCapes.State>) { }

  ngOnInit() {
    this.proponente = this.store.pipe(select(fromCapes.getCapes));


    this.proponente.subscribe(prop => {
      this.urlSve = this.urlSve + prop.idPessoa;
      this.urlSeguroResidencial  += "/central-vendas/pessoa/"+prop.idPessoa +"/instituicao/"+prop.idInstituicao;
      this.urlSgrPatrimonial += "/central-vendas/pessoa/"+prop.idPessoa +"/instituicao/"+prop.idInstituicao;
      this.urlSgt += "/central-vendas/pessoa/"+prop.idPessoa +"/instituicao/"+prop.idInstituicao;
      this.urlSgcel  += "/central-vendas/pessoa/"+prop.idPessoa +"/instituicao/"+prop.idInstituicao;
      this.isPessoaJuridica = prop?.codTipoPessoa == TipoPessoaEnum.PESSOA_JURIDICA;
      this.urlSvd = this.urlSvd + prop.idPessoa;
      this.urlSvgc = this.urlSvgc;

    });
  }


}
