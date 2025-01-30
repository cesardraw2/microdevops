import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerSeguradoraComponent } from './container-seguradora.component';
import { Store, StoreModule } from '@ngrx/store';

describe('ContainerSeguradoraComponent', () => {
  let component: ContainerSeguradoraComponent;
  let fixture: ComponentFixture<ContainerSeguradoraComponent>;
  let store: Store<any>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ ContainerSeguradoraComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerSeguradoraComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
