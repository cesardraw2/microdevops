import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import {
  LoadRelatorioProposta, ErroRelatorioProposta, RelatoriosActionTypes, SucessoRelatorioProposta,
  LoadRelatorioPropostaVenda, SucessoRelatorioPropostaVenda
} from '../actions/relatorios.actions';
import { RelatoriosService } from '../relatorios.service';


@Injectable()
export class RelatoriosEffects {

  constructor(private actions$: Actions, private relatorioService: RelatoriosService) { }

  getPropostas$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RelatoriosActionTypes.LoadRelatorioProposta),
      map((action: LoadRelatorioProposta) => action),
      switchMap((action: LoadRelatorioProposta) => this.relatorioService.consultaProposta(action.filtro, action.pagina).pipe(
        map(({ propostas, paginacao }) => {
          return new SucessoRelatorioProposta(propostas, paginacao);
        }),
        catchError((msg: string) => of(new ErroRelatorioProposta(msg)))
      )
      )
    );
  });

  getPropostasVenda$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RelatoriosActionTypes.LoadRelatorioPropostaVenda),
      map((action: LoadRelatorioPropostaVenda) => action),
      switchMap((action: LoadRelatorioPropostaVenda) => this.relatorioService.consultaPropostaVenda(action.filtro, action.pagina).pipe(
        map(({ propostas, paginacao }) => {
          return new SucessoRelatorioPropostaVenda(propostas, paginacao);
        }),
        catchError((msg: string) => of(new ErroRelatorioProposta(msg)))
      )
      )
    );
  });

}
