import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

// Feature selector to select 'auth' state
const selectAuthState = createFeatureSelector<AuthState>('auth');

// Selector to select the token from the 'auth' state
export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);
