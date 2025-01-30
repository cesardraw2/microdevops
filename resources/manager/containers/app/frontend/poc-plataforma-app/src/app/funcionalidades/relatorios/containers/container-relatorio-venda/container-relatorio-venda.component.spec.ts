import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerRelatorioVendaComponent } from './container-relatorio-venda.component';

describe('ContainerRelatorioVendaComponent', () => {
  let component: ContainerRelatorioVendaComponent;
  let fixture: ComponentFixture<ContainerRelatorioVendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerRelatorioVendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerRelatorioVendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
