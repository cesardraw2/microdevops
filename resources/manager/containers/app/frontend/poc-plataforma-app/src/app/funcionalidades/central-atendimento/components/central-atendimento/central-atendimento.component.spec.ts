import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralVendasComponent } from './central-atendimento.component';

describe('CentralVendasComponent', () => {
  let component: CentralVendasComponent;
  let fixture: ComponentFixture<CentralVendasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentralVendasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentralVendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
