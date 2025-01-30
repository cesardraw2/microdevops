import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerFaturamentoPrestamistaComponent } from './container-faturamento-prestamista.component';

describe('ContainerFaturamentoPrestamistaComponent', () => {
  let component: ContainerFaturamentoPrestamistaComponent;
  let fixture: ComponentFixture<ContainerFaturamentoPrestamistaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerFaturamentoPrestamistaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerFaturamentoPrestamistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
