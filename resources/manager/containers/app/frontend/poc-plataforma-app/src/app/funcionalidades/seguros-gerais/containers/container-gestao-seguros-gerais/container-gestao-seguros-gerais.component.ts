import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {environment} from '@env/environment';

@Component({
  selector: 'sc-container-seguros-gerais',
  templateUrl: './container-gestao-seguros-gerais.component.html',
  styleUrls: ['./container-gestao-seguros-gerais.component.css']
})
export class ContainerGestaoSegurosGeraisComponent implements OnInit {

  constructor(private store: Store<any>) { }

  ngOnInit() {
  }

  abrirSre() {
    window.open(environment.SERVICE_SRE + '/gestao');
  }
}
