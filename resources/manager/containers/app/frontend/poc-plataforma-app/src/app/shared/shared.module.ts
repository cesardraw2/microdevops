/**
 * @description Arquivo para declaração de módulos compartilhados na aplicação
 * @author gilluan.sousa <gilluan.sousa@sicoob.com.br>
 *
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BotaoFuncionalidadeComponent } from '@app/components/botao-funcionalidade/botao-funcionalidade.component';
import { CabecalhoSeguradoraComponent } from '@app/components/cabecalho-seguradora/cabecalho-seguradora.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  ActionbarModule,
  ButtonModule,
  CardModule,
  FormModule,
  LabelModule,
  ModalModule,
  NavbarModule,
  PaginationModule,
  SidebarContainerModule,
  TabsModule,
  ToolbarModule,
  UiModule
} from '@sicoob/ui';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CapesFiltroComponent } from './components/capes-filtro/capes-filtro.component';
import { ModalListarProponenteComponent } from './components/capes-filtro/modal/modal-listar-proponente/modal-listar-proponente.component';
import { CapesComponent } from './components/capes/capes.component';
import { CapesEffects } from './components/capes/effects/capes.effects';
import * as fromCapes from './components/capes/reducers/capes.reducer';
import { DialogoConfirmacaoComponent } from './components/dialogo-confirmacao/dialogo-confirmacao.component';
import { DialogoSucessoComponent } from './components/dialogo-sucesso/dialogo-sucesso.component';
import { InstituicaoComponent } from './components/instituicao/instituicao.component';
import { ModalValidacaoComponent } from './components/modal-validacao/modal-validacao.component';
import { MsgErroComponent } from './components/msg-erro/msg-erro.component';
import { PerfilImgComponent } from './components/perfil-img/perfil-img.component';
import { TipoSeguroCardComponent } from './components/tipo-seguro-card/tipo-seguro-card.component';
import { CpfCnpjPipe } from './pipes/cpf-ou-cnpj.pipe';
import { EnumPipe } from './pipes/enums.pipe';


@NgModule({
  imports: [
    UiModule,
    NgxDatatableModule,
    TabsModule,
    NavbarModule,
    ToolbarModule,
    ButtonModule,
    TranslateModule,
    LabelModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormModule,
    ModalModule,
    ActionbarModule,
    NgSelectModule,
    ModalModule,
    CardModule,
    RouterModule,
    SidebarContainerModule,
    BsDatepickerModule.forRoot(),
    StoreModule.forFeature('capes', fromCapes.reducer),
    EffectsModule.forFeature([CapesEffects]),
    PaginationModule
  ],
  exports: [
    NgxPermissionsModule,
    TabsModule,
    UiModule,
    ButtonModule,
    NavbarModule,
    ToolbarModule,
    ButtonModule,
    TranslateModule,
    LabelModule,
    CommonModule,
    FormsModule,
    FormModule,
    ActionbarModule,
    ModalModule,
    CardModule,
    MsgErroComponent,
    BsDatepickerModule,
    CapesComponent,
    InstituicaoComponent,
    PerfilImgComponent,
    BotaoFuncionalidadeComponent,
    SidebarContainerModule,
    EnumPipe,
    NgSelectModule,
    CabecalhoSeguradoraComponent,
    TipoSeguroCardComponent,
    CpfCnpjPipe,
    CapesFiltroComponent
  ],
  declarations: [
    CapesComponent,
    MsgErroComponent,
    InstituicaoComponent,
    DialogoConfirmacaoComponent,
    DialogoSucessoComponent,
    PerfilImgComponent,
    BotaoFuncionalidadeComponent,
    CabecalhoSeguradoraComponent,
    ModalValidacaoComponent,
    CabecalhoSeguradoraComponent,
    EnumPipe,
    TipoSeguroCardComponent,
    CpfCnpjPipe,
    CapesFiltroComponent,
    ModalListarProponenteComponent

  ],
  entryComponents: [
    DialogoConfirmacaoComponent,
    ModalValidacaoComponent,
    ModalListarProponenteComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {
  constructor(private bsLocaleService: BsLocaleService) {
    ptBrLocale.invalidDate = 'Data Inválida';
    defineLocale('pt', ptBrLocale);
    this.bsLocaleService.use('pt-br');
  }
 }
