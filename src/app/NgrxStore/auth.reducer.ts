import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.action';

export interface AuthState {
  token: string | null;
}

const initialState: AuthState = { token: null };

export const authReducer = createReducer(
  initialState,
  on(AuthActions.setToken, (state, { token }) => {
    sessionStorage.setItem('token', token);
    // console.log(sessionStorage);
    
    return { ...state, token }; // Just update the state, without side effects
  }),
  on(AuthActions.clearToken, (state) => {
    sessionStorage.removeItem('token');
    return { ...state, token: null }; // Reset the token in the state
  })
);
