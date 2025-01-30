import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapesFiltroComponent } from './capes-filtro.component';

describe('CapesFiltroComponent', () => {
  let component: CapesFiltroComponent;
  let fixture: ComponentFixture<CapesFiltroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapesFiltroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapesFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
