import { CentralAtendimentoComponent } from './components/central-atendimento/central-atendimento.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@sicoob/security';
import { ContainerConsultaProponenteComponent } from './containers/container-consulta-proponente/container-consulta-proponente.component';
import { ContainerConsultaPropostaComponent } from './containers/container-consulta-proposta/container-consulta-proposta.component';
import { ContainerPropostaDetalheComponent } from './containers/container-proposta-detalhe/container-proposta-detalhe.component';
import { ContainerListaProdutosComponent } from './containers/container-lista-produtos/container-lista-produtos.component';

const routes: Routes = [
  {
    path: '',
    component: CentralAtendimentoComponent,
    data: {
      breadcrumb: 'Central de Atendimento',
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ContainerConsultaProponenteComponent,
        data: {
          breadcrumb: 'Consultar Proposta',
        },
      }, 
      {
        path: 'consulta-proposta-sve',
        canActivate: [AuthGuard],
        component: ContainerConsultaPropostaComponent,
        data: {
          breadcrumb: 'Consultar Proposta',
        },
      }, 
      {
        path: 'detalha-proposta/:idproposta',
        canActivate: [AuthGuard],
        component: ContainerPropostaDetalheComponent,
        data: {
          breadcrumb: 'Detalhar Proposta',
        }
      },
      {
        path: 'lista-produtos',
        canActivate: [AuthGuard],
        component: ContainerListaProdutosComponent,
        data: {
          breadcrumb: 'Vitrine de produtos',
        }
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentralAtendimentoRoutingModule { }
