import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-container-configuracoes-gerais',
  templateUrl: './container-configuracoes-gerais.component.html',
  styleUrls: ['./container-configuracoes-gerais.component.scss']
})
export class ContainerConfiguracoesGeraisComponent implements OnInit {

  constructor(private store: Store,  private router: Router) { }

  ngOnInit(): void {
  }

  irParaCorretoras() {
    this.router.navigate(['central-configuracao/configuracoes-gerais/corretoras']);
  };

}
