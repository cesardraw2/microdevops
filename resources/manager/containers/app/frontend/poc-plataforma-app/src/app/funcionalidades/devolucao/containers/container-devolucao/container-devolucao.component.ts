import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'sc-container-devolucao',
  templateUrl: './container-devolucao.component.html',
  styleUrls: ['./container-devolucao.component.css']
})
export class ContainerDevolucaoComponent implements OnInit {

  public produtos: string[] = ['Prestamista', 'Empresarial', 'VGBL'];

  constructor(private store: Store<any>) { }

  ngOnInit() {
  }

}
