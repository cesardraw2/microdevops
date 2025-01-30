import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguradoraComponent } from './seguradora.component';

describe('SeguradoraComponent', () => {
  let component: SeguradoraComponent;
  let fixture: ComponentFixture<SeguradoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguradoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguradoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
