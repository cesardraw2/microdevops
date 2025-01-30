import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContainerRelatorioAutoComponent } from './containers/container-relatorio-auto/container-relatorio-auto.component';

const routes: Routes = [
  {
    path: '',//auto-plurianual
    component: ContainerRelatorioAutoComponent,
    data: {
          breadcrumb: 'Relatório',
    },
  },
  // {
  //   path: 'faturamento',
  //   component: ContainerFaturamentoComponent,
  //   data: {
  //     breadcrumb: 'Faturamento',
  //   },
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelatorioAutoRoutingModule { }
