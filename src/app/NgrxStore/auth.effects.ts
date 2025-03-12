import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as AuthActions from './auth.action';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions) {}

  // Effect to set token in sessionStorage
  logToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.setToken),
        tap((action) => {
          sessionStorage.setItem('token', action.token);
           // console.log('Token', action.token)
        })
      ),
    { dispatch: false } // No new action to dispatch
  );

  // Effect to clear token from sessionStorage
  clearToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.clearToken),
        tap(() => {
          sessionStorage.removeItem('token');
        })
      ),
    { dispatch: false } // No new action to dispatch
  );
}
