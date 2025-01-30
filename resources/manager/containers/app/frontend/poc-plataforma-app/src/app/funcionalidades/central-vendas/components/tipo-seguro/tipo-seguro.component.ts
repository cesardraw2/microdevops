import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sgr-tipo-seguro',
  templateUrl: './tipo-seguro.component.html',
  styleUrls: ['./tipo-seguro.component.scss']
})
export class TipoSeguroComponent implements OnInit {

  @Input() icon = '';

  @Input() titulo = '';

  @Input() textoSubTitulo = '';

  @Input() textoDescricao = '';

  @Input() linkNavegacao? = '';
  
  @Input() linkNavegacaoExterna? = '';

  @Input() opcoes?: OpcoesTipoSeguro = {};

  constructor(private router: Router) { }

  ngOnInit() {
  }


  acessarRota() {
    console.log(this.opcoes);
    if(this.opcoes && this.opcoes.disabled){
      alert(this.opcoes.alertMessage);
      return;
    }
    if (this.linkNavegacao !== '') {
      this.router.navigate([this.linkNavegacao]);
    }else if(this.linkNavegacaoExterna !== ''){
      window.location.href = this.linkNavegacaoExterna;
    }
  }

}

export interface OpcoesTipoSeguro {
  disabled?: boolean;
  alertMessage?: string;
}
