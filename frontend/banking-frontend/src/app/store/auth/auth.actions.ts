 
import { createAction, props } from '@ngrx/store';
import { User } from './auth.state';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Auth Actions
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginCredentials }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ authData: AuthResponse }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const signup = createAction(
  '[Auth] Signup',
  props<{ userData: SignupData }>()
);

export const signupSuccess = createAction(
  '[Auth] Signup Success',
  props<{ authData: AuthResponse }>()
);

export const signupFailure = createAction(
  '[Auth] Signup Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const loadAuthFromStorage = createAction(
  '[Auth] Load From Storage',
  props<{ user: User; token: string }>()
);

export const clearError = createAction('[Auth] Clear Error');
