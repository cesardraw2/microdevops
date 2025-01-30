import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '@shared/shared.module';
import { FormModule, ModalModule, TabsModule } from '@sicoob/ui';
import { CentralAtendimentoRoutingModule } from './central-atendimento-routing.module';
import { CentralAtendimentoComponent } from './components/central-atendimento/central-atendimento.component';
import { PropostaDocumentoComponent } from './components/detalhe-proposta/proposta-documento/proposta-documento.component';
import { ModalCancelarPropostaComponent } from './components/modal/modal-cancelar-proposta/modal-cancelar-proposta.component';
import { ContainerCentralAtendimentoComponent } from './containers/container-central-atendimento/container-central-atendimento.component';
import { ContainerConsultaProponenteComponent } from './containers/container-consulta-proponente/container-consulta-proponente.component';
import { ContainerConsultaPropostaComponent } from './containers/container-consulta-proposta/container-consulta-proposta.component';
import { ContainerListaProdutosComponent } from './containers/container-lista-produtos/container-lista-produtos.component';
import { ContainerPropostaDetalheComponent } from './containers/container-proposta-detalhe/container-proposta-detalhe.component';
import { CentralAtendimentoEffects } from './effects/central-atendimento.effects';
import * as fromCentralAtendimento from './reducers/central-atendimento.reducer';


@NgModule({
  declarations: [CentralAtendimentoComponent, PropostaDocumentoComponent, ModalCancelarPropostaComponent,
    ContainerCentralAtendimentoComponent, ContainerConsultaPropostaComponent, ContainerPropostaDetalheComponent, ContainerConsultaProponenteComponent,
    ContainerListaProdutosComponent],
  imports: [
    CommonModule,
    TabsModule,
    CentralAtendimentoRoutingModule,
    SharedModule,
    FormModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forFeature('centralAtendimento', fromCentralAtendimento.reducer),
    EffectsModule.forFeature([CentralAtendimentoEffects]),
    ModalModule
  ],
  exports: [
    ModalModule
  ],
  entryComponents: [
    ModalCancelarPropostaComponent
  ],
  providers: [DatePipe]
})
export class CentralAtendimentoModule { }
