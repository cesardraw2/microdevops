import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContainerRelatorioSeguroTransacoesComponent } from './containers/container-relatorio-seguro-transacoes/container-relatorio-seguro-transacoes.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerRelatorioSeguroTransacoesComponent,
    data: {
          breadcrumb: 'relatório',
    },
  },
  {
    path: 'faturamento',
    component: ContainerRelatorioSeguroTransacoesComponent,
    data: {
      breadcrumb: 'vendas seguro transações',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelatorioSeguroTransacoesRoutingModule { }
