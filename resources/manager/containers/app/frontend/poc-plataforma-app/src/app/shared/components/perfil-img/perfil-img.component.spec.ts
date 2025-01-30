import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilImgComponent } from './perfil-img.component';

describe('PerfilImgComponent', () => {
  let component: PerfilImgComponent;
  let fixture: ComponentFixture<PerfilImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
