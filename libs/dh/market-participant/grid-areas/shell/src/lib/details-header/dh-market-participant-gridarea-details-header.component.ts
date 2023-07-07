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
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { GridAreaOverviewRow } from '@energinet-datahub/dh/market-participant/data-access-api';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'dh-market-participant-gridarea-details-header',
  styleUrls: ['./dh-market-participant-gridarea-details-header.component.scss'],
  templateUrl: './dh-market-participant-gridarea-details-header.component.html',
  standalone: true,
  imports: [CommonModule, TranslocoModule, DhEmDashFallbackPipe, WattDatePipe, MatDividerModule],
})
export class DhMarketParticipantGridAreaDetailsHeaderComponent {
  @Input() gridArea?: GridAreaOverviewRow;
}