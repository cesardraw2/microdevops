import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListarProponenteComponent } from './modal-listar-proponente.component';

describe('ModalListarProponenteComponent', () => {
  let component: ModalListarProponenteComponent;
  let fixture: ComponentFixture<ModalListarProponenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalListarProponenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalListarProponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
