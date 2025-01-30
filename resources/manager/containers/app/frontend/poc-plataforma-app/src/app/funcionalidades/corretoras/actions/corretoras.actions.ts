import { Action } from '@ngrx/store';

import { Corretora } from '@app/models/corretora.model';
import { VinculoCorretoraCooperativa } from '@app/models/vinculoCorretoraCooperativa.model';
import { PaginacaoCorretora } from '../containers/container-lista-corretoras/container-lista-corretoras.component';
import { Corretoras } from '../models/corretoras.model';

export enum CorretorasActionTypes {
  LoadCorretoras = '[Corretoras] Load Corretoras',
  LoadCorretorasSuccess = '[Corretoras] Load Corretoras Success',
  LoadCentrais = '[Corretoras] Load Central',
  LoadCooperativas = '[Corretoras] Load Cooperativa',
  AddVinculoCorretoraCooperativa = '[Corretoras] Cria vinculo entra cooperativa e corretora',
  AddVinculoCorretoraCooperativaSuccess = '[Corretoras] Cria vinculo entra cooperativa e corretora sucesso',
  ValidateCooperativa = '[Corretoras] Validate Cooperativas',
  ValidateCooperativaSuccess = '[Corretoras] Validate Cooperativas sucesso',
  FindCorretora = '[Corretora] Obter corretora',
  FindCorretoraSuccess = '[Corretora] Obter corretora Sucesso',
  CleanCorretora = '[Corretora] Limpar corretora selecionada',
  CleanValidateCooperativa = '[Corretora] Limpar Validate Cooperativa',
  ErroCorretora = '[Corretora] - Erro no servico de corretora'
}

export class LoadCorretoras implements Action {
  readonly type = CorretorasActionTypes.LoadCorretoras;
  constructor(public filtros: { nome: string, numeroSusep: string, pagina: number }) { }
}
export class LoadCorretorasSuccess implements Action {
  readonly type = CorretorasActionTypes.LoadCorretorasSuccess;
  constructor(public lista: Corretoras[], public paginacao: PaginacaoCorretora) { }
}
export class AddVinculoCorretoraCooperativa implements Action {
  readonly type = CorretorasActionTypes.AddVinculoCorretoraCooperativa;
  constructor(public dadosVinculo: VinculoCorretoraCooperativa) {}
}
export class AddVinculoCorretoraCooperativaSuccess implements Action {
  readonly type = CorretorasActionTypes.AddVinculoCorretoraCooperativaSuccess;
  constructor(public dadosVinculo: VinculoCorretoraCooperativa) {}
}
export class ValidateCooperativa implements Action {
  readonly type = CorretorasActionTypes.ValidateCooperativa;
  constructor(public idInstituicao: number, public susep: string) {}
}
export class ValidateCooperativaSuccess implements Action {
  readonly type = CorretorasActionTypes.ValidateCooperativaSuccess;
  constructor(public dadosValidado: VinculoCorretoraCooperativa) {}
}
export class FindCorretora implements Action {
  readonly type = CorretorasActionTypes.FindCorretora;
  constructor(public susep: string) {}
}
export class FindCorretoraSuccess implements Action {
  readonly type = CorretorasActionTypes.FindCorretoraSuccess;
  constructor(public dadosCorretora: Corretora) {}
}

export class CleanValidateCooperativa implements Action {
  readonly type = CorretorasActionTypes.CleanValidateCooperativa;
  constructor() {}
}

export class CleanCorretora implements Action {
  readonly type = CorretorasActionTypes.CleanCorretora;
  constructor() {}
}

export class ErroCorretoraAction implements Action {
  readonly type = CorretorasActionTypes.ErroCorretora;

  constructor(public msgError: string) {
  }
}

export type CorretorasActions =
      LoadCorretoras |
      AddVinculoCorretoraCooperativa |
      LoadCorretorasSuccess |
      ValidateCooperativa |
      AddVinculoCorretoraCooperativaSuccess |
      ValidateCooperativaSuccess |
      FindCorretoraSuccess |
      FindCorretora |
      CleanCorretora |
      ErroCorretoraAction |
      CleanValidateCooperativa;
