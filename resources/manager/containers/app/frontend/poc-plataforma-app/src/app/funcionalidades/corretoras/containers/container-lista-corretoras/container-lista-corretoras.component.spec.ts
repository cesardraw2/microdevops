import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerListaCorretorasComponent } from './container-lista-corretoras.component';
import { Store, StoreModule } from '@ngrx/store';

describe('ContainerListaCorretorasComponent', () => {
  let component: ContainerListaCorretorasComponent;
  let fixture: ComponentFixture<ContainerListaCorretorasComponent>;
  let store: Store;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ ContainerListaCorretorasComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerListaCorretorasComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
