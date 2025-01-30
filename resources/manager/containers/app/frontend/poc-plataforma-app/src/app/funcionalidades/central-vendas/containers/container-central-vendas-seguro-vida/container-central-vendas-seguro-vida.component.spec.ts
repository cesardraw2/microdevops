import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerCentralVendasComponent } from './container-central-vendas-seguro-vida.component';
import { Store, StoreModule } from '@ngrx/store';

describe('ContainerCentralVendasComponent', () => {
  let component: ContainerCentralVendasComponent;
  let fixture: ComponentFixture<ContainerCentralVendasComponent>;
  let store: Store<any>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ ContainerCentralVendasComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerCentralVendasComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
