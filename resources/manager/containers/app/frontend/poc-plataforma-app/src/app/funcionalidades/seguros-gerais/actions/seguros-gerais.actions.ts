import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { SegurosGerais } from '../models/seguros-gerais.model';

export enum SegurosGeraisActionTypes {
  LoadSegurosGeraiss = '[SegurosGerais] Load SegurosGeraiss',
  AddSegurosGerais = '[SegurosGerais] Add SegurosGerais',
  UpsertSegurosGerais = '[SegurosGerais] Upsert SegurosGerais',
  AddSegurosGeraiss = '[SegurosGerais] Add SegurosGeraiss',
  UpsertSegurosGeraiss = '[SegurosGerais] Upsert SegurosGeraiss',
  UpdateSegurosGerais = '[SegurosGerais] Update SegurosGerais',
  UpdateSegurosGeraiss = '[SegurosGerais] Update SegurosGeraiss',
  DeleteSegurosGerais = '[SegurosGerais] Delete SegurosGerais',
  DeleteSegurosGeraiss = '[SegurosGerais] Delete SegurosGeraiss',
  ClearSegurosGeraiss = '[SegurosGerais] Clear SegurosGeraiss'
}

export class LoadSegurosGeraiss implements Action {
  readonly type = SegurosGeraisActionTypes.LoadSegurosGeraiss;

  constructor(public payload: { segurosGeraiss: SegurosGerais[] }) {}
}

export class AddSegurosGerais implements Action {
  readonly type = SegurosGeraisActionTypes.AddSegurosGerais;

  constructor(public payload: { segurosGerais: SegurosGerais }) {}
}

export class UpsertSegurosGerais implements Action {
  readonly type = SegurosGeraisActionTypes.UpsertSegurosGerais;

  constructor(public payload: { segurosGerais: SegurosGerais }) {}
}

export class AddSegurosGeraiss implements Action {
  readonly type = SegurosGeraisActionTypes.AddSegurosGeraiss;

  constructor(public payload: { segurosGeraiss: SegurosGerais[] }) {}
}

export class UpsertSegurosGeraiss implements Action {
  readonly type = SegurosGeraisActionTypes.UpsertSegurosGeraiss;

  constructor(public payload: { segurosGeraiss: SegurosGerais[] }) {}
}

export class UpdateSegurosGerais implements Action {
  readonly type = SegurosGeraisActionTypes.UpdateSegurosGerais;

  constructor(public payload: { segurosGerais: Update<SegurosGerais> }) {}
}

export class UpdateSegurosGeraiss implements Action {
  readonly type = SegurosGeraisActionTypes.UpdateSegurosGeraiss;

  constructor(public payload: { segurosGeraiss: Update<SegurosGerais>[] }) {}
}

export class DeleteSegurosGerais implements Action {
  readonly type = SegurosGeraisActionTypes.DeleteSegurosGerais;

  constructor(public payload: { id: string }) {}
}

export class DeleteSegurosGeraiss implements Action {
  readonly type = SegurosGeraisActionTypes.DeleteSegurosGeraiss;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearSegurosGeraiss implements Action {
  readonly type = SegurosGeraisActionTypes.ClearSegurosGeraiss;
}

export type SegurosGeraisActions =
 LoadSegurosGeraiss
 | AddSegurosGerais
 | UpsertSegurosGerais
 | AddSegurosGeraiss
 | UpsertSegurosGeraiss
 | UpdateSegurosGerais
 | UpdateSegurosGeraiss
 | DeleteSegurosGerais
 | DeleteSegurosGeraiss
 | ClearSegurosGeraiss;
