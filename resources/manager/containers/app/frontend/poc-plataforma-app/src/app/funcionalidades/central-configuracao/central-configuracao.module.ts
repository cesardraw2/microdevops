import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CentralConfiguracaoRoutingModule } from './central-configuracao-routing.module';
import { StoreModule } from '@ngrx/store';
import * as fromCentralConfiguracao from './reducers/central-configuracao.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CentralConfiguracaoEffects } from './effects/central-configuracao.effects';
import { ContainerCentralConfiguracaoComponent } from './containers/container-central-configuracao/container-central-configuracao.component';
import { CentralConfiguracaoComponent } from './components/central-configuracao/central-configuracao.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '@sicoob/ui';
import { SharedModule } from '@app/shared/shared.module';
import { ContainerConfiguracoesGeraisComponent } from './containers/container-configuracoes-gerais/container-configuracoes-gerais.component';
import { ConfiguracoesGeraisComponent } from './components/configuracoes-gerais/configuracoes-gerais.component';


@NgModule({
  declarations: [ContainerCentralConfiguracaoComponent, CentralConfiguracaoComponent, ContainerConfiguracoesGeraisComponent, ConfiguracoesGeraisComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormModule,
    ReactiveFormsModule,
    FormsModule,
    CentralConfiguracaoRoutingModule,
    StoreModule.forFeature(fromCentralConfiguracao.centralConfiguracaosFeatureKey, fromCentralConfiguracao.reducer),
    EffectsModule.forFeature([CentralConfiguracaoEffects])
  ],
  exports: [
    ContainerCentralConfiguracaoComponent
  ]
})
export class CentralConfiguracaoModule { }
