import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { CapesService } from '@app/shared/services/capes.service';
import { FindCapesAction, CapesActionTypes, ErroCapesAction, FindCapesSuccessAction } from '../actions/capes.actions';

@Injectable()
export class CapesEffects {

  constructor(private actions$: Actions,
    private capesService: CapesService) {
  }

  consultarPessoaCapes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<FindCapesAction>(CapesActionTypes.FindCapes),
      mergeMap((action: FindCapesAction) =>
        this.capesService.consultarCpfCnpj(action.dadosPessoa).pipe(
          map(pessoa => {
            return new FindCapesSuccessAction(pessoa);
          }),
          catchError((msg: string) => of(new ErroCapesAction(msg)))
        )
      )
    );
  });

}
