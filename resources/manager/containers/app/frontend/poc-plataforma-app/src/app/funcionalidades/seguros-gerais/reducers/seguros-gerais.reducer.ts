import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { SegurosGerais } from '../models/seguros-gerais.model';
import { SegurosGeraisActions, SegurosGeraisActionTypes } from '../actions/seguros-gerais.actions';

export interface State extends EntityState<SegurosGerais> {
  // additional entities state properties
}

export const adapter: EntityAdapter<SegurosGerais> = createEntityAdapter<SegurosGerais>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: SegurosGeraisActions
): State {
  switch (action.type) {
    case SegurosGeraisActionTypes.AddSegurosGerais: {
      return adapter.addOne(action.payload.segurosGerais, state);
    }

    case SegurosGeraisActionTypes.UpsertSegurosGerais: {
      return adapter.upsertOne(action.payload.segurosGerais, state);
    }

    case SegurosGeraisActionTypes.AddSegurosGeraiss: {
      return adapter.addMany(action.payload.segurosGeraiss, state);
    }

    case SegurosGeraisActionTypes.UpsertSegurosGeraiss: {
      return adapter.upsertMany(action.payload.segurosGeraiss, state);
    }

    case SegurosGeraisActionTypes.UpdateSegurosGerais: {
      return adapter.updateOne(action.payload.segurosGerais, state);
    }

    case SegurosGeraisActionTypes.UpdateSegurosGeraiss: {
      return adapter.updateMany(action.payload.segurosGeraiss, state);
    }

    case SegurosGeraisActionTypes.DeleteSegurosGerais: {
      return adapter.removeOne(action.payload.id, state);
    }

    case SegurosGeraisActionTypes.DeleteSegurosGeraiss: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case SegurosGeraisActionTypes.LoadSegurosGeraiss: {
      return adapter.addMany(action.payload.segurosGeraiss, state);
    }

    case SegurosGeraisActionTypes.ClearSegurosGeraiss: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
