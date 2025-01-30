import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropostaDocumentoComponent } from './proposta-documento.component';
import { Store, StoreModule } from '@ngrx/store';

describe('ContainerCentralVendasComponent', () => {
  let component: PropostaDocumentoComponent;
  let fixture: ComponentFixture<PropostaDocumentoComponent>;
  let store: Store<any>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ PropostaDocumentoComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropostaDocumentoComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
