import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CentralVendasEffects } from './central-vendas.effects';

describe('CentralVendasEffects', () => {
  let actions$: Observable<any>;
  let effects: CentralVendasEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CentralVendasEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(CentralVendasEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
