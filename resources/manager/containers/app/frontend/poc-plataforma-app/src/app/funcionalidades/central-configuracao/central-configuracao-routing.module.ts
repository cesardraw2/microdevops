import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@sicoob/security';

import { CentralConfiguracaoComponent } from './components/central-configuracao/central-configuracao.component';
import { ConfiguracoesGeraisComponent } from './components/configuracoes-gerais/configuracoes-gerais.component';
import {
  ContainerCentralConfiguracaoComponent,
} from './containers/container-central-configuracao/container-central-configuracao.component';
import {
  ContainerConfiguracoesGeraisComponent,
} from './containers/container-configuracoes-gerais/container-configuracoes-gerais.component';

const routes: Routes = [
  {
    path: '',
    component: CentralConfiguracaoComponent,
    data: {
      breadcrumb: 'Central de Configurações',
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ContainerCentralConfiguracaoComponent,
      },
      {
        path: 'configuracoes-gerais',
        canActivate: [AuthGuard],
        component: ConfiguracoesGeraisComponent,
        data: {
          breadcrumb: 'Configurações Gerais',
        },
        children: [
          {
            path: '',
            canActivate: [AuthGuard],
            component: ContainerConfiguracoesGeraisComponent,
          },
          {
            path: 'corretoras',
            loadChildren: () => import('../corretoras/corretoras.module').then(m => m.CorretorasModule),
            canActivate: [AuthGuard],
          },
        ],
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentralConfiguracaoRoutingModule { }
