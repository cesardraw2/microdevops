import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevolucaoRoutingModule } from './devolucao-routing.module';
import { StoreModule } from '@ngrx/store';
import * as fromDevolucao from './reducers/devolucao.reducer';
import { EffectsModule } from '@ngrx/effects';
import { DevolucaoEffects } from './effects/devolucao.effects';
import { ContainerDevolucaoComponent } from '@funcionalidades/devolucao/containers/container-devolucao/container-devolucao.component';
import { DevolucaoComponent } from '@funcionalidades/devolucao/components/devolucao/devolucao.component';
import { FiltroDevolucaoComponent } from '@funcionalidades/devolucao/components/filtro-devolucao/filtro-devolucao.component';
import { SharedModule } from '@app/shared/shared.module';
import { ModalModule, FormModule, ActionbarModule } from '@sicoob/ui';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import { ModalEditarDevolucaoComponent } from './components/modal-editar-devolucao/modal-editar-devolucao.component';
import { ModalAcompanharDevolucaoComponent } from './components/modal-acompanhar-devolucao/modal-acompanhar-devolucao.component';

@NgModule({
  declarations: [ContainerDevolucaoComponent, DevolucaoComponent,  FiltroDevolucaoComponent, ModalEditarDevolucaoComponent, ModalAcompanharDevolucaoComponent],
  imports: [
    CommonModule,
    DevolucaoRoutingModule,
    SharedModule,
    CommonModule,
    ModalModule,
    FormModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    ActionbarModule,
    StoreModule.forFeature('devolucao', fromDevolucao.reducer),
    EffectsModule.forFeature([DevolucaoEffects])
  ],
  entryComponents: [ModalEditarDevolucaoComponent, ModalAcompanharDevolucaoComponent]
})
export class DevolucaoModule { }
