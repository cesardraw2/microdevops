import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@sicoob/security';

import { ListaCorretorasComponent } from './components/lista-corretoras/lista-corretoras.component';
import {
  ContainerListaCorretorasComponent,
} from './containers/container-lista-corretoras/container-lista-corretoras.component';

const routes: Routes = [
  {
    path: '',
    component: ListaCorretorasComponent,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ContainerListaCorretorasComponent,
        data: {
          breadcrumb: 'Corretoras',
        }
      }
    ],

  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorretorasRoutingModule { }
