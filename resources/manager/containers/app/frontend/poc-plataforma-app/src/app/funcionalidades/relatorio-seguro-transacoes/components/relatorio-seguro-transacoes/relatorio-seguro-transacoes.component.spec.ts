import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioSeguroTransacoesComponent } from './relatorio-seguro-transacoes.component';

describe('RelatorioAutoComponent', () => {
  let component: RelatorioSeguroTransacoesComponent;
  let fixture: ComponentFixture<RelatorioSeguroTransacoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioSeguroTransacoesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioSeguroTransacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
