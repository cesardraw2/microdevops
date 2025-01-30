import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import * as fromCorretoras from '../../reducers/corretoras.reducer';
import { Store } from '@ngrx/store';
import { Corretoras } from '../../models/corretoras.model';
import { LoadCorretoras } from '../../actions/corretoras.actions';

@Component({
  selector: 'sc-corretoras',
  templateUrl: './lista-corretoras.component.html',
  styleUrls: ['./lista-corretoras.component.scss']
})
export class ListaCorretorasComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
