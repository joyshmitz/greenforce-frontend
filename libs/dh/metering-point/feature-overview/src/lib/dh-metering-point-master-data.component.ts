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
import { Component, computed, inject, input } from '@angular/core';

import { WATT_CARD } from '@energinet-datahub/watt/card';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import { DhFeatureFlagDirective } from '@energinet-datahub/dh/shared/feature-flags';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';
import { GetMeteringPointByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { EnergySupplier } from './types';
import { DhCanSeeDirective } from './dh-can-see.directive';
import { DhEnergySupplierComponent } from './dh-energy-supplier.component';
import { DhCustomerOverviewComponent } from './dh-customer-overview.component';
import { DhRelatedMeteringPointsComponent } from './dh-related-metering-points';
import { DhMeteringPointDetailsComponent } from './dh-metering-point-details.component';
import { DhMeteringPointHighlightsComponent } from './dh-metering-point-highlights.component';

@Component({
  selector: 'dh-metering-point-master-data',
  imports: [
    WATT_CARD,
    DhResultComponent,
    DhMeteringPointHighlightsComponent,
    DhCustomerOverviewComponent,
    DhEnergySupplierComponent,
    DhMeteringPointDetailsComponent,
    DhRelatedMeteringPointsComponent,
    DhFeatureFlagDirective,
    DhCanSeeDirective,
  ],
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;

    :host {
      display: block;
      height: 100%;
    }

    .page-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--watt-space-ml);
      padding: var(--watt-space-ml);

      @include watt.media('>=Large') {
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: auto auto 1fr;

        dh-metering-point-highlights {
          grid-column: 1 / span 2;
          grid-row: 1;
        }

        dh-metering-point-details {
          grid-column: 1;
          grid-row: 2 / span 2;
        }

        dh-customer-overview {
          grid-column: 2;
          grid-row: 2;
        }

        dh-energy-supplier {
          grid-column: 2;
          grid-row: 3;
        }

        dh-related-metering-points {
          grid-column: 3;
          grid-row: 2;
        }
      }
    }
  `,
  template: `
    <dh-result [hasError]="hasError()" [loading]="loading()">
      <div class="page-grid">
        <dh-metering-point-highlights [meteringPointDetails]="meteringPointDetails()" />
        <dh-metering-point-details [meteringPointDetails]="meteringPointDetails()" />
        <dh-customer-overview
          *dhCanSee="'customer-overview-card'; meteringPointDetails: meteringPointDetails()"
          [meteringPointDetails]="meteringPointDetails()"
        />

        <dh-energy-supplier
          *dhCanSee="'energy-supplier-card'; meteringPointDetails: meteringPointDetails()"
          [energySupplier]="energySupplier()"
        />

        @if (relatedMeteringPoints()?.relatedMeteringPoints) {
          <dh-related-metering-points
            *dhFeatureFlag="'related-metering-point'"
            [relatedMeteringPoints]="relatedMeteringPoints()"
            [meteringPointId]="meteringPointId()"
          />
        }
      </div>
    </dh-result>
  `,
})
export class DhMeteringPointMasterDataComponent {
  private actor = inject(DhActorStorage).getSelectedActor();

  meteringPointId = input.required<string>();

  private meteringPointQuery = query(GetMeteringPointByIdDocument, () => ({
    variables: { meteringPointId: this.meteringPointId(), actorGln: this.actor?.gln ?? '' },
  }));

  hasError = this.meteringPointQuery.hasError;
  loading = this.meteringPointQuery.loading;

  meteringPointDetails = computed(() => this.meteringPointQuery.data()?.meteringPoint);
  isEnergySupplierResponsible = computed(() => this.meteringPointDetails()?.isEnergySupplier);
  relatedMeteringPoints = computed(() => this.meteringPointDetails()?.relatedMeteringPoints);
  energySupplier = computed<EnergySupplier>(() => ({
    gln: this.meteringPointDetails()?.commercialRelation?.energySupplier,
    name: this.meteringPointDetails()?.commercialRelation?.energySupplierName?.value,
    validFrom: this.meteringPointDetails()?.commercialRelation?.activeEnergySupplyPeriod?.validFrom,
  }));
}
