/*
   Pasta de configuração dos módulos necessários para a aplicação
*/
import { NgModule, Optional, SkipSelf, LOCALE_ID } from '@angular/core';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from '@reducers/index';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from '@app/app.effects';
import { AuthModule } from '@sicoob/security';
import { InfraModule, } from '@sicoob/infra';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '@app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '@env/environment';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ServiceWorkerModule } from '@angular/service-worker';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


registerLocaleData(localePt);

import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { HeaderModule, HeaderActionsContainerModule, SidebarContainerModule, ActionbarModule, FormModule } from '@sicoob/ui';

export const createTranslateLoader = (http: HttpClient) => {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

// Este é um jwt para o nodejs/websphere
const mockBackendJwt = 'eyJhbGciOiJSUzI1NiJ9.eyJ1c3VhcmlvIjoiZXlKeVpYTjFiSFJoWkc4aU9uc2lhV1FpT2lKblpXRnljV013TXpBd1h6QXdJaXdpYVdSSmJuTjBhWFIxYVdOaGIwOXlhV2RsYlNJNk1pd2lhV1JWYm1sa1lXUmxTVzV6ZEU5eWFXZGxiU0k2TUN3aWJuVnRaWEp2UTI5dmNHVnlZWFJwZG1FaU9qTXlNVE1zSW01MWJXVnliME52YjNCbGNtRjBhWFpoVDNKcFoyVnRJam96TURBc0ltUmxjMk55YVdOaGJ5STZJbFZUVlVGU1NVOGdRMDlTVUU5U1FWUkpWazhnUkVFZ1IwVkJVbEVpTENKamNHWWlPaUkyTWpZMk16VXlNamN6TWlJc0ltbGtTVzV6ZEdsMGRXbGpZVzhpT2pJeU5Dd2lhV1JWYm1sa1lXUmxTVzV6ZEdsMGRXbGpZVzhpT2pFc0ltNTFiV1Z5YjFCaFl5STZNU3dpWlcxaGFXd2lPaUpoWjI1bGJHbDBieTVqWVc1blpYSmhibUZBYzJsamIyOWlMbU52YlM1aWNpSjlmUT09IiwiYXBsaWNhY2FvIjoiWTJGaCJ9.KMDswI5-JPBtPINuFb0K6xQTat1V0KVRjC8Ej5iWd4QN0VWxhg60FgCGTZVo6ttYqxu2a_kSF8qHepaHGtsa0A0L9n99ohR3dWRCa8iillvkcpH-gzSKEFcPFtPEmlJGqumBH9Qc8LeXSFXEWp-h4e07DTbhTFgGlyeKVq6KOo0';

@NgModule({
  imports: [
    ActionbarModule,
    FormModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PortalModule,
    OverlayModule,
    HeaderModule,
    HeaderActionsContainerModule,
    SidebarContainerModule,
    // Angular Forms
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    BrowserAnimationsModule,

    // Angular Forms
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),

    StoreModule.forRoot(
      reducers, { metaReducers }
    ),

    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
    }),
    !environment.PRODUCTION ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([AppEffects]),
    NgxPermissionsModule.forRoot(),
    // Para mais detalhes acesse:
    // tslint:disable-next-line: max-line-length
    // http://storybook.sicoob.com.br//?selectedKind=4%20DEV%20LIBRARIES%7CAngular&selectedStory=%40sicoob%2Fsecurity&full=0&addons=0&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel
    AuthModule.forRoot({
      isProduction: environment.PRODUCTION,
      apiGateway: environment.API_GATEWAY,
      authGateway: environment.AUTH_GATEWAY,
      ssoGateway: environment.SSO_GATEWAY,
      applicationToken: environment.APPLICATION_TOKEN,
      revokeGateway: environment.REVOKE_GATEWAY,
      ctaForm: 'MDISGRPLATAFORMA',   
      mockJwt: environment.AMBIENTE === 'dev' ? mockBackendJwt : null,
    }),
    InfraModule.forRoot({
      apiGateway: environment.REST_URL,
      isProduction: environment.PRODUCTION,
      ambiente: environment.AMBIENTE,
      ctaForm: 'MDISGRPLATAFORMA',   
      apiDev: '/sicoob-relatorio/v1',
      reportConfig: {
        itemsPerPage: 10
      }
    }),

    ServiceWorkerModule.register(
      'ngsw-worker.js',
      { enabled: environment.PRODUCTION }
    )
  ],
  declarations: [],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },
  ],
  exports: [
    TranslateModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // Angular Forms
    FormsModule,
    ReactiveFormsModule,
    AuthModule,
    InfraModule,
    NgxPermissionsModule,
    ServiceWorkerModule,
    HeaderModule,
    HeaderActionsContainerModule,
    SidebarContainerModule,
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
