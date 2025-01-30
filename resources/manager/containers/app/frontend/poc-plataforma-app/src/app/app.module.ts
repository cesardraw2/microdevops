import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { ActionbarModule, HeaderActionsContainerModule, HeaderModule } from '@sicoob/ui';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { TemplateComponent } from './components/template/template.component';
import { LoaderInterceptor } from './interceptors/loader.interceptor';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RelatorioSeguroCelularModule } from '@funcionalidades/relatorio-seguro-celular/relatorio-seguro-celular.module';
import { RelatorioSeguroTransacoesModule } from '@funcionalidades/relatorio-seguro-transacoes/relatorio-seguro-transacoes.module';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { CentralVendasModule } from './funcionalidades/central-vendas/central-vendas.module';
import { CorretorasModule } from './funcionalidades/corretoras/corretoras.module';
import { MenuInicialModule } from './funcionalidades/menu-inicial/menu-inicial.module';
import { RelatorioAutoModule } from './funcionalidades/relatorio-auto/relatorio-auto.module';
import { RelatoriosModule } from './funcionalidades/relatorios/relatorios.module';
import { SeguradoraModule } from './funcionalidades/seguradora/seguradora.module';
import { SegurosGeraisModule } from './funcionalidades/seguros-gerais/seguros-gerais.module';


@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    HeaderActionsContainerModule,
    HeaderModule,
    SharedModule,
    ActionbarModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPermissionsModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      animationDuration: 300,
    }),
    NgxSpinnerModule,
    RelatoriosModule,
    RelatorioAutoModule,
    RelatorioSeguroTransacoesModule,
    RelatorioSeguroCelularModule,
    SegurosGeraisModule,
    RelatoriosModule,
    SeguradoraModule,
    CentralVendasModule,
    MenuInicialModule,
    CorretorasModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  exports: [],
  entryComponents: [
  ]
})
export class AppModule {
  constructor(private bsLocaleService: BsLocaleService) {
    this.bsLocaleService.use('pt-br');
  }
 }
