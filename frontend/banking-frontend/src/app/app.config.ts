// src/app/app.config.ts
import { ApplicationConfig, isDevMode, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// NgRx
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore } from '@ngrx/router-store';

// Apollo GraphQL
import { provideApollo } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';

// App imports
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

// NgRx Store
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';

// GraphQL configuration function
const createApolloProvider = () => {
  return provideApollo(() => {
    const httpLink = inject(HttpLink);
    
    const authLink = setContext((_, { headers }) => {
      const token = localStorage.getItem('authToken');
      
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
        }
      };
    });

    return {
      link: authLink.concat(httpLink.create({
        uri: 'https://banking-app-api-tdhs.onrender.com/graphql',
      })),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          errorPolicy: 'all'
        },
        query: {
          errorPolicy: 'all'
        }
      }
    };
  });
};

export const appConfig: ApplicationConfig = {
  providers: [
    // Router
    provideRouter(routes),
    
    // HTTP Client with interceptors
    provideHttpClient(withInterceptors([authInterceptor])),
    
    // NgRx Store Configuration
    provideStore({
      auth: authReducer
    }),
    
    // NgRx Effects
    provideEffects([AuthEffects]),
    
    // NgRx Router Store
    provideRouterStore(),
    
    // NgRx DevTools (only in development)
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true
    }),
    
    // Apollo GraphQL
    createApolloProvider()
  ]
};
