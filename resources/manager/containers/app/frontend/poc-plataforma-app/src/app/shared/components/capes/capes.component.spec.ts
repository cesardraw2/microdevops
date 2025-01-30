import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapesComponent } from './capes.component';

describe('CapesComponent', () => {
  let component: CapesComponent;
  let fixture: ComponentFixture<CapesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
