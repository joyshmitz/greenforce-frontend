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
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

@Component({
  selector: 'dh-metering-point-details',
  imports: [
    TranslocoDirective,

    WATT_CARD,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    DhEmDashFallbackPipe,
  ],
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;

    :host {
      display: block;
    }

    @include watt.media('>=XLarge') {
      watt-card {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--watt-space-l);
      }

      .grid-column:first-of-type .watt-divider:last-of-type {
        display: none;
      }
    }
  `,
  template: `
    <watt-card *transloco="let t; read: 'meteringPoint.overview.details'">
      <div class="grid-column">
        <watt-card-title>
          <h3>{{ t('title') }}</h3>
        </watt-card-title>

        <watt-description-list class="watt-space-stack-l" variant="stack" [itemSeparators]="false">
          <watt-description-list-item [label]="t('address')" [value]="null | dhEmDashFallback" />
          <watt-description-list-item [label]="t('comment')" [value]="null | dhEmDashFallback" />
        </watt-description-list>

        <hr class="watt-divider" />

        <h4 class="watt-space-stack-s">{{ t('detailsSubtitle') }}</h4>

        <watt-description-list variant="stack" [itemSeparators]="false">
          <watt-description-list-item
            [label]="t('meteringPointType')"
            [value]="null | dhEmDashFallback"
          />
          <watt-description-list-item
            [label]="t('meteringPointKind')"
            [value]="null | dhEmDashFallback"
          />
          <watt-description-list-item
            [label]="t('meteringPointNumber')"
            [value]="null | dhEmDashFallback"
          />
          <watt-description-list-item
            [label]="t('settlementMethod')"
            [value]="null | dhEmDashFallback"
          />
          <watt-description-list-item
            [label]="t('electricalHeating')"
            [value]="null | dhEmDashFallback"
          />
          <watt-description-list-item
            [label]="t('electricalHeatingTaxStartDate')"
            [value]="null | dhEmDashFallback"
          />
          <watt-description-list-item
            [label]="t('capacityLimit')"
            [value]="null | dhEmDashFallback"
          />
          <watt-description-list-item
            [label]="t('disconnectionType')"
            [value]="null | dhEmDashFallback"
          />
          <watt-description-list-item [label]="t('gridArea')" [value]="null | dhEmDashFallback" />
          <watt-description-list-item
            [label]="t('connectionDate')"
            [value]="null | dhEmDashFallback"
          />
        </watt-description-list>

        <hr class="watt-divider" />
      </div>

      <div class="grid-column">
        <h4 class="watt-space-stack-s">{{ t('powerPlantSubTitle') }}</h4>

        <watt-description-list variant="stack" [itemSeparators]="false">
          <watt-description-list-item
            [label]="t('netSettlementGroup')"
            [value]="null | dhEmDashFallback"
          />
          <watt-description-list-item
            [label]="t('scheduledReadingDate')"
            [value]="null | dhEmDashFallback"
          />
          <watt-description-list-item
            [label]="t('powerPlantCapacity')"
            [value]="null | dhEmDashFallback"
          />
          <watt-description-list-item
            [label]="t('powerPlantAssetType')"
            [value]="null | dhEmDashFallback"
          />
          <watt-description-list-item
            [label]="t('powerPlantConnectionType')"
            [value]="null | dhEmDashFallback"
          />
          <watt-description-list-item
            [label]="t('powerPlantGsrnNumber')"
            [value]="null | dhEmDashFallback"
          />
        </watt-description-list>

        <hr class="watt-divider" />

        <h4 class="watt-space-stack-s">{{ t('otherSubTitle') }}</h4>

        <watt-description-list variant="stack" [itemSeparators]="false">
          <watt-description-list-item
            [label]="t('readingOccurrence')"
            [value]="null | dhEmDashFallback"
          />
          <watt-description-list-item [label]="t('unit')" [value]="null | dhEmDashFallback" />
          <watt-description-list-item [label]="t('product')" [value]="null | dhEmDashFallback" />
        </watt-description-list>
      </div>
    </watt-card>
  `,
})
export class DhMeteringPointDetailsComponent {}
