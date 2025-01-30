import {createFeatureSelector, createSelector} from '@ngrx/store';
import { PessoaModel } from '@app/shared/components/capes/models/response/pessoa.model';
import { CapesActions, CapesActionTypes } from '../actions/capes.actions';

export const getCapesConsultaState = createFeatureSelector<State>('capesConsulta');

export interface State {
  pessoa: PessoaModel;
}

export const initialState: State = {
  pessoa: {},
};

export function reducer(state = initialState, action: CapesActions): State {
  switch (action.type) {
    case CapesActionTypes.FindCapes: {
      return {...state, pessoa: action.dadosPessoa ? action.dadosPessoa : {}};
    }
    case CapesActionTypes.FindCapesSuccess: {
      return {...state, pessoa: action.dadosPessoa};
    }
    case CapesActionTypes.CleanCapes: {
      state = null;
      return {...state};
    }
    default: {
      return {...state};
    }
  }
}

export const getCapes = createSelector(getCapesConsultaState, state => {
  return state && state.pessoa ? state.pessoa : null;
});


export const getCleanCapes = createSelector(getCapesConsultaState, state => {
  return state.pessoa;
});
