import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

@Component({
  selector: 'sc-container-faturamento',
  templateUrl: './container-faturamento.component.html',
  styleUrls: ['./container-faturamento.component.css']
})
export class ContainerFaturamentoComponent implements OnInit {
  public produtos: string[] = ['Prestamista'];

  constructor(private store: Store<any>) {
  }

  ngOnInit(): void {
  }
}


