 
import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,
  
  // Login
  on(AuthActions.login, (state) => ({ //projector function
    ...state,
    loading: true,
    error: null
  })),
  
  on(AuthActions.loginSuccess, (state, { authData }) => ({
    ...state,
    user: authData.user,
    token: authData.token,
    isAuthenticated: true,
    loading: false,
    error: null
  })),
  
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false
  })),
  
  // Signup
  on(AuthActions.signup, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AuthActions.signupSuccess, (state, { authData }) => ({
    ...state,
    user: authData.user,
    token: authData.token,
    isAuthenticated: true,
    loading: false,
    error: null
  })),
  
  on(AuthActions.signupFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false
  })),
  
  // Logout
  on(AuthActions.logout, () => ({
    ...initialAuthState
  })),
  
  // Load from storage
  on(AuthActions.loadAuthFromStorage, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: !!token && !!user
  })),
  
  // Clear error
  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);
