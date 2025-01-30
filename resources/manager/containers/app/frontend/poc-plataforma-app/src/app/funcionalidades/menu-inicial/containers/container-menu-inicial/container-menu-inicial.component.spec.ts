import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerMenuInicialComponent } from './container-menu-inicial.component';
import { Store, StoreModule } from '@ngrx/store';

describe('ContainerMenuInicialComponent', () => {
  let component: ContainerMenuInicialComponent;
  let fixture: ComponentFixture<ContainerMenuInicialComponent>;
  let store: Store<any>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ ContainerMenuInicialComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerMenuInicialComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
