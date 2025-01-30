
import { Devolucao } from '../models/devolucao.model';
import { Central } from '../models/central.model';
import { Cooperativa } from '../models/cooperativa.model';
import { DevolucaoActions, DevolucaoActionTypes } from '../actions/devolucao.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State {
  devolucoes: Devolucao[];
  centrais: Central[];
  cooperativas: Cooperativa[];
  devolucao: Devolucao;
}


export const initialState: State = {
  devolucoes: [],
  centrais: [],
  cooperativas: [],
  devolucao: new Devolucao()
};

export function reducer(state = initialState, action: DevolucaoActions): State {
  switch (action.type) {
    case DevolucaoActionTypes.LoadCooperativasSucesso: {
      return {
        ...state, cooperativas: action.cooperativas
      };
    }
    case DevolucaoActionTypes.LoadCentraisSucesso: {
      return {
        ...state, centrais: action.centrais
      };
    }
    case DevolucaoActionTypes.LoadDevolucoesSucesso: {
      return {
        ...state, devolucoes: action.devolucoes
      };
    }
    case DevolucaoActionTypes.AddDevolucao: {
      return {
        ...state, devolucao: action.devolucao
      };
    }
    case DevolucaoActionTypes.CleanDevolucoes: {
      return {
        ...state, devolucoes: null
      };
    }
    default: {
      return state;
    }
  }
}

export const getDevolucoesState = createFeatureSelector<State>('devolucao');

export const getDevolucoes = createSelector(
  getDevolucoesState,
  state => {
    return state.devolucoes;
});

export const getCentrais = createSelector(
  getDevolucoesState,
  state => {
    return state.centrais;
});

export const getCooperativas = createSelector(
  getDevolucoesState,
  state => {
    return state.cooperativas;
});

export const getDevolucao = createSelector(
  getDevolucoesState,
  state => {
    return state.devolucao;
});

