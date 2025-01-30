import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerRelatorioAutoComponent } from './container-relatorio-auto.component';
import { Store, StoreModule } from '@ngrx/store';

describe('ContainerRelatorioAutoComponent', () => {
  let component: ContainerRelatorioAutoComponent;
  let fixture: ComponentFixture<ContainerRelatorioAutoComponent>;
  let store: Store<any>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ ContainerRelatorioAutoComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerRelatorioAutoComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
