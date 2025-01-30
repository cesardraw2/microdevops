import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { CentralVendas } from '../models/central-vendas.model';

export enum CentralVendasActionTypes {
  LoadCentralVendass = '[CentralVendas] Load CentralVendass',
  AddCentralVendas = '[CentralVendas] Add CentralVendas',
  UpsertCentralVendas = '[CentralVendas] Upsert CentralVendas',
  AddCentralVendass = '[CentralVendas] Add CentralVendass',
  UpsertCentralVendass = '[CentralVendas] Upsert CentralVendass',
  UpdateCentralVendas = '[CentralVendas] Update CentralVendas',
  UpdateCentralVendass = '[CentralVendas] Update CentralVendass',
  DeleteCentralVendas = '[CentralVendas] Delete CentralVendas',
  DeleteCentralVendass = '[CentralVendas] Delete CentralVendass',
  ClearCentralVendass = '[CentralVendas] Clear CentralVendass'
}

export class LoadCentralVendass implements Action {
  readonly type = CentralVendasActionTypes.LoadCentralVendass;

  constructor(public payload: { centralVendass: CentralVendas[] }) {}
}

export class AddCentralVendas implements Action {
  readonly type = CentralVendasActionTypes.AddCentralVendas;

  constructor(public payload: { centralVendas: CentralVendas }) {}
}

export class UpsertCentralVendas implements Action {
  readonly type = CentralVendasActionTypes.UpsertCentralVendas;

  constructor(public payload: { centralVendas: CentralVendas }) {}
}

export class AddCentralVendass implements Action {
  readonly type = CentralVendasActionTypes.AddCentralVendass;

  constructor(public payload: { centralVendass: CentralVendas[] }) {}
}

export class UpsertCentralVendass implements Action {
  readonly type = CentralVendasActionTypes.UpsertCentralVendass;

  constructor(public payload: { centralVendass: CentralVendas[] }) {}
}

export class UpdateCentralVendas implements Action {
  readonly type = CentralVendasActionTypes.UpdateCentralVendas;

  constructor(public payload: { centralVendas: Update<CentralVendas> }) {}
}

export class UpdateCentralVendass implements Action {
  readonly type = CentralVendasActionTypes.UpdateCentralVendass;

  constructor(public payload: { centralVendass: Update<CentralVendas>[] }) {}
}

export class DeleteCentralVendas implements Action {
  readonly type = CentralVendasActionTypes.DeleteCentralVendas;

  constructor(public payload: { id: string }) {}
}

export class DeleteCentralVendass implements Action {
  readonly type = CentralVendasActionTypes.DeleteCentralVendass;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearCentralVendass implements Action {
  readonly type = CentralVendasActionTypes.ClearCentralVendass;
}

export type CentralVendasActions =
 LoadCentralVendass
 | AddCentralVendas
 | UpsertCentralVendas
 | AddCentralVendass
 | UpsertCentralVendass
 | UpdateCentralVendas
 | UpdateCentralVendass
 | DeleteCentralVendas
 | DeleteCentralVendass
 | ClearCentralVendass;
