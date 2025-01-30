import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSegurosGeraisComponent } from './dashboard-seguros-gerais.component';

describe('DashboardSegurosGeraisComponent', () => {
  let component: DashboardSegurosGeraisComponent;
  let fixture: ComponentFixture<DashboardSegurosGeraisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardSegurosGeraisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSegurosGeraisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
