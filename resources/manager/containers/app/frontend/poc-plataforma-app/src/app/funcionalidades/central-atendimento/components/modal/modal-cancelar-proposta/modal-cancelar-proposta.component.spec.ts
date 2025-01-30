import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCancelarPropostaComponent } from './modal-cancelar-proposta.component';

describe('ModalCancelarPropostaComponent', () => {
  let component: ModalCancelarPropostaComponent;
  let fixture: ComponentFixture<ModalCancelarPropostaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCancelarPropostaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCancelarPropostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
