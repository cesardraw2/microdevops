import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerConfiguracoesGeraisComponent } from './container-configuracoes-gerais.component';
import { Store, StoreModule } from '@ngrx/store';

describe('ContainerConfiguracoesGeraisComponent', () => {
  let component: ContainerConfiguracoesGeraisComponent;
  let fixture: ComponentFixture<ContainerConfiguracoesGeraisComponent>;
  let store: Store;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ ContainerConfiguracoesGeraisComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerConfiguracoesGeraisComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
