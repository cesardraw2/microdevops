import { Action } from '@ngrx/store';
import { Proposta } from '../models/proposta.model';
import { Paginacao } from '@app/funcionalidades/faturamento/models/paginacao.model';
import { ConsultaRelatorioModel } from '../models/request/consulta-relatorio.model';

export enum RelatoriosActionTypes {
  LoadRelatorioProposta = '[Relatorios Proposta] Load Relatorios Proposta',
  ErroRelatorioProposta = '[Relatorios Proposta] Erro Relatorios Proposta',
  SucessoRelatorioProposta = '[Relatorios Proposta] Sucesso Relatorios Proposta',
  LoadRelatorioPropostaVenda = '[Relatorios Proposta Venda] Load Relatorios Proposta',
  SucessoRelatorioPropostaVenda = '[Relatorios Proposta Venda] Sucesso Relatorios Proposta',
}

export class LoadRelatorioProposta implements Action {
  readonly type = RelatoriosActionTypes.LoadRelatorioProposta;

  constructor(public filtro: ConsultaRelatorioModel, public pagina: number) {}
}

export class LoadRelatorioPropostaVenda implements Action {
  readonly type = RelatoriosActionTypes.LoadRelatorioPropostaVenda;

  constructor(public filtro: ConsultaRelatorioModel, public pagina: number) {}
}

export class ErroRelatorioProposta implements Action {
  readonly type = RelatoriosActionTypes.ErroRelatorioProposta;

  constructor(public msgError: string) {
  }
}

export class SucessoRelatorioProposta implements Action {
  readonly type = RelatoriosActionTypes.SucessoRelatorioProposta;

  constructor(public propostas: Proposta[], public paginacao: Paginacao) {
  }
}

export class SucessoRelatorioPropostaVenda implements Action {
  readonly type = RelatoriosActionTypes.SucessoRelatorioPropostaVenda;

  constructor(public propostasVenda: Proposta[], public paginacaoVenda: Paginacao) {
  }
}


export type RelatoriosActions =
  LoadRelatorioProposta
| ErroRelatorioProposta
| SucessoRelatorioProposta
| LoadRelatorioPropostaVenda
| SucessoRelatorioPropostaVenda;
