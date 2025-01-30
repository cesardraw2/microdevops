import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabecalhoSeguradoraComponent } from './cabecalho-seguradora.component';

describe('CabecalhoSeguradoraComponent', () => {
  let component: CabecalhoSeguradoraComponent;
  let fixture: ComponentFixture<CabecalhoSeguradoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabecalhoSeguradoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabecalhoSeguradoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
