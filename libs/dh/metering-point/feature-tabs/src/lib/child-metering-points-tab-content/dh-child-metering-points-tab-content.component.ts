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
import { NgIf } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { TranslocoModule } from '@ngneat/transloco';
import { Router, RouterModule } from '@angular/router';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { DhStatusBadgeComponent } from '@energinet-datahub/dh/metering-point/ui-status-badge';
import { MeteringPointSimpleCimDto } from '@energinet-datahub/dh/shared/domain';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-child-metering-points-tab-content',
  templateUrl: './dh-child-metering-points-tab-content.component.html',
  styleUrls: ['./dh-child-metering-points-tab-content.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    TranslocoModule,
    DhStatusBadgeComponent,
    WattIconComponent,
    MatSortModule,
    WattEmptyStateComponent,
    WATT_TABLE,
    RouterModule,
    WattDatePipe,
  ],
})
export class DhChildMeteringPointsTabContentComponent {
  @Input()
  childMeteringPoints: Array<MeteringPointSimpleCimDto> | null | undefined;

  columns: WattTableColumnDef<MeteringPointSimpleCimDto> = {
    childMeteringPoint: { accessor: 'gsrnNumber' },
    effectivePeriod: { accessor: 'effectiveDate' },
    status: { accessor: 'connectionState' },
  };

  router = inject(Router);
  dataSource = new WattTableDataSource<MeteringPointSimpleCimDto>();
}
