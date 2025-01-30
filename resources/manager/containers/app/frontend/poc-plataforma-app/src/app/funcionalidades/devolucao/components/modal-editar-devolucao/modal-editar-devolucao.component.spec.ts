import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarDevolucaoComponent } from './modal-editar-devolucao.component';

describe('ModalEditarDevolucaoComponent', () => {
  let component: ModalEditarDevolucaoComponent;
  let fixture: ComponentFixture<ModalEditarDevolucaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditarDevolucaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditarDevolucaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
