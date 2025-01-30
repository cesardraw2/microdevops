import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerRelatorioSeguroCelularComponent } from './container-relatorio-seguro-celular.component';
import { Store, StoreModule } from '@ngrx/store';

describe('ContainerRelatorioAutoComponent', () => {
  let component: ContainerRelatorioSeguroCelularComponent;
  let fixture: ComponentFixture<ContainerRelatorioSeguroCelularComponent>;
  let store: Store<any>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ ContainerRelatorioSeguroCelularComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerRelatorioSeguroCelularComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
