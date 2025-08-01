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
import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_LINK_TABS } from '@energinet-datahub/watt/tabs';
import { MarketParticipantSubPaths, combinePaths } from '@energinet-datahub/dh/core/routing';

@Component({
  selector: 'dh-market-participant',
  template: `
    <ng-container *transloco="let t; read: 'marketParticipant.actors.tabs'">
      <watt-link-tabs>
        <watt-link-tab [label]="t('actors.tabLabel')" [link]="getLink('actors')" />
        <watt-link-tab [label]="t('organizations.tabLabel')" [link]="getLink('organizations')" />
        <watt-link-tab [label]="t('marketRoles.tabLabel')" [link]="getLink('market-roles')" />
      </watt-link-tabs>
    </ng-container>
  `,
  imports: [TranslocoDirective, WATT_LINK_TABS],
})
export class DhMarketParticipantComponent {
  getLink = (path: MarketParticipantSubPaths) => combinePaths('market-participant', path);
}
