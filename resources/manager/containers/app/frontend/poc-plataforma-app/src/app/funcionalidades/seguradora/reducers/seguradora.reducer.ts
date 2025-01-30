import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Seguradora } from '../models/seguradora.model';
import { SeguradoraActions, SeguradoraActionTypes } from '../actions/seguradora.actions';

export interface State extends EntityState<Seguradora> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Seguradora> = createEntityAdapter<Seguradora>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: SeguradoraActions
): State {
  switch (action.type) {
    case SeguradoraActionTypes.AddSeguradora: {
      return adapter.addOne(action.payload.seguradora, state);
    }

    case SeguradoraActionTypes.UpsertSeguradora: {
      return adapter.upsertOne(action.payload.seguradora, state);
    }

    case SeguradoraActionTypes.AddSeguradoras: {
      return adapter.addMany(action.payload.seguradoras, state);
    }

    case SeguradoraActionTypes.UpsertSeguradoras: {
      return adapter.upsertMany(action.payload.seguradoras, state);
    }

    case SeguradoraActionTypes.UpdateSeguradora: {
      return adapter.updateOne(action.payload.seguradora, state);
    }

    case SeguradoraActionTypes.UpdateSeguradoras: {
      return adapter.updateMany(action.payload.seguradoras, state);
    }

    case SeguradoraActionTypes.DeleteSeguradora: {
      return adapter.removeOne(action.payload.id, state);
    }

    case SeguradoraActionTypes.DeleteSeguradoras: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case SeguradoraActionTypes.LoadSeguradoras: {
      return adapter.addMany(action.payload.seguradoras, state);
    }

    case SeguradoraActionTypes.ClearSeguradoras: {
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
