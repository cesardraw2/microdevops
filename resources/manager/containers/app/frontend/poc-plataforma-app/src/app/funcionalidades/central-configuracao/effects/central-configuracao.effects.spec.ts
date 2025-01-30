import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CentralConfiguracaoEffects } from './central-configuracao.effects';

describe('CentralConfiguracaoEffects', () => {
  let actions$: Observable<any>;
  let effects: CentralConfiguracaoEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CentralConfiguracaoEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(CentralConfiguracaoEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
