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
// Appearantly there are some issues with `paths` so we need to use absolute paths for now.
import { da as daTranslations } from '@energinet-datahub/dh/globalization/assets-localization';

describe('Application shell', () => {
  it('should display welcome message', () => {
    cy.visit('/metering-point/search');
    cy.findByRole('heading', {
      name: new RegExp(daTranslations.meteringPoint.search.title, 'i')
    });
  });
});
