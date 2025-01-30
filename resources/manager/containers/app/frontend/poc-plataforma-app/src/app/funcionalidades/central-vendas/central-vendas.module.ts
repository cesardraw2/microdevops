import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CentralVendasRoutingModule } from './central-vendas-routing.module';
import { StoreModule } from '@ngrx/store';
import * as fromCentralVendas from './reducers/central-vendas.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CentralVendasEffects } from './effects/central-vendas.effects';
import { ContainerCentralVendasComponent } from './containers/container-central-vendas/container-central-vendas.component';
import { CentralVendasComponent } from './components/central-vendas/central-vendas.component';
import { ContainerCentralVendasSegurosComponent } from './containers/container-central-vendas-seguros/container-central-vendas-seguros.component';
import {SharedModule} from '@shared/shared.module';
import { FormModule, ModalModule } from '@sicoob/ui';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContainerCentralVendasSeguroVidaComponent } from './containers/container-central-vendas-seguro-vida/container-central-vendas-seguro-vida.component';
import { TipoSeguroComponent } from './components/tipo-seguro/tipo-seguro.component';

@NgModule({
  declarations: [ContainerCentralVendasComponent, CentralVendasComponent, ContainerCentralVendasSegurosComponent,
    ContainerCentralVendasSeguroVidaComponent,
    TipoSeguroComponent
    ],
  imports: [
    CommonModule,
    CentralVendasRoutingModule,
    SharedModule,
    FormModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forFeature('centralVendas', fromCentralVendas.reducer),
    EffectsModule.forFeature([CentralVendasEffects]),
    ModalModule
  ],
  exports: [
    ContainerCentralVendasSeguroVidaComponent
  ],
  entryComponents: [
    
  ]
})
export class CentralVendasModule { }
