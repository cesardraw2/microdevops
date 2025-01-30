import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueroVenderComponent } from './quero-vender.component';

describe('QueroVenderComponent', () => {
  let component: QueroVenderComponent;
  let fixture: ComponentFixture<QueroVenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueroVenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueroVenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
