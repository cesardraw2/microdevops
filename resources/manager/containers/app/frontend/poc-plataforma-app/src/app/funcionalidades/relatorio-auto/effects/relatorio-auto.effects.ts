import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  ErroRelatorioPlurianual,
  LoadRelatorioPlurianual,
  RelatorioAutoActionTypes,
  SucessoRelatorioPlurianual
} from '@funcionalidades/relatorio-auto/actions/relatorio-auto.actions';
import { RelatorioAutoService } from '@funcionalidades/relatorio-auto/relatorio-auto.service';
import { DadosRelatorioPlurianual } from '@funcionalidades/relatorio-auto/models/relatorio-plurianual.model';


@Injectable()
export class RelatorioAutoEffects {

  constructor(private actions$: Actions, private relatorioAutoService: RelatorioAutoService) { }

  getRelatorioPlurianual = createEffect(() => {
    return this.actions$.pipe(ofType<LoadRelatorioPlurianual>(RelatorioAutoActionTypes.LoadRelatorioPlurianual),
      map((action: LoadRelatorioPlurianual) => action),
      switchMap((action: LoadRelatorioPlurianual) => this.relatorioAutoService.consultaRelatorioPlurianual(action.filtro).pipe(
        map((relatorio) => {
          relatorio.resultado = relatorio.resultado.map((item: DadosRelatorioPlurianual) => {
            switch (item.situacao) {
              case 'AGUARDANDO_PAGAMENTO':
              case 'EM_PAGAMENTO':
                item.situacao = 'AGUARDANDO_PAGAMENTO';
                break;
              case 'PAGAMENTO_REALIZADO':
              case 'EM_AJUSTE_CONTABIL':
              case 'AJUSTE_CONTABIL_CADASTRADO':
              case 'AJUSTE_CONTABIL_REALIZADO':
              case 'AJUSTE_CONTABIL_NAO_REALIZADO':
              case 'PAGAMENTO_MANUAL':
                item.situacao = 'PAGAMENTO_REALIZADO';
                break;
              case 'PAGAMENTO_NAO_REALIZADO':
                item.situacao = 'PAGAMENTO_NAO_REALIZADO';
                break;
            }
            return item;
          });
          return new SucessoRelatorioPlurianual(relatorio);
        }),
        catchError((msg: string) => of(new ErroRelatorioPlurianual(msg)))
      )
      )
    );
  });
}
