import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCadastroFaturamentoComponent } from './modal-cadastrar-faturamento.component';

describe('ModalCadastroFaturamentoComponent', () => {
  let component: ModalCadastroFaturamentoComponent;
  let fixture: ComponentFixture<ModalCadastroFaturamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCadastroFaturamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCadastroFaturamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
