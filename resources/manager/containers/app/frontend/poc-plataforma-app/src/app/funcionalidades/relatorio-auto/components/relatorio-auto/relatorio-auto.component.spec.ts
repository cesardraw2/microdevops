import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioAutoComponent } from './relatorio-auto.component';

describe('RelatorioAutoComponent', () => {
  let component: RelatorioAutoComponent;
  let fixture: ComponentFixture<RelatorioAutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioAutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
