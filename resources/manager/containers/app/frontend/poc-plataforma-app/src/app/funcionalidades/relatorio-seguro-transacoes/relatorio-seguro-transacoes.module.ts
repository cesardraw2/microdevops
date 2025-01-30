import {LOCALE_ID, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelatorioSeguroTransacoesRoutingModule } from './relatorio-seguro-transacoes-routing.module';
import { StoreModule } from '@ngrx/store';
import * as fromRelatorioAuto from './reducers/relatorio-seguro-transacoes.reducer';
import { EffectsModule } from '@ngrx/effects';
import { RelatorioSeguroTransacoesEffects } from './effects/relatorio-seguro-transacoes.effects';
import { ContainerRelatorioSeguroTransacoesComponent } from './containers/container-relatorio-seguro-transacoes/container-relatorio-seguro-transacoes.component';
import { RelatorioSeguroTransacoesComponent } from './components/relatorio-seguro-transacoes/relatorio-seguro-transacoes.component';

import {CardModule, FormModule, LabelModule} from '@sicoob/ui';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [ContainerRelatorioSeguroTransacoesComponent, RelatorioSeguroTransacoesComponent],
  imports: [
    NgxPaginationModule,
    CommonModule,
    RelatorioSeguroTransacoesRoutingModule,
    SharedModule,
    FormModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    TranslateModule,
    LabelModule,
    // StoreModule.forFeature('relatorioAuto', fromRelatorioAuto.reducer),
    EffectsModule.forFeature([RelatorioSeguroTransacoesEffects])
  ],
  exports: [
    ContainerRelatorioSeguroTransacoesComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
})
export class RelatorioSeguroTransacoesModule { }
