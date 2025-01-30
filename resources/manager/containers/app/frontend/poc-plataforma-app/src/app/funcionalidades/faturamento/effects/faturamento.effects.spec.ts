import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { FaturamentoEffects } from './faturamento.effects';

describe('FaturamentoEffects', () => {
  let actions$: Observable<any>;
  let effects: FaturamentoEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FaturamentoEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(FaturamentoEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
