import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { CentralConfiguracao } from '../models/central-configuracao.model';

export const loadCentralConfiguracaos = createAction(
  '[CentralConfiguracao/API] Load CentralConfiguracaos', 
  props<{ centralConfiguracaos: CentralConfiguracao[] }>()
);

export const addCentralConfiguracao = createAction(
  '[CentralConfiguracao/API] Add CentralConfiguracao',
  props<{ centralConfiguracao: CentralConfiguracao }>()
);

export const upsertCentralConfiguracao = createAction(
  '[CentralConfiguracao/API] Upsert CentralConfiguracao',
  props<{ centralConfiguracao: CentralConfiguracao }>()
);

export const addCentralConfiguracaos = createAction(
  '[CentralConfiguracao/API] Add CentralConfiguracaos',
  props<{ centralConfiguracaos: CentralConfiguracao[] }>()
);

export const upsertCentralConfiguracaos = createAction(
  '[CentralConfiguracao/API] Upsert CentralConfiguracaos',
  props<{ centralConfiguracaos: CentralConfiguracao[] }>()
);

export const updateCentralConfiguracao = createAction(
  '[CentralConfiguracao/API] Update CentralConfiguracao',
  props<{ centralConfiguracao: Update<CentralConfiguracao> }>()
);

export const updateCentralConfiguracaos = createAction(
  '[CentralConfiguracao/API] Update CentralConfiguracaos',
  props<{ centralConfiguracaos: Update<CentralConfiguracao>[] }>()
);

export const deleteCentralConfiguracao = createAction(
  '[CentralConfiguracao/API] Delete CentralConfiguracao',
  props<{ id: string }>()
);

export const deleteCentralConfiguracaos = createAction(
  '[CentralConfiguracao/API] Delete CentralConfiguracaos',
  props<{ ids: string[] }>()
);

export const clearCentralConfiguracaos = createAction(
  '[CentralConfiguracao/API] Clear CentralConfiguracaos'
);
