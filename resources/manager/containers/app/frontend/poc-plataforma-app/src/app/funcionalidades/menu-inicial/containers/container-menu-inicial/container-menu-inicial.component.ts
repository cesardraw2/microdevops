import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '@sicoob/ui';

@Component({
  selector: 'sc-container-menu-inicial',
  templateUrl: './container-menu-inicial.component.html',
  styleUrls: ['./container-menu-inicial.component.scss']
})
export class ContainerMenuInicialComponent implements OnInit {

  isHome: boolean = true;
  isVenda: boolean = false;
  isGerencia: boolean = false;

  constructor(private modalService: ModalService, private router: Router) { }

  ngOnInit() {
  }

  irParaCentralVendas() {
    this.isHome = false;
    this.router.navigate(['central-vendas']);
  }

  irParaCentralAtendimento() {
    this.isHome = false;
    this.router.navigate(['central-atendimento']);
  }

  retornarMenuInicial(value) {
    if (value) {
      this.isHome = true;
      this.isGerencia = false;
      this.isVenda = false
    }
  }

  abrirQueroGerenciar() {
    this.isHome = false;
    this.isGerencia = true;
  }

  abrirQueroVender() {
    this.isHome = false;
    this.isVenda = true;
  }

}
