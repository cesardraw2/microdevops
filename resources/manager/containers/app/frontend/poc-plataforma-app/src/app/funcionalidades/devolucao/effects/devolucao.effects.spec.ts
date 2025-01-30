import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { DevolucaoEffects } from './devolucao.effects';

describe('DevolucaoEffects', () => {
  let actions$: Observable<any>;
  let effects: DevolucaoEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DevolucaoEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(DevolucaoEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
