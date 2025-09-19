// src/app/graphql/apollo.token.ts
import { InjectionToken } from '@angular/core';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client/core';

export const APOLLO_CLIENT = new InjectionToken<ApolloClient<NormalizedCacheObject>>(
  'Apollo Client'
);
