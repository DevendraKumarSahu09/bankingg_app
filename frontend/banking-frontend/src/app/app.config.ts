// src/app/app.config.ts
import { ApplicationConfig, isDevMode, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// NgRx
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore } from '@ngrx/router-store';

// Apollo Angular
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

// App imports
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

// NgRx Store
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({ auth: authReducer }),
    provideEffects([AuthEffects]),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true,
    }),

    // ✅ Apollo provider
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      const authLink = setContext((_, { headers }) => {
        const token = localStorage.getItem('authToken');
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
          },
        };
      });

      return {
        link: authLink.concat(httpLink.create({ uri: 'https://banking-app-api-tdhs.onrender.com/graphql' })),
        cache: new InMemoryCache(),
        defaultOptions: {
          watchQuery: { errorPolicy: 'all' },
          query: { errorPolicy: 'all' },
          mutate: { errorPolicy: 'all' },
        },
      };
    }),
  ],
};
