import { ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Router, ActivatedRouteSnapshot, ActivationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Injectable, EventEmitter, Output } from '@angular/core';

export interface Breadcrumb {
  label: string;
  url: string;
}


/**
 * @description
 * Serviço encarregado de capturar o evento de mudança de rota e montar a hierarquia em forma de breadcrumb
 *
 * @see `NavigationEnd`
 * @author Youre Pena youre.fernandez-fornecedores.sicoob.com.br
 *
 * @export
 */
@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  @Output() breadcrumbChanged = new EventEmitter<{ breadcrumbs: Breadcrumb[], title: string }>();

  public breadcrumbs: Breadcrumb[];
  public title: string;
  ROUTE_DATA_BREADCRUMB = 'breadcrumb';

  /**
   * Cria uma instância de BreadcrumbService. E abre um pipe que escuta os eventos de router
   * @param router
   * @param route
   * @memberof BreadcrumbService
   */
  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      //set breadcrumbs
      let root: ActivatedRoute = this.route.root;
      const breadcrumb: Breadcrumb = {label: 'Início', url: '/'};
      this.breadcrumbs = this.getBreadcrumbs(root).filter((breadcrumb: Breadcrumb) => breadcrumb.url !== '/');
      this.breadcrumbs = [breadcrumb].concat(this.breadcrumbs);
      this.title = this.checkTitle();
      this.breadcrumbChanged.emit({ breadcrumbs: this.breadcrumbs, title: this.title });
    });

  }

  private checkTitle = () => this.breadcrumbs.filter(b => b ? b.label !== 'Início' : false).length === 0 ? 'Início' : this.title;

  private getBreadcrumbs(route: ActivatedRoute, url: string = "", breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    let children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }
    for (let child of children) {
      if (!child.snapshot.data.hasOwnProperty(this.ROUTE_DATA_BREADCRUMB) || !child.component ) {
        return this.getBreadcrumbs(child, this.getUrl(child, url), breadcrumbs);
      }
      let routeURL: string = this.getUrl(child)
      url = routeURL ? `${url}/${routeURL}` : `/${url}`;
      let breadcrumb: Breadcrumb = {
        label: child.snapshot.data[this.ROUTE_DATA_BREADCRUMB],
        url: url
      };
      this.title = breadcrumb.label;
      breadcrumbs.push(breadcrumb);
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }

  private getUrl = (child: ActivatedRoute, url?: string) => {
    const path = child.snapshot.url.map(segment => segment.path).join("/")
    return url ? `${url}/${path}` : path;
  }

  /**
   * Altera o título e a rota atual para o valor passado como parâmetro
   * esta função facilita o trabalho com routas dinâmicas.
   * @param route
   * @param name
   */
  public changeBreadcrumb(route: ActivatedRouteSnapshot, name: string) {
    const rootUrl = this.createRootUrl(route);
    const breadcrumb = this.breadcrumbs.find(function (bc) { return bc.url === rootUrl; });
    if (!breadcrumb) { return; }
    breadcrumb.label = name;
    this.breadcrumbChanged.emit({ breadcrumbs: this.breadcrumbs, title: name });
  }

  private createRootUrl(route: ActivatedRouteSnapshot) {
    let url = '';
    let next = route.root;

    while (next.firstChild !== null) {
      next = next.firstChild;
      if (next.routeConfig === null) { continue; }
      if (!next.routeConfig.path) { continue; }
      url += `/${this.createUrl(next)}`;
      if (next === route) { break; }
    }
    return url;
  }

  private createUrl(route: ActivatedRouteSnapshot) {
    return route.url.map(function (s) { return s.toString(); }).join('/');
  }




}
