import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentActionsComponent } from './environment-actions.component';

describe('EnvironmentActionsComponent', () => {
  let component: EnvironmentActionsComponent;
  let fixture: ComponentFixture<EnvironmentActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvironmentActionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnvironmentActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
