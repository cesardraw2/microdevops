import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegurosGeraisComponent } from './seguros-gerais.component';

describe('SegurosGeraisComponent', () => {
  let component: SegurosGeraisComponent;
  let fixture: ComponentFixture<SegurosGeraisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegurosGeraisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegurosGeraisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
