import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { PessoaModel } from '@app/shared/components/capes/models/response/pessoa.model';
import { Observable } from 'rxjs';
import * as fromCapes from '@shared/components/capes/reducers/capes.reducer';
import { Router } from '@angular/router';
import {OpcoesTipoSeguro} from '@funcionalidades/central-vendas/components/tipo-seguro/tipo-seguro.component';
import {TipoPessoaEnum} from '@shared/enum/TipoPessoa.enum';
import {environment} from '@env/environment';

@Component({
  selector: 'sc-container-central-vendas',
  templateUrl: './container-central-vendas-seguros.component.html',
  styleUrls: ['./container-central-vendas-seguros.component.scss']
})
export class ContainerCentralVendasSegurosComponent implements OnInit {

  proponente: Observable<PessoaModel>;
  opcoesSeguroResidencialPF: OpcoesTipoSeguro;
  linkSeguroResidencialPF: string;

  constructor(private store: Store<fromCapes.State>,
              private router: Router) { }

  ngOnInit() {
    this.proponente = this.store.pipe(select(fromCapes.getCapes));
    this.validacoesSegurosGerais();
  }

  encaminharTelaConsulta() {
    this.router.navigate(['']);
  }

  voltarBuscaProponente() {
    this.router.navigate(['central-vendas']);
  }

  private validacoesSegurosGerais() {
    // Validar se é pessoa fisica ou Juridica
   this.proponente.subscribe((pessoa: PessoaModel) => {
     if (pessoa) {
       this.linkSeguroResidencialPF = environment.SERVICE_SRE + '/cotacao';
        // '/cotacao/cotar/' + pessoa.idPessoa;
       if (pessoa.codTipoPessoa === TipoPessoaEnum.PESSOA_JURIDICA) {
         this.opcoesSeguroResidencialPF = {disabled: true, alertMessage: 'Esse produto está disponível apenas para Pessoa Física.'};
       }
     }
   });
   console.log(this.opcoesSeguroResidencialPF);
  }
}
