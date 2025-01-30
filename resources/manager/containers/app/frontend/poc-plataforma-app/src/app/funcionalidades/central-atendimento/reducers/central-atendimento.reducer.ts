import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CentralAtendimentoActions, CentralAtendimentoActionTypes } from '../actions/central-atendimento.actions';
import { Documento } from '../models/documento.model';
import { Proposta } from '../models/proposta.model';

export interface State {
  msg: string;
  cpf: string;
  propostas: Proposta[];
  documentos: Documento[]
}

export const getCentralAtendimentoState = createFeatureSelector<State>('centralAtendimento');

export const initialState: State = {
  msg: '',
  cpf: '',
  propostas: [],
  documentos: []
};

export function reducer(state = initialState, action: CentralAtendimentoActions): State {
  switch (action.type) {
    case CentralAtendimentoActionTypes.LoadDocumentos: {
      return { ...state, cpf: action.payload.idProposta };
    }

    case CentralAtendimentoActionTypes.LoadDocumentosSuccess: {
      return { ...state, documentos: action.documentos };
    }

    case CentralAtendimentoActionTypes.CleanDocumentos: {
      return {...state, documentos: []};
    }

    case CentralAtendimentoActionTypes.LoadDocumentosError: {
      return {...state, msg: action.msgError };
    }

    case CentralAtendimentoActionTypes.FindPropostas: {
      return { ...state, cpf: action.payload.cpfCnpj };
    }

    case CentralAtendimentoActionTypes.FindPropostasSuccess: {
      return { ...state, propostas: action.payload.propostas };
    }

    case CentralAtendimentoActionTypes.FindPropostasError: {
      return {...state, msg: action.msgError };
    }

    case CentralAtendimentoActionTypes.CleanPropostas: {
      return {...state, msg: '', cpf: '', propostas: []};
    }

    default: {
      return state;
    }
  }
}

export const getPropostas = createSelector(getCentralAtendimentoState, state => {
  return state.propostas.length !== 0 ? state.propostas : null;
});

export const getDocumentos = createSelector(getCentralAtendimentoState, state => {
  return state && state.documentos ? state.documentos : null;
});
