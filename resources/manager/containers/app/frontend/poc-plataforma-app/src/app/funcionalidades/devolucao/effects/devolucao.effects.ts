import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { DevolucaoActionTypes, LoadCentrais, LoadCentraisSucesso, LoadCooperativas, LoadCooperativasSucesso, LoadCentralFail, LoadCooperativaFail, LoadDevolucaos, LoadDevolucoesSucesso, LoadDevolucoesFail, AddDevolucao, UpdateStatusDevolucao } from '../actions/devolucao.actions';
import { DevolucaoService } from '../devolucao.service';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Central } from '../models/central.model';
import { Color } from '@sicoob/ui';
import { CustomAlertService } from '@app/shared/services/alert-custom.service';
import { Cooperativa } from '../models/cooperativa.model';
import { Devolucao } from '../models/devolucao.model';


@Injectable()
export class DevolucaoEffects {

  constructor(private actions$: Actions, private devolucaoService: DevolucaoService, private readonly alertService: CustomAlertService) {}

  getCentrais$ = createEffect(() => {
    return this.actions$.pipe(ofType<LoadCentrais>(DevolucaoActionTypes.LoadCentrais),
        map((action: LoadCentrais) => action),
        switchMap((action: LoadCentrais) => this.devolucaoService.carregarCentrais().pipe(
          map((centrais: Central[]) => new LoadCentraisSucesso(centrais)),
          catchError(error => of(new LoadCentralFail(error))))));
        });

  getCooperativas$ = createEffect(() => {
    return this.actions$.pipe(ofType<LoadCooperativas>(DevolucaoActionTypes.LoadCooperativas),
        map((action: LoadCooperativas) => action),
        switchMap((action: LoadCooperativas) => this.devolucaoService.carregarCooperativas(action.id).pipe(
          map((cooperativas: Cooperativa[]) => new LoadCooperativasSucesso(cooperativas)),
          catchError(error => of(new LoadCooperativaFail(error))))));
        });

  getDevolucoes$ = createEffect(() => {
    return this.actions$.pipe(ofType<LoadDevolucaos>(DevolucaoActionTypes.LoadDevolucaos),
        map((action: LoadDevolucaos) => action),
        switchMap((action: LoadDevolucaos) => this.devolucaoService.consultarDevolucao(action.filtro).pipe(
          map((devolucoes: Devolucao[]) => new LoadDevolucoesSucesso(devolucoes)),
          catchError(error => of(new LoadDevolucoesFail(error))))));
        });

  addDevolucoes$ = createEffect(() => {
    return this.actions$.pipe(ofType<AddDevolucao>(DevolucaoActionTypes.AddDevolucao),
        map((action: AddDevolucao) => action),
        switchMap((action: AddDevolucao) => this.devolucaoService.incluirDevolucao(action.devolucao).pipe(
          map(() => new LoadDevolucoesSucesso(null)),
          catchError(error => of(new LoadDevolucoesFail(error))))));
        });

  updateStatusDevolucoes$ = createEffect(() => {
    return this.actions$.pipe(ofType<UpdateStatusDevolucao>(DevolucaoActionTypes.UpdateStatusDevolucao),
        map((action: UpdateStatusDevolucao) => action),
        switchMap((action: UpdateStatusDevolucao) => this.devolucaoService.alterarStatus(action.devolucao).pipe(
          map(() => new LoadDevolucoesSucesso(null)),
          catchError(error => of(new LoadDevolucoesFail(error))))));
        });

  loadCentralFail$ = createEffect(() => {
    return this.actions$.pipe(ofType<LoadCentralFail>(DevolucaoActionTypes.LoadCentralFail),
        map((action: LoadCentralFail) => this.alertService.abrirAlert(Color.DANGER, "Ocorreu um erro na consulta de Centrais")));
  }, {dispatch: false});

  
  loadCooperativaFail$ = createEffect(() => {
    return this.actions$.pipe(ofType<LoadCooperativaFail>(DevolucaoActionTypes.LoadCooperativaFail),
        map((action: LoadCooperativaFail) => this.alertService.abrirAlert(Color.DANGER, "Ocorreu um erro na consulta das Cooperativas")));
  }, {dispatch: false});

  loadDevolucaoFail$ = createEffect(() => {
    return this.actions$.pipe(ofType<LoadDevolucoesFail>(DevolucaoActionTypes.LoadDevolucoesFail),
        map((action: LoadDevolucoesFail) => this.alertService.abrirAlert(Color.DANGER, "Ocorreu um erro na consulta das Devoluções")));
  }, {dispatch: false});
}
