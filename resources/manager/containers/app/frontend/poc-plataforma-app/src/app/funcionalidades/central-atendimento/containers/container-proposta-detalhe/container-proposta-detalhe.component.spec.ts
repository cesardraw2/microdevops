import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerPropostaDetalheComponent } from './container-proposta-detalhe.component';
import { Store, StoreModule } from '@ngrx/store';

describe('ContainerCentralVendasComponent', () => {
  let component: ContainerPropostaDetalheComponent;
  let fixture: ComponentFixture<ContainerPropostaDetalheComponent>;
  let store: Store<any>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ ContainerPropostaDetalheComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerPropostaDetalheComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
