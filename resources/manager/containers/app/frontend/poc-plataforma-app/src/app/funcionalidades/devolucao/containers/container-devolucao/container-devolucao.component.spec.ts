import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerDevolucaoComponent } from './container-devolucao.component';
import { Store, StoreModule } from '@ngrx/store';

describe('ContainerDevolucaoComponent', () => {
  let component: ContainerDevolucaoComponent;
  let fixture: ComponentFixture<ContainerDevolucaoComponent>;
  let store: Store<any>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ ContainerDevolucaoComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerDevolucaoComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
