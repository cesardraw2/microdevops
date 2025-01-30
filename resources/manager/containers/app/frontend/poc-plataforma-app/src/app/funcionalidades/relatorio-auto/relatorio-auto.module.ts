import {LOCALE_ID, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelatorioAutoRoutingModule } from './relatorio-auto-routing.module';
import { StoreModule } from '@ngrx/store';
import * as fromRelatorioAuto from './reducers/relatorio-auto.reducer';
import { EffectsModule } from '@ngrx/effects';
import { RelatorioAutoEffects } from './effects/relatorio-auto.effects';
import { ContainerRelatorioAutoComponent } from './containers/container-relatorio-auto/container-relatorio-auto.component';
import { RelatorioAutoComponent } from './components/relatorio-auto/relatorio-auto.component';

import {CardModule, FormModule, LabelModule} from '@sicoob/ui';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [ContainerRelatorioAutoComponent, RelatorioAutoComponent],
  imports: [
    NgxPaginationModule,
    CommonModule,
    RelatorioAutoRoutingModule,
    SharedModule,
    FormModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    TranslateModule,
    LabelModule,
    StoreModule.forFeature('relatorioAuto', fromRelatorioAuto.reducer),
    EffectsModule.forFeature([RelatorioAutoEffects])
  ],
  exports: [
    ContainerRelatorioAutoComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
})
export class RelatorioAutoModule { }
