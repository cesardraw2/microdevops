import { Action } from '@ngrx/store';
import { Devolucao } from '../models/devolucao.model';
import { Central } from '../models/central.model';
import { Cooperativa } from '../models/cooperativa.model';

export enum DevolucaoActionTypes {
  LoadDevolucaos = '[Devolucao] Load Devolucaos',
  LoadDevolucoesSucesso = '[Devolucao] Load Devolucoes Sucesso',
  LoadCentrais = '[Devolucao] Load Central',
  LoadCooperativas = '[Devolucao] Load Cooperativa',
  LoadCentraisSucesso = '[Devolucao] Load Central Sucesso',
  LoadCooperativasSucesso = '[Devolucao] Load Cooperativas Sucesso',
  LoadCentralFail = '[Devolucao] Central Fail',
  LoadCooperativaFail = '[Devolucao] Cooperativa Fail',
  LoadDevolucoesFail = '[Devolucao] Devolucao Fail',
  CleanDevolucoes = '[Devolucao] Devolucao Clear',
  AddDevolucao = '[Devolucao] Add Devolucao',
  UpdateDevolucao = '[Devolucao] Update Devolucao',
  UpdateStatusDevolucao = '[Devolucao] Update Status Devolucao',
}

export class AddDevolucao implements Action {
  readonly type = DevolucaoActionTypes.AddDevolucao;
  constructor(public devolucao: Devolucao) { }
}

export class UpdateDevolucao implements Action {
  readonly type = DevolucaoActionTypes.UpdateDevolucao;
  constructor(public devolucao: Devolucao) { }
}

export class UpdateStatusDevolucao implements Action {
  readonly type = DevolucaoActionTypes.UpdateStatusDevolucao;
  constructor(public devolucao: Devolucao) { }
}

export class LoadDevolucaos implements Action {
  readonly type = DevolucaoActionTypes.LoadDevolucaos;
  constructor(public filtro: Devolucao ) { }
}

export class LoadCentraisSucesso implements Action {
  readonly type = DevolucaoActionTypes.LoadCentraisSucesso;
  constructor(public centrais: Central[]) { }
}

export class LoadDevolucoesSucesso implements Action {
  readonly type = DevolucaoActionTypes.LoadDevolucoesSucesso;
  constructor(public devolucoes: Devolucao[]) { }
}

export class LoadCentrais implements Action {
  readonly type = DevolucaoActionTypes.LoadCentrais;
  constructor( ) { }
}

export class LoadCooperativas implements Action {
  readonly type = DevolucaoActionTypes.LoadCooperativas;
  constructor(public id: string) { }
}

export class LoadCooperativasSucesso implements Action {
  readonly type = DevolucaoActionTypes.LoadCooperativasSucesso;
  constructor(public cooperativas: Cooperativa[]) { }
}

export class LoadCentralFail implements Action {
  readonly type = DevolucaoActionTypes.LoadCentralFail;
  constructor(public error: any) { }
}

export class LoadCooperativaFail implements Action {
  readonly type = DevolucaoActionTypes.LoadCooperativaFail;
  constructor(public error: any) { }
}

export class LoadDevolucoesFail implements Action {
  readonly type = DevolucaoActionTypes.LoadDevolucoesFail;
  constructor(public error: any) { }
}

export class CleanDevolucoes implements Action {
  readonly type = DevolucaoActionTypes.CleanDevolucoes;
  constructor() { }
}

export type DevolucaoActions =
 LoadDevolucaos
 | LoadDevolucoesSucesso
 | LoadCentrais
 | LoadCentraisSucesso
 | LoadCooperativas
 | LoadCooperativasSucesso
 | LoadCentralFail
 | LoadCooperativaFail
 | LoadDevolucoesFail
 | CleanDevolucoes
 | AddDevolucao
 | UpdateStatusDevolucao
 | UpdateDevolucao;
