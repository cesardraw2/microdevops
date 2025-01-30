import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ConfigMenuEnum, HOME_ITENS_MENU, RELATORIO_ITENS_MENU, RouterSeguros, CENTRAL_VENDAS_ITENS_MENU, DASHBOARD_SEGURADORA, DASHBOARD_SEGUROS_GERAIS } from '@app/shared/enum/config.menu';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as fromAuth from '@sicoob/security';
import { Logout, UsuarioSicoob } from '@sicoob/security';
import { NavItem, SidebarContainerComponent, ToolbarItem } from '@sicoob/ui';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { version } from '../../../../package.json';



@Component({
  selector: 'sc-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {

  @ViewChild(SidebarContainerComponent)
  sidebarContainerComponent: SidebarContainerComponent;
  
  @ViewChild('menuSgr') menuSgr: any;
  
  version: string = version;
  itensInvisiveisMenuSub = new Subject<string[]>();
  itensInvisiveisMenuOb: Observable<string[]> = new Observable();

  /**
   * Estrutura para adicionar um item para o navbar
   */
  itemsNavbar: NavItem[] = [
    { displayName: 'Notificações', iconName: 'mail', disabled: true },
  ];

  /**
   * Informações do usuário logado
   */
  user$: Observable<UsuarioSicoob> = of({} as any);

  constructor(
    public translate: TranslateService,
    private bsLocaleService: BsLocaleService,
    public authStore$: Store<fromAuth.State>,
    private store: Store<any>,
    private router: Router
  ) {
    this.configureTranslate();
  }
  
  // Ao iniciar o angular busca o usuário
  ngOnInit() {
    // Seleciona o usuário da store de autenticação
    this.user$ = this.authStore$.pipe(select(fromAuth.selectSicoobUser));
    this.verificarItensMenu();
  }
  
  ngAfterViewInit() {
    this.menuSgr.except = HOME_ITENS_MENU;
    this.montarItensToolbar();
  }

  verificarItensMenu() {
    this.router.events.subscribe((val: NavigationStart) => {
      if (val.url) {
        if (RouterSeguros.CENTRAL_VENDAS.toString() == val.url) {
            this.menuSgr.except = CENTRAL_VENDAS_ITENS_MENU;
          } else if (RouterSeguros.HOME.toString()== val.url) {
            this.menuSgr.except = HOME_ITENS_MENU;
          } else if (RouterSeguros.DASHBOARD_SEGURADORA.toString() == val.url) {
            this.menuSgr.except = DASHBOARD_SEGURADORA
          } else if (RouterSeguros.DASHBOARD_SEGUROS_GERAIS.toString() == val.url) {
            this.menuSgr.except = DASHBOARD_SEGUROS_GERAIS
          }
        this.montarItensToolbar();
      }
    })
  }


  montarItensToolbar() {
    this.menuSgr.itemsToolbar$ = this.store.pipe(
      select(fromAuth.selectToolbarItems),
      map( (t: ToolbarItem[]) => this.menuSgr.filterToolbar(t))
    );
  }

  // Cria as configurações de idioma
  configureTranslate() {
    // O português brasileiro agora possui o id 'pt' e não mais 'pt-BR'
    // Veja: https://angular.io/guide/i18n
    const browserLang = this.translate.getBrowserLang();
    this.translate.setDefaultLang('pt');
    this.changeLang(browserLang);
  }

  // Remove as permissões de acesso e redireciona para o CAS remover os cookies.
  logout() {
    this.authStore$.dispatch(new Logout());
  }

  onItemClick($event) {
  }

  changeLang(lang: string) {
    this.translate.use(lang);
    this.bsLocaleService.use(lang);
  }

  isClosed(): Observable<boolean> {
    return this.sidebarContainerComponent?.isClosed$ ?? of(true);
  }
}
