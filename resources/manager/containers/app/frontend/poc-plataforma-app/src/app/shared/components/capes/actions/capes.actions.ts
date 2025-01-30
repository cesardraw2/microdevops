import {Action} from '@ngrx/store';

import { PessoaModel } from '../models/response/pessoa.model';


export enum CapesActionTypes {
  FindCapes = '[Capes] Consulta Capes',
  FindCapesSuccess = '[Capes] Consulta Capes Success',
  ErroCapes = '[Capes] Erro capes',
  CleanCapes = '[Capes] Clean capes'
}


export class FindCapesAction implements Action {
  readonly type = CapesActionTypes.FindCapes;

  constructor(public dadosPessoa: PessoaModel) {
  }
}

export class FindCapesSuccessAction implements Action {
  readonly type = CapesActionTypes.FindCapesSuccess;

  constructor(public dadosPessoa: PessoaModel) {
  }
}

export class ErroCapesAction implements Action {
  readonly type = CapesActionTypes.ErroCapes;

  constructor(public msgError: string) {
  }
}

export class CleanCapesAction implements Action {
  readonly type = CapesActionTypes.CleanCapes;
  constructor() {}
}


export type CapesActions =
  FindCapesAction |
  FindCapesSuccessAction |
  ErroCapesAction |
  CleanCapesAction;
