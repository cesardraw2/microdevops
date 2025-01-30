import { RelatoriosActions, RelatoriosActionTypes } from '../actions/relatorios.actions';
import { Proposta } from '../models/proposta.model';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import { Paginacao } from '@app/funcionalidades/faturamento/models/paginacao.model';



export const getRelatorioState = createFeatureSelector<State>('relatorios');


export interface State {
  propostasParam: Proposta[];
  paginacao: Paginacao;

  propostasParamVenda: Proposta[];
  paginacaoVenda: Paginacao;
}

export const initialState: State = {
  propostasParam: [],
  paginacao: null,
  propostasParamVenda: [],
  paginacaoVenda: null
};

export function reducer(state = initialState, action: RelatoriosActions): State {
  switch (action.type) {

    case RelatoriosActionTypes.SucessoRelatorioProposta: {
      return {
        ...state, propostasParam: action.propostas, paginacao: action.paginacao
      };
    }

    case RelatoriosActionTypes.SucessoRelatorioPropostaVenda: {
      return {
        ...state, propostasParamVenda: action.propostasVenda, paginacaoVenda: action.paginacaoVenda
      };
    }
  }
}

export const getPropostas = createSelector(
  getRelatorioState,
  state => {
   return state ? state.propostasParam : [];
});
export const getPaginacao = createSelector(getRelatorioState, state => {
  return state && state.propostasParam.length !== 0 ? state.paginacao : null;
});

export const getPropostasVenda = createSelector(
  getRelatorioState,
  state => {
   return state ? state.propostasParamVenda : [];
});
export const getPaginacaoVenda = createSelector(getRelatorioState, state => {
  return state && state.propostasParamVenda.length !== 0 ? state.paginacaoVenda : null;
});
