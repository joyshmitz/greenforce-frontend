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
/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import * as dashboardPage from '../support/dashboard.po';
import * as loginPage from '../support/login.po';

describe('Authentication', () => {
  it(`Given a commercial user
    When NemID authentication is successful
    Then they are redirected to the dashboard page`, () => {
    cy.intercept(
      {
        hostname: 'localhost',
        method: 'GET',
        pathname: '/api/auth/oidc/login',
      },
      {
        next_url: '/dashboard?success=1',
      }
    );
    loginPage.navigateTo();

    loginPage.getNemidLink().click();

    dashboardPage.getTitle().should('exist');
  });
});
