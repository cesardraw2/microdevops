import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CentralConfiguracao } from '../models/central-configuracao.model';
import * as CentralConfiguracaoActions from '../actions/central-configuracao.actions';

export const centralConfiguracaosFeatureKey = 'centralConfiguracaos';

export interface State extends EntityState<CentralConfiguracao> {
  // additional entities state properties
}

export const adapter: EntityAdapter<CentralConfiguracao> = createEntityAdapter<CentralConfiguracao>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});


export const reducer = createReducer(
  initialState,
  on(CentralConfiguracaoActions.addCentralConfiguracao,
    (state, action) => adapter.addOne(action.centralConfiguracao, state)
  ),
  on(CentralConfiguracaoActions.upsertCentralConfiguracao,
    (state, action) => adapter.upsertOne(action.centralConfiguracao, state)
  ),
  on(CentralConfiguracaoActions.addCentralConfiguracaos,
    (state, action) => adapter.addMany(action.centralConfiguracaos, state)
  ),
  on(CentralConfiguracaoActions.upsertCentralConfiguracaos,
    (state, action) => adapter.upsertMany(action.centralConfiguracaos, state)
  ),
  on(CentralConfiguracaoActions.updateCentralConfiguracao,
    (state, action) => adapter.updateOne(action.centralConfiguracao, state)
  ),
  on(CentralConfiguracaoActions.updateCentralConfiguracaos,
    (state, action) => adapter.updateMany(action.centralConfiguracaos, state)
  ),
  on(CentralConfiguracaoActions.deleteCentralConfiguracao,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(CentralConfiguracaoActions.deleteCentralConfiguracaos,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(CentralConfiguracaoActions.loadCentralConfiguracaos,
    (state, action) => adapter.setAll(action.centralConfiguracaos, state)
  ),
  on(CentralConfiguracaoActions.clearCentralConfiguracaos,
    state => adapter.removeAll(state)
  ),
);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
