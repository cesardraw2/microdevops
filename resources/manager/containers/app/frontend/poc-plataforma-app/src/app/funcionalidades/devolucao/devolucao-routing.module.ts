import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContainerDevolucaoComponent } from '@funcionalidades/devolucao/containers/container-devolucao/container-devolucao.component';
import { AuthGuard } from '@sicoob/security';

const routes: Routes = [
  {
    path: 'devolucao',
    component: ContainerDevolucaoComponent,
    data: {
      breadcrumb: "Devolução",
    },
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevolucaoRoutingModule { }
