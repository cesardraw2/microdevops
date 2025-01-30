import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SegurosGeraisRoutingModule } from './seguros-gerais-routing.module';
import { StoreModule } from '@ngrx/store';
import * as fromSegurosGerais from './reducers/seguros-gerais.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SegurosGeraisEffects } from './effects/seguros-gerais.effects';
import { ContainerSegurosGeraisComponent } from './containers/container-seguros-gerais/container-seguros-gerais.component';
import { SegurosGeraisComponent } from './components/seguros-gerais/seguros-gerais.component';
import {CardModule} from '@sicoob/ui';
import {SharedModule} from '@shared/shared.module';
import {
  ContainerGestaoSegurosGeraisComponent
} from './containers/container-gestao-seguros-gerais/container-gestao-seguros-gerais.component';
import { DashboardSegurosGeraisComponent } from './components/dashboard-seguros-gerais/dashboard-seguros-gerais.component';

@NgModule({
  declarations: [ContainerSegurosGeraisComponent, ContainerGestaoSegurosGeraisComponent, SegurosGeraisComponent, DashboardSegurosGeraisComponent],
  imports: [
    CommonModule,
    SegurosGeraisRoutingModule,
    StoreModule.forFeature('segurosGerais', fromSegurosGerais.reducer),
    EffectsModule.forFeature([SegurosGeraisEffects]),
    CardModule,
    SharedModule
  ]
})
export class SegurosGeraisModule { }
