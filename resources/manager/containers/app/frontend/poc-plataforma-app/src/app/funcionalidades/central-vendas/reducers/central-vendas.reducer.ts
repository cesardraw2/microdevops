import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CentralVendas } from '../models/central-vendas.model';
import { CentralVendasActions, CentralVendasActionTypes } from '../actions/central-vendas.actions';

export interface State extends EntityState<CentralVendas> {
  // additional entities state properties
}

export const adapter: EntityAdapter<CentralVendas> = createEntityAdapter<CentralVendas>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: CentralVendasActions
): State {
  switch (action.type) {
    case CentralVendasActionTypes.AddCentralVendas: {
      return adapter.addOne(action.payload.centralVendas, state);
    }

    case CentralVendasActionTypes.UpsertCentralVendas: {
      return adapter.upsertOne(action.payload.centralVendas, state);
    }

    case CentralVendasActionTypes.AddCentralVendass: {
      return adapter.addMany(action.payload.centralVendass, state);
    }

    case CentralVendasActionTypes.UpsertCentralVendass: {
      return adapter.upsertMany(action.payload.centralVendass, state);
    }

    case CentralVendasActionTypes.UpdateCentralVendas: {
      return adapter.updateOne(action.payload.centralVendas, state);
    }

    case CentralVendasActionTypes.UpdateCentralVendass: {
      return adapter.updateMany(action.payload.centralVendass, state);
    }

    case CentralVendasActionTypes.DeleteCentralVendas: {
      return adapter.removeOne(action.payload.id, state);
    }

    case CentralVendasActionTypes.DeleteCentralVendass: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case CentralVendasActionTypes.LoadCentralVendass: {
      return adapter.addMany(action.payload.centralVendass, state);
    }

    case CentralVendasActionTypes.ClearCentralVendass: {
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
