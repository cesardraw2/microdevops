import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { MenuInicial } from '../models/menu-inicial.model';

export enum MenuInicialActionTypes {
  LoadMenuInicials = '[MenuInicial] Load MenuInicials',
  AddMenuInicial = '[MenuInicial] Add MenuInicial',
  UpsertMenuInicial = '[MenuInicial] Upsert MenuInicial',
  AddMenuInicials = '[MenuInicial] Add MenuInicials',
  UpsertMenuInicials = '[MenuInicial] Upsert MenuInicials',
  UpdateMenuInicial = '[MenuInicial] Update MenuInicial',
  UpdateMenuInicials = '[MenuInicial] Update MenuInicials',
  DeleteMenuInicial = '[MenuInicial] Delete MenuInicial',
  DeleteMenuInicials = '[MenuInicial] Delete MenuInicials',
  ClearMenuInicials = '[MenuInicial] Clear MenuInicials'
}

export class LoadMenuInicials implements Action {
  readonly type = MenuInicialActionTypes.LoadMenuInicials;

  constructor(public payload: { menuInicials: MenuInicial[] }) {}
}

export class AddMenuInicial implements Action {
  readonly type = MenuInicialActionTypes.AddMenuInicial;

  constructor(public payload: { menuInicial: MenuInicial }) {}
}

export class UpsertMenuInicial implements Action {
  readonly type = MenuInicialActionTypes.UpsertMenuInicial;

  constructor(public payload: { menuInicial: MenuInicial }) {}
}

export class AddMenuInicials implements Action {
  readonly type = MenuInicialActionTypes.AddMenuInicials;

  constructor(public payload: { menuInicials: MenuInicial[] }) {}
}

export class UpsertMenuInicials implements Action {
  readonly type = MenuInicialActionTypes.UpsertMenuInicials;

  constructor(public payload: { menuInicials: MenuInicial[] }) {}
}

export class UpdateMenuInicial implements Action {
  readonly type = MenuInicialActionTypes.UpdateMenuInicial;

  constructor(public payload: { menuInicial: Update<MenuInicial> }) {}
}

export class UpdateMenuInicials implements Action {
  readonly type = MenuInicialActionTypes.UpdateMenuInicials;

  constructor(public payload: { menuInicials: Update<MenuInicial>[] }) {}
}

export class DeleteMenuInicial implements Action {
  readonly type = MenuInicialActionTypes.DeleteMenuInicial;

  constructor(public payload: { id: string }) {}
}

export class DeleteMenuInicials implements Action {
  readonly type = MenuInicialActionTypes.DeleteMenuInicials;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearMenuInicials implements Action {
  readonly type = MenuInicialActionTypes.ClearMenuInicials;
}

export type MenuInicialActions =
 LoadMenuInicials
 | AddMenuInicial
 | UpsertMenuInicial
 | AddMenuInicials
 | UpsertMenuInicials
 | UpdateMenuInicial
 | UpdateMenuInicials
 | DeleteMenuInicial
 | DeleteMenuInicials
 | ClearMenuInicials;
