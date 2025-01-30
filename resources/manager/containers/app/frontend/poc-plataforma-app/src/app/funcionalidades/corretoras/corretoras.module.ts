import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ActionbarModule, ButtonModule, CardModule, FormModule, ModalModule, UiModule } from '@sicoob/ui';
import { NgxPaginationModule } from 'ngx-pagination';

import { NumberDirective } from '@app/shared/directive/numbers.directive';
import { SharedModule } from '@app/shared/shared.module';
import * as fromInstituicao from '@sicoob/lib-seguros';
import { ListaCorretorasComponent } from './components/lista-corretoras/lista-corretoras.component';
import { ModalExclusaoCentralComponent } from './components/modal-exclusao-central/modal-exclusao-central.component';
import { ModalInclusaoVinculoComponent } from './components/modal-inclusao-vinculo/modal-inclusao-vinculo.component';
import { ModalNomeCorretoraComponent } from './components/modal-nome-corretora/modal-nome-corretora.component';
import {
  ContainerListaCorretorasComponent,
} from './containers/container-lista-corretoras/container-lista-corretoras.component';
import { CorretorasRoutingModule } from './corretoras-routing.module';
import { CorretorasEffects } from './effects/corretoras.effects';
import * as fromCorretoras from './reducers/corretoras.reducer';

@NgModule({
  declarations: [ContainerListaCorretorasComponent, ListaCorretorasComponent, ModalExclusaoCentralComponent, ModalInclusaoVinculoComponent, ModalNomeCorretoraComponent, NumberDirective],
  imports: [
    CommonModule,
    CorretorasRoutingModule,
    CardModule,
    FormModule,
    ReactiveFormsModule,
    FormsModule,
    UiModule,
    ActionbarModule,
    ButtonModule,
    TranslateModule,
    ModalModule,
    NgxPaginationModule,
    StoreModule.forFeature('corretoras', fromCorretoras.reducer),
    StoreModule.forFeature('instituicaoConsultas', fromInstituicao.reducerInstituicaoLibSeguros),
    EffectsModule.forFeature([CorretorasEffects]),
    SharedModule
  ],
  entryComponents: [
    ModalExclusaoCentralComponent,
    ModalInclusaoVinculoComponent,
    ModalNomeCorretoraComponent
  ],
})
export class CorretorasModule { }
