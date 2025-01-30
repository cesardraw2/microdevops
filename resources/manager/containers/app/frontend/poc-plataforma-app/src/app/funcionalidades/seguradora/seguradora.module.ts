import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromSeguradora from './reducers/seguradora.reducer';
import {SeguradoraRoutingModule} from '@funcionalidades/seguradora/seguradora-routing.module';
import { RelatoriosModule } from '@funcionalidades/relatorios/relatorios.module';
import { EffectsModule } from '@ngrx/effects';
import { SeguradoraEffects } from '@funcionalidades/seguradora/effects/seguradora.effects';
import { ContainerSeguradoraComponent } from '@funcionalidades/seguradora/containers/container-seguradora/container-seguradora.component';
import { SeguradoraComponent } from '@funcionalidades/seguradora/components/seguradora/seguradora.component';
import { FaturamentoModule } from '@funcionalidades/faturamento/faturamento.module';
import { DevolucaoModule } from '@funcionalidades/devolucao/devolucao.module';
import { SharedModule } from '@app/shared/shared.module';
import { DashboardSeguradoraComponent } from './components/dashboard-seguradora/dashboard-seguradora.component';

@NgModule({
  declarations: [ContainerSeguradoraComponent, SeguradoraComponent, DashboardSeguradoraComponent],
  imports: [
    CommonModule,
    FaturamentoModule,
    RelatoriosModule,
    SeguradoraRoutingModule,
    SharedModule,
    FaturamentoModule,
    DevolucaoModule,
    StoreModule.forFeature('seguradora', fromSeguradora.reducer),
    EffectsModule.forFeature([SeguradoraEffects])
  ]
})
export class SeguradoraModule { }
