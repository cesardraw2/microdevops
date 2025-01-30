import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInclusaoVinculoComponent } from './modal-inclusao-vinculo.component';

describe('ModalInclusaoVinculoComponent', () => {
  let component: ModalInclusaoVinculoComponent;
  let fixture: ComponentFixture<ModalInclusaoVinculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalInclusaoVinculoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInclusaoVinculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
