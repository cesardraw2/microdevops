import { Action } from '@ngrx/store';
import { Documento } from '../models/documento.model';
import { Proposta } from '../models/proposta.model';


export enum CentralAtendimentoActionTypes {
  LoadDocumentos = '[CentralAtendimento] Load Documentos da proposta',
  LoadDocumentosSuccess = '[CentralAtendimento] Load Documentos da proposta Success',
  LoadDocumentosError = '[CentralAtendimento] Load Documentos da proposta Erro',
  FindPropostas = '[CentralAtendimento] Consulta propostas',
  FindPropostasSuccess = '[CentralAtendimento] Consulta propostas Sucesso',
  FindPropostasError = '[CentralAtendimento] Consulta propostas Erro',
  CleanPropostas = '[CentralAtendimento] Clean das propostas',
  CleanDocumentos =  '[CentralCooperado] Clean Documento da proposta'
}

export class LoadDocumentosAction implements Action {
  readonly type = CentralAtendimentoActionTypes.LoadDocumentos;

  constructor(public payload: { idProposta: string }) { }
}


export class LoadDocumentosActionSuccess implements Action {
  readonly type = CentralAtendimentoActionTypes.LoadDocumentosSuccess;

  constructor(public documentos: Documento[]) { }
}

export class CleanDocumentosAction implements Action {
  readonly type = CentralAtendimentoActionTypes.CleanDocumentos;

  constructor() {}
}

export class LoadDocumentosActionError implements Action {
  readonly type = CentralAtendimentoActionTypes.LoadDocumentosError;

  constructor(public msgError: string) {
  }
}

export class FindPropostasAction implements Action {
  readonly type = CentralAtendimentoActionTypes.FindPropostas;

  constructor(public payload: { cpfCnpj: string }) { }
}

export class FindPropostasSuccessAction implements Action {
  readonly type = CentralAtendimentoActionTypes.FindPropostasSuccess;

  constructor(public payload: { propostas: Proposta[] }) { }
}

export class FindPropostasErrorAction implements Action {
  readonly type = CentralAtendimentoActionTypes.FindPropostasError;

  constructor(public msgError: string) { }
}

export class CleanPropostasAction implements Action {
  readonly type = CentralAtendimentoActionTypes.CleanPropostas;

  constructor() {}
}

export type CentralAtendimentoActions =
  LoadDocumentosAction |
  LoadDocumentosActionSuccess |
  LoadDocumentosActionError |
  FindPropostasAction |
  FindPropostasSuccessAction |
  FindPropostasErrorAction |
  CleanPropostasAction |
  CleanDocumentosAction;
