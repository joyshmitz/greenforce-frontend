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
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { BalanceResponsibilityAgreementStatus } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';

@Component({
  selector: 'dh-balance-responsible-relation-status',
  imports: [TranslocoDirective, WattBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <ng-container
      *transloco="
        let t;
        read: 'marketParticipant.actorsOverview.drawer.tabs.balanceResponsibleRelation.statusOptions'
      "
    >
      @switch (status()) {
        @case ('ACTIVE') {
          <watt-badge type="success">{{ t(status()) }}</watt-badge>
        }
        @case ('AWAITING') {
          <watt-badge type="info">{{ t(status()) }}</watt-badge>
        }
        @case ('SOON_TO_EXPIRE') {
          <watt-badge type="warning">{{ t(status()) }}</watt-badge>
        }
        @case ('EXPIRED') {
          <watt-badge type="neutral">{{ t(status()) }}</watt-badge>
        }
      }
    </ng-container>
  `,
})
export class DhBalanceResponsibleRelationStatusComponent {
  status = input.required<BalanceResponsibilityAgreementStatus>();
}
