import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'sc-container-seguros-gerais',
  templateUrl: './container-seguros-gerais.component.html',
  styleUrls: ['./container-seguros-gerais.component.css']
})
export class ContainerSegurosGeraisComponent implements OnInit {

  constructor(private store: Store<any>) { }

  ngOnInit() {
  }

}
