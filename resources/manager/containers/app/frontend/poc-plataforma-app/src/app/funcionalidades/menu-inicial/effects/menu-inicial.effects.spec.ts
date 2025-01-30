import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { MenuInicialEffects } from './menu-inicial.effects';

describe('MenuInicialEffects', () => {
  let actions$: Observable<any>;
  let effects: MenuInicialEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MenuInicialEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(MenuInicialEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
