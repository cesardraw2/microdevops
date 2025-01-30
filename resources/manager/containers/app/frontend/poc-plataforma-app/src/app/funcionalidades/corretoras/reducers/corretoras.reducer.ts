import { Cooperativa } from '@app/models/cooperativa.model';
import { Corretora } from '@app/models/corretora.model';
import { InstituicaoModel } from '@app/models/instituicao.model';
import { VinculoCorretoraCooperativa } from '@app/models/vinculoCorretoraCooperativa.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CorretorasActionTypes, CorretorasActions } from '../actions/corretoras.actions';
import { PaginacaoCorretora } from '../containers/container-lista-corretoras/container-lista-corretoras.component';
import { Corretoras } from '../models/corretoras.model';

export const getCorretorasState = createFeatureSelector<State>('corretoras');

export interface State {
  listaCorretoras: Corretoras[];
  centrais: InstituicaoModel[];
  cooperativas: Cooperativa[];
  paginacao: PaginacaoCorretora;
  idInstituicao: number;
  susep: string;
  dadosVinculo: VinculoCorretoraCooperativa;
  dadosValidado: VinculoCorretoraCooperativa;
  dadosCorretora: Corretora
}

export const initialState: State = {
  listaCorretoras: [],
  centrais: [],
  cooperativas: [],
  paginacao: null,
  idInstituicao: null,
  susep: null,
  dadosVinculo: null,
  dadosValidado: null,
  dadosCorretora: null,
};

export function reducer(state = initialState, action: CorretorasActions): State {
  switch (action.type) {
    case CorretorasActionTypes.AddVinculoCorretoraCooperativa: {
      return {
        ...state,
        dadosVinculo: action.dadosVinculo
      };
    }

    case CorretorasActionTypes.LoadCorretorasSuccess: {
      return {
        ...state,
        listaCorretoras: action.lista,
        paginacao: action.paginacao
      };
    }
    case CorretorasActionTypes.ValidateCooperativa: {
      return {
        ...state,
        idInstituicao: action.idInstituicao,
        susep: action.susep
      };
    }
    case CorretorasActionTypes.ValidateCooperativaSuccess: {
      return {
        ...state,
        dadosValidado: action.dadosValidado,
      };
    }
    case CorretorasActionTypes.FindCorretora: {
      return {
        ...state,
        susep: action.susep
      };
    }
    case CorretorasActionTypes.FindCorretoraSuccess: {
      return {
        ...state,
        dadosCorretora: action.dadosCorretora,
      };
    }
    case CorretorasActionTypes.CleanCorretora: {
      return {
        ...state,
        dadosCorretora: null,
      };
    }
    case CorretorasActionTypes.CleanValidateCooperativa: {
      return {
        ...state,
        dadosValidado: null,
        dadosVinculo: null
      }
    }
    default: {
      return state;
    }
  }
}

export const getCorretoras = createSelector(
  getCorretorasState,
  state => {
    return state ? state.listaCorretoras : [];
  });

export const getCentrais = createSelector(
  getCorretorasState,
  state => {
    return state ? state.centrais : [];
  });

export const getCooperativas = createSelector(
  getCorretorasState,
  state => {
    return state ? state.cooperativas : [];
  });

export const getPaginacaoCorretora = createSelector(
  getCorretorasState,
  state => {
    return state && state.listaCorretoras && state.listaCorretoras.length > 0 ? state.paginacao : null;
  });

export const getValidar = createSelector(
  getCorretorasState,
  state => {
    return state ? state.dadosValidado : null;
  });

export const getCorretora = createSelector(
  getCorretorasState,
  state => {
    return state ? state.dadosCorretora : null;
  });

export const addVinculoCorretora = createSelector(
  getCorretorasState,
  state => {
    return state ? state.dadosVinculo : null;
  });
