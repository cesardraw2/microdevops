import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueroGerenciarComponent } from './quero-gerenciar.component';

describe('QueroGerenciarComponent', () => {
  let component: QueroGerenciarComponent;
  let fixture: ComponentFixture<QueroGerenciarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueroGerenciarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueroGerenciarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
