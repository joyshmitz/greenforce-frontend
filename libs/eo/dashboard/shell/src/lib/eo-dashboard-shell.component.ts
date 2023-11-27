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
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { EoAggregateService } from '@energinet-datahub/eo/wallet/data-access-api';

import { EoDashboardConsumptionComponent } from './eo-dashboard-consumption.component';
import { EoDashboardProductionTransferredComponent } from './eo-dashboard-production-transferred.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: var(--watt-space-m);
        @include watt.media('>=Large') {
          gap: var(--watt-space-l);
        }
      }
    `,
  ],
  imports: [EoDashboardConsumptionComponent, EoDashboardProductionTransferredComponent],
  selector: 'eo-dashboard-shell',
  template: `
    <eo-dashboard-production-transferred />
    <eo-dashboard-consumption />
  `,
})
export class EoDashboardShellComponent implements OnInit {
  private aggregateService: EoAggregateService = inject(EoAggregateService);

  ngOnInit(): void {
    this.aggregateService.clearCache();
  }
}
