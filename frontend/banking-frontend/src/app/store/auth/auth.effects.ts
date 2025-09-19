import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { gql } from 'apollo-angular';

import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private apollo = inject(Apollo);
  private router = inject(Router);

  private LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          id
          name
          email
          role
        }
      }
    }
  `;

  private SIGNUP_MUTATION = gql`
    mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
        id
        name
        email
        role
      }
    }
  `;

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.apollo.mutate({
          mutation: this.LOGIN_MUTATION,
          variables: credentials,
        }).pipe(
          map((result: any) => {
            const authData = result.data.login;
            this.saveToLocalStorage(authData);
            return AuthActions.loginSuccess({ authData });
          }),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: this.extractErrorMessage(error) }))
          )
        )
      )
    )
  );

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      switchMap(({ userData }) =>
        this.apollo.mutate({
          mutation: this.SIGNUP_MUTATION,
          variables: { input: userData },
        }).pipe(
          switchMap(() =>
            this.apollo.mutate({
              mutation: this.LOGIN_MUTATION,
              variables: { email: userData.email, password: userData.password },
            }).pipe(
              map((result: any) => {
                const authData = result.data.login;
                this.saveToLocalStorage(authData);
                return AuthActions.signupSuccess({ authData });
              })
            )
          ),
          catchError((error) =>
            of(AuthActions.signupFailure({ error: this.extractErrorMessage(error) }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.signupSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.clearLocalStorage();
          this.apollo.client.clearStore();
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  private saveToLocalStorage(authData: any): void {
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('currentUser', JSON.stringify(authData.user));
  }

  private clearLocalStorage(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  private extractErrorMessage(error: any): string {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      return error.graphQLErrors[0].message;
    }
    if (error.networkError) {
      return 'Network error. Please check your connection.';
    }
    return error.message || 'An unexpected error occurred';
  }
}
