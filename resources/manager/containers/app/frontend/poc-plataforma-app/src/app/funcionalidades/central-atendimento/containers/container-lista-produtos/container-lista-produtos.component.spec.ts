import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContainerListaProdutosComponent } from './container-lista-produtos.component'

describe('ContainerListaProdutosComponent', () => {
  let component: ContainerListaProdutosComponent;
  let fixture: ComponentFixture<ContainerListaProdutosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerListaProdutosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerListaProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
