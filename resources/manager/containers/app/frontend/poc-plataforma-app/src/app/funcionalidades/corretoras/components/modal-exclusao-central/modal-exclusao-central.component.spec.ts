import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExclusaoCentralComponent } from './modal-exclusao-central.component';

describe('ModalExclusaoCentralComponent', () => {
  let component: ModalExclusaoCentralComponent;
  let fixture: ComponentFixture<ModalExclusaoCentralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalExclusaoCentralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalExclusaoCentralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
