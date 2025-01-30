import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ModalModule } from '@sicoob/ui';
import { MenuInicialComponent } from './components/menu-inicial/menu-inicial.component';
import { QueroGerenciarComponent } from './components/quero-gerenciar/quero-gerenciar.component';
import { QueroVenderComponent } from './components/quero-vender/quero-vender.component';
import { PopupBannerComponent } from './containers/component-popup-banner/popup-banner.component';
import { ContainerMenuInicialComponent } from './containers/container-menu-inicial/container-menu-inicial.component';
import { MenuInicialEffects } from './effects/menu-inicial.effects';
import { MenuInicialRoutingModule } from './menu-inicial-routing.module';
import * as fromMenuInicial from './reducers/menu-inicial.reducer';

@NgModule({
  declarations: [ContainerMenuInicialComponent, MenuInicialComponent, QueroGerenciarComponent, QueroVenderComponent, PopupBannerComponent],
  imports: [
    CommonModule,
    MenuInicialRoutingModule,
    StoreModule.forFeature('menuInicial', fromMenuInicial.reducer),
    EffectsModule.forFeature([MenuInicialEffects]),
    SharedModule,
    ModalModule
  ],
  exports: [
    ContainerMenuInicialComponent
  ]
})
export class MenuInicialModule { }
