import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNomeCorretoraComponent } from './modal-nome-corretora.component';

describe('ModalNomeCorretoraComponent', () => {
  let component: ModalNomeCorretoraComponent;
  let fixture: ComponentFixture<ModalNomeCorretoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNomeCorretoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNomeCorretoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
