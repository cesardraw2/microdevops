import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerRelatorioPropostaComponent } from './container-relatorio-proposta.component';

describe('ContainerRelatorioPropostaComponent', () => {
  let component: ContainerRelatorioPropostaComponent;
  let fixture: ComponentFixture<ContainerRelatorioPropostaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerRelatorioPropostaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerRelatorioPropostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
