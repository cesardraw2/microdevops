import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CentralAtendimentoEffects } from './central-atendimento.effects';

describe('CentralAtendimentoEffects', () => {
  let actions$: Observable<any>;
  let effects: CentralAtendimentoEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CentralAtendimentoEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(CentralAtendimentoEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
