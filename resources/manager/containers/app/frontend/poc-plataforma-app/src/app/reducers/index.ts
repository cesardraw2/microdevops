import * as fromRouter from '@ngrx/router-store';
import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import * as fromAuth from '@sicoob/security';
import * as fromCentralAtendimento from '../funcionalidades/central-atendimento/reducers/central-atendimento.reducer';
import * as fromCentralConfiguracao from '../funcionalidades/central-configuracao/reducers/central-configuracao.reducer';
import * as fromCentralVendas from '../funcionalidades/central-vendas/reducers/central-vendas.reducer';
import * as fromCorretoras from '../funcionalidades/corretoras/reducers/corretoras.reducer';
import * as fromDevolucao from '../funcionalidades/devolucao/reducers/devolucao.reducer';
import * as fromMenuInicial from '../funcionalidades/menu-inicial/reducers/menu-inicial.reducer';
import * as fromRelatorioAuto from '../funcionalidades/relatorio-auto/reducers/relatorio-auto.reducer';
import * as fromRelatorios from '../funcionalidades/relatorios/reducers/relatorios.reducer';
import * as fromSeguradora from '../funcionalidades/seguradora/reducers/seguradora.reducer';
import * as fromSegurosGerais from '../funcionalidades/seguros-gerais/reducers/seguros-gerais.reducer';
import * as fromCapes from '../shared/components/capes/reducers/capes.reducer';




export interface State {
  router: fromRouter.RouterReducerState;
  auth: fromAuth.State;
  relatorios: fromRelatorios.State;
  devolucao: fromDevolucao.State;
  seguradora: fromSeguradora.State;
  relatorioAuto: fromRelatorioAuto.State;
  segurosGerais: fromSegurosGerais.State;
  capesConsulta: fromCapes.State;
  centralVendas: fromCentralVendas.State;
  centralAtendimento: fromCentralAtendimento.State;
  menuInicial: fromMenuInicial.State;
  [fromCentralConfiguracao.centralConfiguracaosFeatureKey]: fromCentralConfiguracao.State;
  corretoras: fromCorretoras.State;



}

export const reducers: ActionReducerMap<State> = {
  router: fromRouter.routerReducer,
  auth: fromAuth.reducer,
  relatorios: fromRelatorios.reducer,
  seguradora: fromSeguradora.reducer,
  devolucao: fromDevolucao.reducer,
  relatorioAuto: fromRelatorioAuto.reducer,
  segurosGerais: fromSegurosGerais.reducer,
  capesConsulta: fromCapes.reducer,
  centralVendas: fromCentralVendas.reducer,
  centralAtendimento: fromCentralAtendimento.reducer,
  menuInicial: fromMenuInicial.reducer,
  [fromCentralConfiguracao.centralConfiguracaosFeatureKey]: fromCentralConfiguracao.reducer,
  corretoras: fromCorretoras.reducer,
};

export const metaReducers: Array<MetaReducer<any, any>> = [fromAuth.localStorageSyncReducer];
