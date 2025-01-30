import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAcompanharDevolucaoComponent } from './modal-acompanhar-devolucao.component';

describe('ModalAcompanharDevolucaoComponent', () => {
  let component: ModalAcompanharDevolucaoComponent;
  let fixture: ComponentFixture<ModalAcompanharDevolucaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAcompanharDevolucaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAcompanharDevolucaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
