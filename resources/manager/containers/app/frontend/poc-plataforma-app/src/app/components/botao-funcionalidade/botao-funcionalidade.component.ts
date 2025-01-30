import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-botao-funcionalidade',
  templateUrl: './botao-funcionalidade.component.html',
  styleUrls: ['./botao-funcionalidade.component.scss']
})
export class BotaoFuncionalidadeComponent implements OnInit {

  @Input() labelapp: string;

  @Input() iconAppBtn: string;

  @Input() routerApp: string;

  @Input() optionalClasses: string;

  constructor() {  }

  ngOnInit() {
  }

}
