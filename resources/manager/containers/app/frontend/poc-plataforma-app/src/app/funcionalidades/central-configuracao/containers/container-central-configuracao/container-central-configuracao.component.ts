import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'sc-container-central-configuracao',
  templateUrl: './container-central-configuracao.component.html',
  styleUrls: ['./container-central-configuracao.component.scss']
})
export class ContainerCentralConfiguracaoComponent implements OnInit {

  routeConfigGerais = "/central-configuracao/configuracoes-gerais";

  urlSpr = environment.SERVICE_SPR+"/central-configuracao/seguro-prestamista";

  urlSvd = environment.SERVICE_SVD + environment.DOMAIN_SVD + '/central-configuracao';
  urlApoioAmigo = environment.SERVICE_SVD + environment.DOMAIN_SVD + '/central-configuracao';
  urlBeneficios = environment.SERVICE_SRB + '/central-configuracao';
  urlSve = `${environment.SERVICE_SVE}${environment.DOMAIN_SVE}/central-configuracao/`;

  constructor() { }

  ngOnInit() {
  }


}
