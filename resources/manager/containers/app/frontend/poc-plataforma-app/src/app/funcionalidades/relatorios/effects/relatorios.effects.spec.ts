import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { RelatoriosEffects } from './relatorios.effects';

describe('RelatoriosEffects', () => {
  let actions$: Observable<any>;
  let effects: RelatoriosEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RelatoriosEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(RelatoriosEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
