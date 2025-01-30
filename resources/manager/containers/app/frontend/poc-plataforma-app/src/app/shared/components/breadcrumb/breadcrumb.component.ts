import { Component, OnInit } from '@angular/core';
import { Breadcrumb, BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'sc-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  public breadcrumbs: Breadcrumb[] = [ {label: 'Início',url: ''} ];
  public title: string = 'Plataforma de Seguros';

  constructor(private breadCrumbService: BreadcrumbService) { }

  ngOnInit() {
    this.breadCrumbService.breadcrumbChanged.subscribe((crumbs:{breadcrumbs: Breadcrumb[], title: string}) => this.onBreadcrumbChange(crumbs));
  }

  private onBreadcrumbChange(crumbs: {breadcrumbs: Breadcrumb[], title: string}) {
    this.breadcrumbs = crumbs.breadcrumbs;
    this.title = crumbs.title;
  }

}
