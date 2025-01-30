import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageLaunchComponent } from './image-launch.component';

describe('ImageLaunchComponent', () => {
  let component: ImageLaunchComponent;
  let fixture: ComponentFixture<ImageLaunchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageLaunchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageLaunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
