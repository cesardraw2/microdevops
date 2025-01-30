import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CorretorasService } from '../corretoras.service';
import * as fromCorretoras from '../reducers/corretoras.reducer';
import { AddVinculoCorretoraCooperativa, AddVinculoCorretoraCooperativaSuccess, CorretorasActionTypes, ErroCorretoraAction, FindCorretora, FindCorretoraSuccess, LoadCorretoras, LoadCorretorasSuccess, ValidateCooperativa, ValidateCooperativaSuccess } from './../actions/corretoras.actions';

@Injectable({
  providedIn: 'root'
})
export class CorretorasEffects {

  constructor (private actions$: Actions, private corretorasService: CorretorasService, private store: Store<fromCorretoras.State>,) {}

  getCorretora$ = createEffect (() => {
    return this.actions$.pipe(ofType(CorretorasActionTypes.LoadCorretoras),
      mergeMap((action : LoadCorretoras) =>
        this.corretorasService.obterListaCorretoras(action.filtros.nome, action.filtros.numeroSusep, action.filtros.pagina).pipe(
          map(({lista, paginacao}) => {
            return new LoadCorretorasSuccess(lista, paginacao);
          }),
          catchError((msg) => of(new ErroCorretoraAction(msg)))
      )
    )
    );
  });

  validaVinculoExistente$ = createEffect (() => {
    return this.actions$.pipe(ofType(CorretorasActionTypes.ValidateCooperativa),
      mergeMap((action : ValidateCooperativa) =>
        this.corretorasService.validarVinculoExistente(action.idInstituicao, action.susep).pipe(
          map((dadosValidado) => {
            return new ValidateCooperativaSuccess(dadosValidado);
          }),
          catchError((msg) => of(new ErroCorretoraAction(msg)))
      )
    )
    );
  });

  obterCorretora$ = createEffect (() => {
    return this.actions$.pipe(ofType(CorretorasActionTypes.FindCorretora),
      mergeMap((action : FindCorretora) =>
        this.corretorasService.obterCorretora(action.susep).pipe(
          map((dadosCorretora) => {
            return new FindCorretoraSuccess(dadosCorretora);
          }),
          catchError((msg) => of(new ErroCorretoraAction(msg)))
      )
    )
    );
  });

  addCorretora$ = createEffect (() => {
    return this.actions$.pipe(ofType(CorretorasActionTypes.AddVinculoCorretoraCooperativa),
      mergeMap((action : AddVinculoCorretoraCooperativa) =>
        this.corretorasService.incluirVinculoCorretoraCentral(action.dadosVinculo).pipe(
          map((entidade) => {
            this.store.dispatch(new LoadCorretoras({ nome: "", numeroSusep: "", pagina: 0}));
            return new AddVinculoCorretoraCooperativaSuccess(entidade);
          }),
          catchError((msg) => of(new ErroCorretoraAction(msg)))
      )
    )
    );
  });

}
