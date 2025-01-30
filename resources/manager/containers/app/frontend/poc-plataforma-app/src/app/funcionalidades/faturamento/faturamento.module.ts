import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import * as fromFaturamento from './reducers/faturamento.reducer';
import {EffectsModule} from '@ngrx/effects';
import {FaturamentoEffects} from './effects/faturamento.effects';
import {ContainerFaturamentoComponent} from './containers/container-faturamento/container-faturamento.component';
import {FaturamentoComponent} from './components/faturamento/faturamento.component';

import {ContainerFaturamentoPrestamistaComponent} from './containers/container-faturamento-prestamista/container-faturamento-prestamista.component';
import {SharedModule} from '@shared/shared.module';
import {FormModule, ModalModule} from '@sicoob/ui';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {ModalCadastrarFaturamentoComponent} from '@funcionalidades/faturamento/components/modal/modal-cadastrar-faturamento/modal-cadastrar-faturamento.component';
import {ModalAcompanharFaturamentoComponent} from '@funcionalidades/faturamento/components/modal/modal-acompanhar-faturamento/modal-acompanhar-faturamento.component';
import {NgxPaginationModule} from 'ngx-pagination';



@NgModule({
  declarations: [
    ContainerFaturamentoComponent,
    ContainerFaturamentoPrestamistaComponent,
    FaturamentoComponent,
    ModalCadastrarFaturamentoComponent,
    ModalAcompanharFaturamentoComponent
  ],
  imports: [
    StoreModule.forFeature('faturamento', fromFaturamento.reducer),
    EffectsModule.forFeature([FaturamentoEffects]),
    CommonModule,
    SharedModule,
    FormModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    ModalModule,
    NgxPaginationModule
  ],
  exports: [
    ContainerFaturamentoComponent
  ],
  entryComponents: [
    ModalCadastrarFaturamentoComponent,
    ModalAcompanharFaturamentoComponent

  ]
})
export class FaturamentoModule {
}
