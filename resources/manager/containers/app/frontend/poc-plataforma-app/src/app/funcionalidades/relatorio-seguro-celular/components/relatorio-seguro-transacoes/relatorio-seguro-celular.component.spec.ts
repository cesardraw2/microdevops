import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioSeguroCelularComponent } from './relatorio-seguro-celular.component';

describe('RelatorioAutoComponent', () => {
  let component: RelatorioSeguroCelularComponent;
  let fixture: ComponentFixture<RelatorioSeguroCelularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioSeguroCelularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioSeguroCelularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
