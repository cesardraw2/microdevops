import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoSeguroCardComponent } from './tipo-seguro-card.component';

describe('TipoSeguroVidaComponent', () => {
  let component: TipoSeguroCardComponent;
  let fixture: ComponentFixture<TipoSeguroCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoSeguroCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoSeguroCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
