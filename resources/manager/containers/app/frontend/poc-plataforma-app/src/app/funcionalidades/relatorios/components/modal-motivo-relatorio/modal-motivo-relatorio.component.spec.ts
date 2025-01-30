import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMotivoRelatorioComponent } from './modal-motivo-relatorio.component';

describe('ModalMotivoRelatorioComponent', () => {
  let component: ModalMotivoRelatorioComponent;
  let fixture: ComponentFixture<ModalMotivoRelatorioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMotivoRelatorioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMotivoRelatorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
