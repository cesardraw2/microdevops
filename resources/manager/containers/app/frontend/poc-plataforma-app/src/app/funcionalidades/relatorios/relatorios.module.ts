import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';

import { RelatoriosRoutingModule } from './relatorios-routing.module';
import { StoreModule } from '@ngrx/store';
import * as fromRelatorios from './reducers/relatorios.reducer';
import { EffectsModule } from '@ngrx/effects';
import { RelatoriosEffects } from './effects/relatorios.effects';
import { ContainerRelatoriosComponent } from './containers/container-relatorios/container-relatorios.component';
import { RelatoriosComponent } from './components/relatorios/relatorios.component';
import { SharedModule } from '@app/shared/shared.module';
import { FormModule, LabelModule } from '@sicoob/ui';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ContainerRelatorioVendaComponent } from './containers/container-relatorio-venda/container-relatorio-venda.component';
import { ContainerRelatorioPropostaComponent } from './containers/container-relatorio-proposta/container-relatorio-proposta.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { ModalMotivoRelatorioComponent } from './components/modal-motivo-relatorio/modal-motivo-relatorio.component';
import { LOCALE_ID } from '@angular/core';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

@NgModule({
  declarations: [ContainerRelatoriosComponent, RelatoriosComponent, ContainerRelatorioVendaComponent,
                 ContainerRelatorioPropostaComponent,
                 ModalMotivoRelatorioComponent],
  imports: [
    NgxPaginationModule,
    CommonModule,
    RelatoriosRoutingModule,
    SharedModule,
    FormModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    LabelModule,
    StoreModule.forFeature('relatorios', fromRelatorios.reducer),
    EffectsModule.forFeature([RelatoriosEffects])
  ],
  entryComponents: [ModalMotivoRelatorioComponent],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
})
export class RelatoriosModule { }
