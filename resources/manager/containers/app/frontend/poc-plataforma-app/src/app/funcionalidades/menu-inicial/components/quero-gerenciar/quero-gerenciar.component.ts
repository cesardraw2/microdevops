import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quero-gerenciar',
  templateUrl: './quero-gerenciar.component.html',
  styleUrls: ['./quero-gerenciar.component.scss']
})
export class QueroGerenciarComponent implements OnInit {

  @Output() retornarMenuInicial = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  irParaMenuInicial() {
    this.retornarMenuInicial.emit(true);
  }

  irParaSicoobSeguradora() {
    this.router.navigate(['seguradora/dashboard-seguradora']);
  }

  irParaSegurosGerais() {
    this.router.navigate(['seguros-gerais/dashboard-seguros-gerais']);
  }

}
