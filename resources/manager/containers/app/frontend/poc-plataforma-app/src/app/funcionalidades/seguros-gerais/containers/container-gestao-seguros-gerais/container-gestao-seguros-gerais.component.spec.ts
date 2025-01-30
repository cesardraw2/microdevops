import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerGestaoSegurosGeraisComponent } from './container-gestao-seguros-gerais.component';
import { Store, StoreModule } from '@ngrx/store';

describe('ContainerSegurosGeraisComponent', () => {
  let component: ContainerGestaoSegurosGeraisComponent;
  let fixture: ComponentFixture<ContainerGestaoSegurosGeraisComponent>;
  let store: Store<any>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ ContainerGestaoSegurosGeraisComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerGestaoSegurosGeraisComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
