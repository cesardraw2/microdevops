import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CentralAtendimentoService } from '../central-atendimento.service';
import { CentralAtendimentoActionTypes, FindPropostasAction, FindPropostasErrorAction, FindPropostasSuccessAction, LoadDocumentosAction, LoadDocumentosActionError, LoadDocumentosActionSuccess } from './../actions/central-atendimento.actions';


@Injectable()
export class CentralAtendimentoEffects {

  constructor(private actions$: Actions,
    private centralAtendimentoService: CentralAtendimentoService) { }


  consultarPropostas$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<FindPropostasAction>(CentralAtendimentoActionTypes.FindPropostas),
      mergeMap((action: FindPropostasAction) =>
        this.centralAtendimentoService.buscarPropostas(action.payload.cpfCnpj).pipe(
          map(resultado => {
            return new FindPropostasSuccessAction(resultado);
          }),
          catchError((msg: string) => of(new FindPropostasErrorAction(msg)))
        )
      )
    );
  });

  consultarDocumentos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<LoadDocumentosAction>(CentralAtendimentoActionTypes.LoadDocumentos),
      mergeMap((action: LoadDocumentosAction) =>
        this.centralAtendimentoService.buscarDocumentos(action.payload.idProposta).pipe(
          map(resultado => {
            return new LoadDocumentosActionSuccess(resultado);
          }),
          catchError((msg: string) => of(new LoadDocumentosActionError(msg)))
        )
      )
    );
  });

}