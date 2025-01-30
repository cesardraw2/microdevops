import {Faturamento} from '../models/faturamento.model';
import {FaturamentoActions, FaturamentoActionTypes} from '../actions/faturamento.actions';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {StatusFaturamentoEnum} from '@funcionalidades/faturamento/enums/status-faturamento.enum';
import {Paginacao} from '@funcionalidades/faturamento/models/paginacao.model';

export const getFaturamentoState = createFeatureSelector<State>('faturamento');

export interface State {
  faturamentos: Faturamento[];
  paginacao: Paginacao;
}

export const initialState: State = {
  faturamentos: [],
  paginacao: null
};

export function reducer(state = initialState, action: FaturamentoActions): State {
  switch (action.type) {
    case FaturamentoActionTypes.AddFaturamentoSuccess: {
      return {...state};
    }
    case FaturamentoActionTypes.LoadFaturamentosSuccess: {
      return {...state, faturamentos: action.faturamentos ? action.faturamentos : [], paginacao: action.paginacao};
    }
    case FaturamentoActionTypes.StartFaturamentoSuccess: {
      return {
        ...state, faturamentos: state.faturamentos.map(r => {
          if (r.id === action.id) {
            r.status = StatusFaturamentoEnum.PROCESSAMENTO;
          }
          return r;
        })
      };
    }
    case FaturamentoActionTypes.UpdateFaturamentoSuccess: {
      const faturamento = state.faturamentos.find(a => a.id === action.id);
      if (faturamento) {
        const index: number = state.faturamentos.indexOf(faturamento);
        state.faturamentos.splice(index, 1);
      }
      return {...state};
    }
    default: {
      return {...state};
    }
  }
}

export const getFaturamentos = createSelector(getFaturamentoState, state => {
  return state.faturamentos.length !== 0 ? state.faturamentos : null;
});
export const getPaginacao = createSelector(getFaturamentoState, state => {
  return state.faturamentos.length !== 0 ? state.paginacao : null;
});
