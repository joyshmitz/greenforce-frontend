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
import { DisplayLanguage } from '@energinet-datahub/dh/globalization/domain';
import {
  en as enTranslations,
  da as daTranslations,
} from '@energinet-datahub/dh/globalization/assets-localization';

import * as appShell from '../support/app-shell.po';

export const getLanguagePicker = (language: DisplayLanguage) =>
  cy.findByRole('button', {
    name: new RegExp('\\s*' + language.toUpperCase() + '\\s*'),
  });

describe('Language selection', () => {
  beforeEach(() => cy.visit('/'));

  it(`Given no language is selected
    Then Danish translations are displayed`, () => {
    appShell
      .getTitle()
      .should('have.text', daTranslations.meteringPoint.search.title);
  });

  it(`When English is selected
    Then English translations are displayed`, () => {
    getLanguagePicker(DisplayLanguage.English).click();

    appShell
      .getTitle()
      .should('have.text', enTranslations.meteringPoint.search.title);
  });

  it(`Given English is selected
    When Danish is selected
    Then Danish translations are displayed`, () => {
    getLanguagePicker(DisplayLanguage.English).click();

    getLanguagePicker(DisplayLanguage.Danish).click();

    appShell
      .getTitle()
      .should('have.text', daTranslations.meteringPoint.search.title);
  });
});
