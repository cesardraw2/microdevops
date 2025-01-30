import {RelatorioAutoActions, RelatorioAutoActionTypes} from '../actions/relatorio-auto.actions';
import {RelatorioPlurianualModel} from '@funcionalidades/relatorio-auto/models/relatorio-plurianual.model';
import {createFeatureSelector, createSelector} from '@ngrx/store';

export interface State {
  relatorio: RelatorioPlurianualModel;
}


export const getRelatorioAutoState = createFeatureSelector<State>('relatorioAuto');
// export const adapter: EntityAdapter<RelatorioAuto> = createEntityAdapter<RelatorioAuto>();

export const initialState: State = {
  relatorio: null
};

export function reducer(
  state = initialState,
  action: RelatorioAutoActions
): State {
  switch (action.type) {
    case RelatorioAutoActionTypes.SucessoRelatorioPlurianual: {
      return {
        ...state, relatorio: action.relatorio
      };
    }
    case RelatorioAutoActionTypes.ClearRelatorioAutos: {
      return Object.assign({}, initialState);
    }

    default: {
      return state;
    }
  }
}

// export const {
//   selectIds,
//   selectEntities,
//   selectAll,
//   selectTotal,
// } = adapter.getSelectors();

export const getRelatorioPlurianual = createSelector(
  getRelatorioAutoState,
  state => {
    return state ? state.relatorio : null;
  }
);
