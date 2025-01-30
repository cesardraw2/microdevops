import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';

import { AppEffects } from './app.effects';
import { AlertService, AlertConfig } from '@sicoob/ui';
import { appShowMessage } from './app.actions';

describe('AppEffects', () => {
  const actions$ = new ReplaySubject(1);
  let effects: AppEffects;
  let alertService: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppEffects,
        provideMockActions(() => actions$),
        AlertService,
      ]
    });

    effects = TestBed.inject(AppEffects);
    alertService = TestBed.inject(AlertService);
  });

  it('should show the error', () => {
    spyOn(alertService, 'open').and.stub();
    actions$.next(appShowMessage({message: 'MSG_ERROR_SEARCH_PARTICIPANTE', color: 'danger'}));
    effects.showMessage$.subscribe(i => {
      expect(alertService.open).toHaveBeenCalledWith({
        message: 'MSG_ERROR_SEARCH_PARTICIPANTE',
        color: 'danger',
        duration: 2000,
        type: '[Sisbr 3.0] Show Message',
      } as AlertConfig);
    });

  });

});
