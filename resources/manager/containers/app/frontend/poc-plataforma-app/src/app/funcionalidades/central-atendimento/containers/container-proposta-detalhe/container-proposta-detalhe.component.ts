import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sc-container-proposta-detalhe',
  templateUrl: './container-proposta-detalhe.component.html',
  styleUrls: ['./container-proposta-detalhe.component.scss']
})
export class ContainerPropostaDetalheComponent implements OnInit {

  idProposta: string;
  subscriptions: Subscription = new Subscription();

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscriptions.add(this.route.paramMap.subscribe(params => {
      this.idProposta = params.get('idproposta');
    }));
  }

}
