import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSeguradoraComponent } from './dashboard-seguradora.component';

describe('DashboardSeguradoraComponent', () => {
  let component: DashboardSeguradoraComponent;
  let fixture: ComponentFixture<DashboardSeguradoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardSeguradoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSeguradoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
