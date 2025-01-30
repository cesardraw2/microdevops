import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RelatorioSeguroCelularRoutingModule} from './relatorio-seguro-celular-routing.module';
import {EffectsModule} from '@ngrx/effects';
import {RelatorioSeguroCelularEffects} from './effects/relatorio-seguro-celular.effects';
import {
  ContainerRelatorioSeguroCelularComponent
} from './containers/container-relatorio-seguro-celular/container-relatorio-seguro-celular.component';
import {RelatorioSeguroCelularComponent} from './components/relatorio-seguro-transacoes/relatorio-seguro-celular.component';

import {CardModule, FormModule, LabelModule} from '@sicoob/ui';
import {SharedModule} from '@app/shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [ContainerRelatorioSeguroCelularComponent, RelatorioSeguroCelularComponent],
  imports: [
    NgxPaginationModule,
    CommonModule,
    RelatorioSeguroCelularRoutingModule,
    SharedModule,
    FormModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    TranslateModule,
    LabelModule,
    // StoreModule.forFeature('relatorioAuto', fromRelatorioAuto.reducer),
    EffectsModule.forFeature([RelatorioSeguroCelularEffects])
  ],
  exports: [
    ContainerRelatorioSeguroCelularComponent
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'pt-BR'}
  ],
})
export class RelatorioSeguroCelularModule {
}
