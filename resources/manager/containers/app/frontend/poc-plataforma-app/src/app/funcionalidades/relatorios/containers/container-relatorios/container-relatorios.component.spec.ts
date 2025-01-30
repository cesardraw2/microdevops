import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerRelatoriosComponent } from './container-relatorios.component';
import { Store, StoreModule } from '@ngrx/store';

describe('ContainerRelatoriosComponent', () => {
  let component: ContainerRelatoriosComponent;
  let fixture: ComponentFixture<ContainerRelatoriosComponent>;
  let store: Store<any>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ ContainerRelatoriosComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerRelatoriosComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
