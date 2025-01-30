import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { PessoaModel } from '@app/shared/components/capes/models/response/pessoa.model';
import * as fromCapes from '@shared/components/capes/reducers/capes.reducer';
import * as fromAuth from '@sicoob/security';
import { Observable } from 'rxjs';
import { Corretora } from '@app/models/corretora.model';
import { CorretoraService } from '@app/shared/services/corretora.service';
import { UsuarioSicoob } from '@sicoob/security';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'sc-container-central-vendas',
  templateUrl: './container-central-vendas.component.html',
  styleUrls: ['./container-central-vendas.component.scss']
})
export class ContainerCentralVendasComponent implements OnInit {

  proponente: Observable<PessoaModel>;
  usuarioAut: UsuarioSicoob;
  existeCorretora = false;

  constructor(private store: Store<fromCapes.State>,
              private authStore$: Store<fromAuth.State>,
              private corretoraService: CorretoraService) { }

  ngOnInit() {
    this.authStore$.pipe(
       select(fromAuth.selectSicoobUser),
       switchMap(usuario => {
         this.usuarioAut = usuario;
         return this.corretoraService.obterCorretora((<any>usuario).idInstituicao || usuario.idInstituicaoOrigem);
       })
    ).subscribe( (resultado: Corretora) => {
      this.existeCorretora = true;
      }
    );
    this.proponente = this.store.pipe(select(fromCapes.getCapes));
  }

}
