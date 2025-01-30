import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroDevolucaoComponent } from './filtro-devolucao.component';

describe('FiltroDevolucaoComponent', () => {
  let component: FiltroDevolucaoComponent;
  let fixture: ComponentFixture<FiltroDevolucaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroDevolucaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroDevolucaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
