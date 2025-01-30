import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoSeguroComponent } from './tipo-seguro.component';

describe('TipoSeguroComponent', () => {
  let component: TipoSeguroComponent;
  let fixture: ComponentFixture<TipoSeguroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoSeguroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoSeguroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
