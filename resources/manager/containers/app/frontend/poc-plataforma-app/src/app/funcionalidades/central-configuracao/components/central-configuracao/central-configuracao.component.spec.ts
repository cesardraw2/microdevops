import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralConfiguracaoComponent } from './central-configuracao.component';

describe('CentralConfiguracaoComponent', () => {
  let component: CentralConfiguracaoComponent;
  let fixture: ComponentFixture<CentralConfiguracaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentralConfiguracaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CentralConfiguracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
