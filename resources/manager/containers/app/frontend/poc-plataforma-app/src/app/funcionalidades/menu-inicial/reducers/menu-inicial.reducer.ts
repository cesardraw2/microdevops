import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { MenuInicial } from '../models/menu-inicial.model';
import { MenuInicialActions, MenuInicialActionTypes } from '../actions/menu-inicial.actions';

export interface State extends EntityState<MenuInicial> {
  // additional entities state properties
}

export const adapter: EntityAdapter<MenuInicial> = createEntityAdapter<MenuInicial>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: MenuInicialActions
): State {
  switch (action.type) {
    case MenuInicialActionTypes.AddMenuInicial: {
      return adapter.addOne(action.payload.menuInicial, state);
    }

    case MenuInicialActionTypes.UpsertMenuInicial: {
      return adapter.upsertOne(action.payload.menuInicial, state);
    }

    case MenuInicialActionTypes.AddMenuInicials: {
      return adapter.addMany(action.payload.menuInicials, state);
    }

    case MenuInicialActionTypes.UpsertMenuInicials: {
      return adapter.upsertMany(action.payload.menuInicials, state);
    }

    case MenuInicialActionTypes.UpdateMenuInicial: {
      return adapter.updateOne(action.payload.menuInicial, state);
    }

    case MenuInicialActionTypes.UpdateMenuInicials: {
      return adapter.updateMany(action.payload.menuInicials, state);
    }

    case MenuInicialActionTypes.DeleteMenuInicial: {
      return adapter.removeOne(action.payload.id, state);
    }

    case MenuInicialActionTypes.DeleteMenuInicials: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case MenuInicialActionTypes.LoadMenuInicials: {
      return adapter.addMany(action.payload.menuInicials, state);
    }

    case MenuInicialActionTypes.ClearMenuInicials: {
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
