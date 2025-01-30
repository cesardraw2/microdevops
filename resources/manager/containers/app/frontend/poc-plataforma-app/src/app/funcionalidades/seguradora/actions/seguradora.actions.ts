import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Seguradora } from '../models/seguradora.model';

export enum SeguradoraActionTypes {
  LoadSeguradoras = '[Seguradora] Load Seguradoras',
  AddSeguradora = '[Seguradora] Add Seguradora',
  UpsertSeguradora = '[Seguradora] Upsert Seguradora',
  AddSeguradoras = '[Seguradora] Add Seguradoras',
  UpsertSeguradoras = '[Seguradora] Upsert Seguradoras',
  UpdateSeguradora = '[Seguradora] Update Seguradora',
  UpdateSeguradoras = '[Seguradora] Update Seguradoras',
  DeleteSeguradora = '[Seguradora] Delete Seguradora',
  DeleteSeguradoras = '[Seguradora] Delete Seguradoras',
  ClearSeguradoras = '[Seguradora] Clear Seguradoras'
}

export class LoadSeguradoras implements Action {
  readonly type = SeguradoraActionTypes.LoadSeguradoras;

  constructor(public payload: { seguradoras: Seguradora[] }) {}
}

export class AddSeguradora implements Action {
  readonly type = SeguradoraActionTypes.AddSeguradora;

  constructor(public payload: { seguradora: Seguradora }) {}
}

export class UpsertSeguradora implements Action {
  readonly type = SeguradoraActionTypes.UpsertSeguradora;

  constructor(public payload: { seguradora: Seguradora }) {}
}

export class AddSeguradoras implements Action {
  readonly type = SeguradoraActionTypes.AddSeguradoras;

  constructor(public payload: { seguradoras: Seguradora[] }) {}
}

export class UpsertSeguradoras implements Action {
  readonly type = SeguradoraActionTypes.UpsertSeguradoras;

  constructor(public payload: { seguradoras: Seguradora[] }) {}
}

export class UpdateSeguradora implements Action {
  readonly type = SeguradoraActionTypes.UpdateSeguradora;

  constructor(public payload: { seguradora: Update<Seguradora> }) {}
}

export class UpdateSeguradoras implements Action {
  readonly type = SeguradoraActionTypes.UpdateSeguradoras;

  constructor(public payload: { seguradoras: Update<Seguradora>[] }) {}
}

export class DeleteSeguradora implements Action {
  readonly type = SeguradoraActionTypes.DeleteSeguradora;

  constructor(public payload: { id: string }) {}
}

export class DeleteSeguradoras implements Action {
  readonly type = SeguradoraActionTypes.DeleteSeguradoras;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearSeguradoras implements Action {
  readonly type = SeguradoraActionTypes.ClearSeguradoras;
}

export type SeguradoraActions =
 LoadSeguradoras
 | AddSeguradora
 | UpsertSeguradora
 | AddSeguradoras
 | UpsertSeguradoras
 | UpdateSeguradora
 | UpdateSeguradoras
 | DeleteSeguradora
 | DeleteSeguradoras
 | ClearSeguradoras;
