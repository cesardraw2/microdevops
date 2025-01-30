import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  ContainerSegurosGeraisComponent
} from '@funcionalidades/seguros-gerais/containers/container-seguros-gerais/container-seguros-gerais.component';
import {
  ContainerRelatorioAutoComponent
} from '@funcionalidades/relatorio-auto/containers/container-relatorio-auto/container-relatorio-auto.component';
import {
  ContainerGestaoSegurosGeraisComponent
} from '@funcionalidades/seguros-gerais/containers/container-gestao-seguros-gerais/container-gestao-seguros-gerais.component';
import { DashboardSegurosGeraisComponent } from './components/dashboard-seguros-gerais/dashboard-seguros-gerais.component';
import {
  ContainerRelatorioSeguroTransacoesComponent
} from '@funcionalidades/relatorio-seguro-transacoes/containers/container-relatorio-seguro-transacoes/container-relatorio-seguro-transacoes.component';
import {
  ContainerRelatorioSeguroCelularComponent
} from '@funcionalidades/relatorio-seguro-celular/containers/container-relatorio-seguro-celular/container-relatorio-seguro-celular.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerSegurosGeraisComponent
  },
  {
    path: 'gestao',
    component: ContainerGestaoSegurosGeraisComponent,
    data: {
      breadcrumb: 'Gestão',
    },
  },
  {
    path: 'relatorios',
    component: ContainerRelatorioAutoComponent,
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
    path: 'dashboard-seguros-gerais',
    component: DashboardSegurosGeraisComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SegurosGeraisRoutingModule { }
