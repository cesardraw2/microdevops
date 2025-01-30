import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'sc-container-relatorios',
  templateUrl: './container-relatorios.component.html',
  styleUrls: ['./container-relatorios.component.scss']
})
export class ContainerRelatoriosComponent implements OnInit {

  public relatoriosTab: string[] = ['Propostas','Vendas'];

  constructor(private store: Store<any>) { }

  ngOnInit() {
  }

}
