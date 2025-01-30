import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { SeguradoraEffects } from './seguradora.effects';

describe('SeguradoraEffects', () => {
  let actions$: Observable<any>;
  let effects: SeguradoraEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SeguradoraEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(SeguradoraEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
