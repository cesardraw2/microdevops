import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotaoFuncionalidadeComponent } from './botao-funcionalidade.component';

describe('BotaoFuncionalidadeComponent', () => {
  let component: BotaoFuncionalidadeComponent;
  let fixture: ComponentFixture<BotaoFuncionalidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotaoFuncionalidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotaoFuncionalidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
