import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { AlertService } from '@sicoob/ui';
import { appShowMessage } from './app.actions';

@Injectable()
export class AppEffects {

  showMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(appShowMessage),
      tap(action => {
        this.alertService.open({ duration: 2000, ...action});
      })
    );
  }, {dispatch: false} );

  constructor(
    private actions$: Actions,
    private alertService: AlertService,
  ) {}
}
