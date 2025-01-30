import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { SegurosGeraisEffects } from './seguros-gerais.effects';

describe('SegurosGeraisEffects', () => {
  let actions$: Observable<any>;
  let effects: SegurosGeraisEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SegurosGeraisEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(SegurosGeraisEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
