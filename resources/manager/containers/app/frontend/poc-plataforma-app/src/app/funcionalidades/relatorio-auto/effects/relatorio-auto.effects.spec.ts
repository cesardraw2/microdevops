import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { RelatorioAutoEffects } from './relatorio-auto.effects';

describe('RelatorioAutoEffects', () => {
  let actions$: Observable<any>;
  let effects: RelatorioAutoEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RelatorioAutoEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(RelatorioAutoEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
