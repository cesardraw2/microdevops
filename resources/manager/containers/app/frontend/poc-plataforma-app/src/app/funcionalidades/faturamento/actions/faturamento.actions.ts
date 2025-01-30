import {Action} from '@ngrx/store';
import {Faturamento} from '../models/faturamento.model';
import {ConsultaFaturamentoModel} from '@funcionalidades/faturamento/models/request/consulta-faturamento.model';
import {IncluiFaturamentoModel} from '@funcionalidades/faturamento/models/request/inclui-faturamento-model';
import {AtualizaFaturamentoModel} from '@funcionalidades/faturamento/models/request/atualiza-faturamento.model';
import {ModalRef} from '@sicoob/ui';
import {Paginacao} from '@funcionalidades/faturamento/models/paginacao.model';

export enum FaturamentoActionTypes {
  AddFaturamento = '[Faturamento] Add Faturamento',
  AddFaturamentoSuccess = '[Faturamento] Add Faturamento Success',
  LoadFaturamentos = '[Faturamento] Load Faturamentos',
  LoadFaturamentosSuccess = '[Faturamento] Load Faturamentos Success',
  StartFaturamento = '[Faturamento] Iniciar Faturamento',
  StartFaturamentoSuccess = '[Faturamento] Iniciar Faturamento Success',
  UpdateFaturamento = '[Faturamento] Atualizar Faturamento',
  UpdateFaturamentoSuccess = '[Faturamento] Atualizar Faturamento Success',
  FindFaturamento = '[Faturamento] Consulta Faturamento',
  FindDocumentosFaturamento = '[Faturamento] Consulta Documentos Faturamento',
  ErroFaturamentos = '[Faturamento] Erro faturamentos',
  CleanErrosFaturamentos = '[Faturamento] Clean Erro faturamentos'
}

export class AddFaturamentoAction implements Action {
  readonly type = FaturamentoActionTypes.AddFaturamento;

  constructor(public faturamento: IncluiFaturamentoModel) {
  }
}

export class AddFaturamentoSucessoAction implements Action {
  readonly type = FaturamentoActionTypes.AddFaturamentoSuccess;

  constructor() {
  }
}

export class LoadFaturamentosAction implements Action {
  readonly type = FaturamentoActionTypes.LoadFaturamentos;

  constructor() {
  }
}

export class LoadFaturamentosSucessoAction implements Action {
  readonly type = FaturamentoActionTypes.LoadFaturamentosSuccess;

  constructor(public faturamentos: Array<Faturamento>, public paginacao: Paginacao) {
  }
}

export class StartFaturamentoAction implements Action {
  readonly type = FaturamentoActionTypes.StartFaturamento;

  constructor(public id: number, public usuario: string, public msgSuccess: string) {
  }
}

export class StartFaturamentoSucessoAction implements Action {
  readonly type = FaturamentoActionTypes.StartFaturamentoSuccess;

  constructor(public id: number) {
  }
}

export class UpdateFaturamentoAction implements Action {
  readonly type = FaturamentoActionTypes.UpdateFaturamento;

  constructor(public model: AtualizaFaturamentoModel, public msgSuccess: string, public modal?: ModalRef) {
  }
}

export class UpdateFaturamentoSucessoAction implements Action {
  readonly type = FaturamentoActionTypes.UpdateFaturamentoSuccess;

  constructor(public id: number) {
  }
}

export class FindFaturamentosAction implements Action {
  readonly type = FaturamentoActionTypes.FindFaturamento;

  constructor(public model: ConsultaFaturamentoModel, public pagina: number) {
  }
}

export class ErroFaturamentosAction implements Action {
  readonly type = FaturamentoActionTypes.ErroFaturamentos;

  constructor(public msgError: string) {
  }
}

export class CleanErrosFaturamentosAction implements Action {
  readonly type = FaturamentoActionTypes.CleanErrosFaturamentos;

  constructor() {
  }
}


export type FaturamentoActions =
  AddFaturamentoSucessoAction |
  LoadFaturamentosAction |
  LoadFaturamentosSucessoAction |
  StartFaturamentoAction |
  StartFaturamentoSucessoAction |
  UpdateFaturamentoAction |
  UpdateFaturamentoSucessoAction |
  FindFaturamentosAction |
  ErroFaturamentosAction;
