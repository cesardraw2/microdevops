import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContainerRelatorioSeguroCelularComponent } from './containers/container-relatorio-seguro-celular/container-relatorio-seguro-celular.component';

const routes: Routes = [
  {
    path: '',//auto-plurianual
    component: ContainerRelatorioSeguroCelularComponent,
    data: {
          breadcrumb: 'relatório',
    },
  },
  {
    path: 'faturamento',
    component: ContainerRelatorioSeguroCelularComponent,
    data: {
      breadcrumb: 'vendas seguro transações',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelatorioSeguroCelularRoutingModule { }
