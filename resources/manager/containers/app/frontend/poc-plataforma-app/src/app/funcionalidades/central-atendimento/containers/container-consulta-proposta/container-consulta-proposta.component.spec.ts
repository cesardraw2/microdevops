import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerConsultaPropostaComponent } from './container-consulta-proposta.component';

describe('ContainerConsultaPropostaComponent', () => {
  let component: ContainerConsultaPropostaComponent;
  let fixture: ComponentFixture<ContainerConsultaPropostaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerConsultaPropostaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerConsultaPropostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
