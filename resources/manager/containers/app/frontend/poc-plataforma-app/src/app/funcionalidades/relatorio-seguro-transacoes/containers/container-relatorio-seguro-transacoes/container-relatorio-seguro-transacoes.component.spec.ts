import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerRelatorioSeguroTransacoesComponent } from './container-relatorio-seguro-transacoes.component';
import { Store, StoreModule } from '@ngrx/store';

describe('ContainerRelatorioAutoComponent', () => {
  let component: ContainerRelatorioSeguroTransacoesComponent;
  let fixture: ComponentFixture<ContainerRelatorioSeguroTransacoesComponent>;
  let store: Store<any>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ ContainerRelatorioSeguroTransacoesComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerRelatorioSeguroTransacoesComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
