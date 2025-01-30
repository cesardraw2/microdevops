import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerFaturamentoComponent } from './container-faturamento.component';
import { Store, StoreModule } from '@ngrx/store';

describe('ContainerFaturamentoComponent', () => {
  let component: ContainerFaturamentoComponent;
  let fixture: ComponentFixture<ContainerFaturamentoComponent>;
  let store: Store<any>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ ContainerFaturamentoComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerFaturamentoComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
