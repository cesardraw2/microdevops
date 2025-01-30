import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import {
  AddFaturamentoAction,
  AddFaturamentoSucessoAction,
  ErroFaturamentosAction,
  FaturamentoActionTypes,
  FindFaturamentosAction,
  LoadFaturamentosSucessoAction,
  StartFaturamentoAction,
  StartFaturamentoSucessoAction,
  UpdateFaturamentoAction,
  UpdateFaturamentoSucessoAction
} from '@funcionalidades/faturamento/actions/faturamento.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { FaturamentoService } from '@funcionalidades/faturamento/faturamento.service';
import { CustomAlertService } from '@shared/services/alert-custom.service';
import { Color } from '@sicoob/ui';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class FaturamentoEffects {

  constructor(private actions$: Actions,
    private faturamentoService: FaturamentoService,
    private translate: TranslateService,
    private alert: CustomAlertService) {
  }

  incluirFaturamento$: Observable<AddFaturamentoSucessoAction | ErroFaturamentosAction> = createEffect(() => {
    return this.actions$.pipe(
      ofType<AddFaturamentoAction>(FaturamentoActionTypes.AddFaturamento),
      mergeMap((action: AddFaturamentoAction) =>
        this.faturamentoService.incluirFaturamento(action.faturamento).pipe(
          map(() => new AddFaturamentoSucessoAction()),
          catchError((msg: string) => of(new ErroFaturamentosAction(msg)))
        )
      )
    );
  });

  iniciarFaturamento$: Observable<StartFaturamentoSucessoAction | ErroFaturamentosAction> = createEffect(() => {
    return this.actions$.pipe(
      ofType<StartFaturamentoAction>(FaturamentoActionTypes.StartFaturamento),
      mergeMap((action: StartFaturamentoAction) =>
        this.faturamentoService.iniciarFaturamento(action.id, action.usuario).pipe(
          map((id) => {
            this.alert.abrirAlert(Color.SUCCESS, action.msgSuccess);
            return new StartFaturamentoSucessoAction(id);
          }),
          catchError((msg: string) => of(new ErroFaturamentosAction(msg)))
        )
      )
    );
  });

  atualizarFaturamento$: Observable<UpdateFaturamentoSucessoAction | ErroFaturamentosAction> = createEffect(() => {
    return this.actions$.pipe(
      ofType<UpdateFaturamentoAction>(FaturamentoActionTypes.UpdateFaturamento),
      mergeMap((action: UpdateFaturamentoAction) =>
        this.faturamentoService.atualizarFaturamento(action.model).pipe(
          map(() => {
            if (action.modal) {
              action.modal.close();
            }
            this.alert.abrirAlert(Color.SUCCESS, action.msgSuccess);
            return new UpdateFaturamentoSucessoAction(action.model.id);
          }),
          catchError((msg: string) => of(new ErroFaturamentosAction(msg)))
        )
      )
    );
  });

  filterFaturamentos$: Observable<LoadFaturamentosSucessoAction | ErroFaturamentosAction> = createEffect(() => {
    return this.actions$.pipe(
      ofType<FindFaturamentosAction>(FaturamentoActionTypes.FindFaturamento),
      mergeMap((action: FindFaturamentosAction) =>
        this.faturamentoService.consultarFaturamentos(action.model, action.pagina).pipe(
          map(({ faturamentos, paginacao }) => {
            return new LoadFaturamentosSucessoAction(faturamentos, paginacao);
          }),
          catchError((msg: string) => of(new ErroFaturamentosAction(msg)))
        )
      )
    );
  });

}
