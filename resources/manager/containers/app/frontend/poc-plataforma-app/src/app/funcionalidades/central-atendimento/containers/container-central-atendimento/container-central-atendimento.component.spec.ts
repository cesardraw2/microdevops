import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerCentralAtendimentoComponent } from './container-central-atendimento.component';
import { Store, StoreModule } from '@ngrx/store';

describe('ContainerCentralAtendimentoComponent', () => {
  let component: ContainerCentralAtendimentoComponent;
  let fixture: ComponentFixture<ContainerCentralAtendimentoComponent>;
  let store: Store<any>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ ContainerCentralAtendimentoComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerCentralAtendimentoComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
