import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerSegurosGeraisComponent } from './container-seguros-gerais.component';
import { Store, StoreModule } from '@ngrx/store';

describe('ContainerSegurosGeraisComponent', () => {
  let component: ContainerSegurosGeraisComponent;
  let fixture: ComponentFixture<ContainerSegurosGeraisComponent>;
  let store: Store<any>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ ContainerSegurosGeraisComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerSegurosGeraisComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
