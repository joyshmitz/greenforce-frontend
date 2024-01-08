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
// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.ts using ES2015 syntax:
import {
  mockedCalculations,
  mockedGridAreas,
  mockedLatestBalanceFixing,
} from '@energinet-datahub/dh/shared/data-access-mocks';
import './commands';

// Intercept assets
beforeEach(() => {
  /**
   * We need to intercept the mockServiceWorker.js file and serve it like this,
   * because the script is not allowed to be behind a redirect
   */
  cy.request('/__cypress/src/mockServiceWorker.js').then((res) => {
    cy.intercept('/mockServiceWorker.js', {
      headers: { 'content-type': 'text/javascript' },
      body: res.body,
    });
  });

  cy.intercept(
    '/graphql?GetGridAreas',
    { hostname: 'localhost' },
    {
      statusCode: 200,
      body: { data: { gridAreas: mockedGridAreas } },
    }
  );

  cy.intercept(
    '/graphql?GetCalculations',
    { hostname: 'localhost' },
    {
      statusCode: 200,
      body: { data: { calculations: mockedCalculations } },
    }
  );

  cy.intercept(
    '/graphql?GetLatestBalanceFixing',
    { hostname: 'localhost' },
    {
      statusCode: 200,
      body: {
        data: {
          __typename: 'Query',
          calculations: [mockedLatestBalanceFixing],
        },
      },
    }
  );

  cy.intercept(
    '/graphql?CreateCalculation',
    { hostname: 'localhost' },
    {
      statusCode: 200,
      body: {
        data: {
          __typename: 'Mutation',
          createCalculation: {
            __typename: 'CreateCalculationPayload',
            calculation: {
              __typename: 'Calculation',
              id: '779195a4-2505-4290-97a6-f3eba2b7d179',
            },
          },
        },
      },
    }
  );

  cy.intercept('/assets/i18n/da.json', { hostname: 'localhost' }, (req) => {
    req.redirect('/__cypress/src/assets/i18n/da.json');
  });

  cy.intercept('/assets/watt/icons/power.svg', { hostname: 'localhost' }, (req) => {
    req.redirect('/__cypress/src/assets/watt/icons/power.svg');
  });
});
