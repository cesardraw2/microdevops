import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuInicialComponent } from './menu-inicial.component';

describe('MenuInicialComponent', () => {
  let component: MenuInicialComponent;
  let fixture: ComponentFixture<MenuInicialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuInicialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuInicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
