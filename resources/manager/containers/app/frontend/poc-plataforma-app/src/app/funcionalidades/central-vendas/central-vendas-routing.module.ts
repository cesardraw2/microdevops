import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CentralVendasComponent } from './components/central-vendas/central-vendas.component';
import { AuthGuard } from '@sicoob/security';
import { ContainerCentralVendasSegurosComponent } from './containers/container-central-vendas-seguros/container-central-vendas-seguros.component';
import { ContainerCentralVendasSeguroVidaComponent } from './containers/container-central-vendas-seguro-vida/container-central-vendas-seguro-vida.component';

const routes: Routes = [
  {
    path: '',
    component: CentralVendasComponent,
    data: {
      breadcrumb: 'Central de Vendas',
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ContainerCentralVendasSeguroVidaComponent,
        data: {
          breadcrumb: 'Sicoob Seguros',
        }
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentralVendasRoutingModule { }
