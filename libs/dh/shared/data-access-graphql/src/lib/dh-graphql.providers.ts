//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import { inject } from '@angular/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink, Operation, split } from '@apollo/client/core';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import { getMainDefinition } from '@apollo/client/utilities';

import { dhApiEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';
import { scalarTypePolicies } from '@energinet-datahub/dh/shared/domain/graphql';
import introspection from '@energinet-datahub/dh/shared/domain/graphql/introspection';

import { errorHandler } from './error-handler';
import DhSseLink from './dh-sse-link';

declare const ngDevMode: boolean;

function isSubscriptionQuery(operation: Operation) {
  const definition = getMainDefinition(operation.query);
  return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
}

export const graphQLProvider = provideApollo(() => {
  const httpLink = inject(HttpLink);
  const sseLink = inject(DhSseLink);
  const dhApiEnvironment = inject(dhApiEnvironmentToken);
  const dhApplicationInsights = inject(DhApplicationInsights);

  if (ngDevMode) {
    loadDevMessages();
    loadErrorMessages();
  }

  return {
    defaultOptions: {
      query: {
        notifyOnNetworkStatusChange: true,
      },
      watchQuery: {
        notifyOnNetworkStatusChange: true,
      },
    },
    cache: new InMemoryCache({
      possibleTypes: introspection.possibleTypes,
      typePolicies: {
        ...scalarTypePolicies,
        MessageDelegationType: {
          keyFields: ['id', 'periodId'],
        },
        ActorUserRole: {
          keyFields: false,
        },
        Calculation: {
          keyFields: (obj) => `Calculation:${obj.id}`,
        },
        Query: {
          fields: {
            calculationById(_, { args, toReference }) {
              return toReference({
                __typename: 'Calculation',
                id: args?.id,
              });
            },
            actorById(_, { args, toReference }) {
              return toReference({
                __typename: 'Actor',
                id: args?.['id'],
              });
            },
          },
        },
      },
    }),
    link: ApolloLink.from([
      errorHandler(dhApplicationInsights),
      split(
        isSubscriptionQuery,
        sseLink.create(`${dhApiEnvironment.apiBase}/graphql?ngsw-bypass=true`),
        httpLink.create({
          uri: (operation: Operation) => {
            return `${dhApiEnvironment.apiBase}/graphql?${operation.operationName}`;
          },
        })
      ),
    ]),
  };
});
