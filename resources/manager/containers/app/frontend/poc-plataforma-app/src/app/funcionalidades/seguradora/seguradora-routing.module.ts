import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContainerSeguradoraComponent} from '@funcionalidades/seguradora/containers/container-seguradora/container-seguradora.component';
import {ContainerFaturamentoComponent} from '@funcionalidades/faturamento/containers/container-faturamento/container-faturamento.component';
import { ContainerRelatoriosComponent } from '@funcionalidades/relatorios/containers/container-relatorios/container-relatorios.component';
import {ContainerDevolucaoComponent} from '@funcionalidades/devolucao/containers/container-devolucao/container-devolucao.component';
import { DashboardSeguradoraComponent } from './components/dashboard-seguradora/dashboard-seguradora.component';
import {
  ContainerRelatorioSeguroTransacoesComponent
} from '@funcionalidades/relatorio-seguro-transacoes/containers/container-relatorio-seguro-transacoes/container-relatorio-seguro-transacoes.component';
import {
  ContainerRelatorioSeguroCelularComponent
} from '@funcionalidades/relatorio-seguro-celular/containers/container-relatorio-seguro-celular/container-relatorio-seguro-celular.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerSeguradoraComponent,
  },
  {
    path: 'faturamento',
    component: ContainerFaturamentoComponent,
    data: {
      breadcrumb: 'Faturamento',
    },
  },
  {
    path: 'devolucao',
    component: ContainerDevolucaoComponent,
    data: {
      breadcrumb: 'Devolução',
    }
  },
  {
    path: 'relatorios',
    component: ContainerRelatoriosComponent,
    data: {
      breadcrumb: 'Relatórios',
    },
  },
  {
    path: 'relatorios-seguro-transacoes',
    component: ContainerRelatorioSeguroTransacoesComponent,
    data: {
      breadcrumb: 'Relatórios',
    },
  },
  {
    path: 'relatorios-seguro-celular',
    component: ContainerRelatorioSeguroCelularComponent,
    data: {
      breadcrumb: 'Relatórios',
    },
  },
  {
    path: 'dashboard-seguradora',
    component: DashboardSeguradoraComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguradoraRoutingModule {
}
