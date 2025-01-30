import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCorretorasComponent } from './lista-corretoras.component';

describe('ListaCorretorasComponent', () => {
  let component: ListaCorretorasComponent;
  let fixture: ComponentFixture<ListaCorretorasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaCorretorasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaCorretorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
