import {Action} from '@ngrx/store';
import {Update} from '@ngrx/entity';
import {RelatorioAuto} from '../models/relatorio-auto.model';
import {ConsultaRelatorioPlurianualModel} from '@funcionalidades/relatorio-auto/models/consulta-relatorio-plurianual.model';
import {RelatorioPlurianualModel} from '@funcionalidades/relatorio-auto/models/relatorio-plurianual.model';

export enum RelatorioAutoActionTypes {
  LoadRelatorioAutos = '[RelatorioAuto] Load RelatorioAutos',
  LoadRelatorioPlurianual = '[RelatorioAuto] Load RelatorioPlurianual',
  SucessoRelatorioPlurianual = '[RelatorioAuto] Sucesso Relatorio Plurianual',
  ErroRelatorioPlurianual = '[RelatorioAuto] Erro ao consultar Relatorio Plurianual',
  AddRelatorioAuto = '[RelatorioAuto] Add RelatorioAuto',
  UpsertRelatorioAuto = '[RelatorioAuto] Upsert RelatorioAuto',
  AddRelatorioAutos = '[RelatorioAuto] Add RelatorioAutos',
  UpsertRelatorioAutos = '[RelatorioAuto] Upsert RelatorioAutos',
  UpdateRelatorioAuto = '[RelatorioAuto] Update RelatorioAuto',
  UpdateRelatorioAutos = '[RelatorioAuto] Update RelatorioAutos',
  DeleteRelatorioAuto = '[RelatorioAuto] Delete RelatorioAuto',
  DeleteRelatorioAutos = '[RelatorioAuto] Delete RelatorioAutos',
    ClearRelatorioAutos = '[RelatorioAuto] Clear RelatorioAutos'
}

export class LoadRelatorioAutos implements Action {
  readonly type = RelatorioAutoActionTypes.LoadRelatorioAutos;

  constructor(public payload: { relatorioAutos: RelatorioAuto[] }) {}
}

export class LoadRelatorioPlurianual implements Action {
  readonly type = RelatorioAutoActionTypes.LoadRelatorioPlurianual;

  constructor(public filtro: ConsultaRelatorioPlurianualModel) {}
}

export class SucessoRelatorioPlurianual implements Action {
  readonly type = RelatorioAutoActionTypes.SucessoRelatorioPlurianual;

  constructor(public relatorio: RelatorioPlurianualModel) {}
}

export class AddRelatorioAuto implements Action {
  readonly type = RelatorioAutoActionTypes.AddRelatorioAuto;

  constructor(public payload: { relatorioAuto: RelatorioAuto }) {}
}

export class UpsertRelatorioAuto implements Action {
  readonly type = RelatorioAutoActionTypes.UpsertRelatorioAuto;

  constructor(public payload: { relatorioAuto: RelatorioAuto }) {}
}

export class AddRelatorioAutos implements Action {
  readonly type = RelatorioAutoActionTypes.AddRelatorioAutos;

  constructor(public payload: { relatorioAutos: RelatorioAuto[] }) {}
}

export class UpsertRelatorioAutos implements Action {
  readonly type = RelatorioAutoActionTypes.UpsertRelatorioAutos;

  constructor(public payload: { relatorioAutos: RelatorioAuto[] }) {}
}

export class UpdateRelatorioAuto implements Action {
  readonly type = RelatorioAutoActionTypes.UpdateRelatorioAuto;

  constructor(public payload: { relatorioAuto: Update<RelatorioAuto> }) {}
}

export class UpdateRelatorioAutos implements Action {
  readonly type = RelatorioAutoActionTypes.UpdateRelatorioAutos;

  constructor(public payload: { relatorioAutos: Update<RelatorioAuto>[] }) {}
}

export class DeleteRelatorioAuto implements Action {
  readonly type = RelatorioAutoActionTypes.DeleteRelatorioAuto;

  constructor(public payload: { id: string }) {}
}

export class DeleteRelatorioAutos implements Action {
  readonly type = RelatorioAutoActionTypes.DeleteRelatorioAutos;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearRelatorioAutos implements Action {
  readonly type = RelatorioAutoActionTypes.ClearRelatorioAutos;
}

export class ErroRelatorioPlurianual implements Action {
  readonly type = RelatorioAutoActionTypes.ErroRelatorioPlurianual;

  constructor(public msgError: string) {
  }
}

export type RelatorioAutoActions =
 LoadRelatorioAutos
 | AddRelatorioAuto
 | UpsertRelatorioAuto
 | AddRelatorioAutos
 | UpsertRelatorioAutos
 | UpdateRelatorioAuto
 | UpdateRelatorioAutos
 | DeleteRelatorioAuto
 | DeleteRelatorioAutos
 | LoadRelatorioPlurianual
 | SucessoRelatorioPlurianual
 | ErroRelatorioPlurianual
 | ClearRelatorioAutos;
