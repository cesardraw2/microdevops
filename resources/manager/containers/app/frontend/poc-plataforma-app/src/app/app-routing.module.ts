import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@sicoob/security';
import { TemplateComponent } from './components/template/template.component';
import { HomeComponent } from './components/home/home.component';
import { ForbiddenComponent, NotFoundComponent } from '@sicoob/ui';

const routes: Routes = [
  {
    path: '', // A rota raiz sempre deve existir
    component: TemplateComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        data: {
          breadcrumb: 'Home'
        }
      },
      {
        path: 'central-atendimento',
        loadChildren: () => import('./funcionalidades/central-atendimento/central-atendimento.module').then(m => m.CentralAtendimentoModule),
        canActivate: [AuthGuard],
        data: {
          breadcrumb: 'Central Atendimento'
        }
      },
      {
        path: 'seguros-gerais',
        loadChildren: () => import('./funcionalidades/seguros-gerais/seguros-gerais.module').then(m => m.SegurosGeraisModule),
        // canActivate: [AuthGuard],
        data: {
          breadcrumb: 'Seguros Gerais'
        }
      },
      {
        path: 'seguradora',
        loadChildren: () => import('./funcionalidades/seguradora/seguradora.module').then(m => m.SeguradoraModule),
        canActivate: [AuthGuard],
        data: {
          breadcrumb: 'Seguradora'
        }
      },
      {
        path: 'central-vendas',
        loadChildren: () => import('./funcionalidades/central-vendas/central-vendas.module').then(m => m.CentralVendasModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'central-configuracao',
        loadChildren: () => import('./funcionalidades/central-configuracao/central-configuracao.module').then(m => m.CentralConfiguracaoModule),
        canActivate: [AuthGuard],
      },
    ]
  },

  {
    path: 'forbidden', // Quando o usuário não pode acessar o componente baseado no AuthGuard
    component: ForbiddenComponent
  },
  {
    path: '**', component: NotFoundComponent// Componente apresentado quando a rota não existe
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'corrected' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
