import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CorretorasEffects } from './corretoras.effects';

describe('CorretorasEffects', () => {
  let actions$: Observable<any>;
  let effects: CorretorasEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CorretorasEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(CorretorasEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
