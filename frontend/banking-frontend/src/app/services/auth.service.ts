import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AuthActions from '../store/auth/auth.actions';
import * as AuthSelectors from '../store/auth/auth.selectors';
import { LoginCredentials, SignupData } from '../store/auth/auth.actions';
import { User } from '../store/auth/auth.state';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Move these inside constructor or use getter methods
  public currentUser$: Observable<User | null>;
  public isAuthenticated$: Observable<boolean>;
  public loading$: Observable<boolean>;
  public error$: Observable<string | null>;

  constructor(private store: Store) {
    // Initialize observables here
    this.currentUser$ = this.store.select(AuthSelectors.selectCurrentUser);
    this.isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);
    this.loading$ = this.store.select(AuthSelectors.selectAuthLoading);
    this.error$ = this.store.select(AuthSelectors.selectAuthError);
    
    this.loadAuthFromStorage();
  }

  login(credentials: LoginCredentials): void {
    this.store.dispatch(AuthActions.login({ credentials }));
  }

  signup(userData: SignupData): void {
    this.store.dispatch(AuthActions.signup({ userData }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  clearError(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private loadAuthFromStorage(): void {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('currentUser');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.store.dispatch(AuthActions.loadAuthFromStorage({ user, token }));
      } catch (error) {
        this.logout();
      }
    }
  }
}
