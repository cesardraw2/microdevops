import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAcompanhaFaturamentoComponent } from './modal-acompanhar-faturamento.component';

describe('ModalAcompanhaFaturamentoComponent', () => {
  let component: ModalAcompanhaFaturamentoComponent;
  let fixture: ComponentFixture<ModalAcompanhaFaturamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAcompanhaFaturamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAcompanhaFaturamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
