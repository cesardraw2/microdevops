import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerCentralConfiguracaoComponent } from './container-central-configuracao.component';
import { Store, StoreModule } from '@ngrx/store';

describe('ContainerCentralConfiguracaoComponent', () => {
  let component: ContainerCentralConfiguracaoComponent;
  let fixture: ComponentFixture<ContainerCentralConfiguracaoComponent>;
  let store: Store;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ ContainerCentralConfiguracaoComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerCentralConfiguracaoComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
