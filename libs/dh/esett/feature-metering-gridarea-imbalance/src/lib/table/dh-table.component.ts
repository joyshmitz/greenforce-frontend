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
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhMeteringGridAreaImbalance } from '../dh-metering-gridarea-imbalance';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'dh-metering-gridarea-imbalance-table',
  standalone: true,
  templateUrl: './dh-table.component.html',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  imports: [
    NgIf,
    TranslocoDirective,
    TranslocoPipe,

    WATT_TABLE,
    WattPaginatorComponent,
    WattEmptyStateComponent,
    WattDatePipe,
    VaterFlexComponent,
    VaterStackComponent,
  ],
})
export class DhOutgoingMessagesTableComponent {
  activeRow: DhMeteringGridAreaImbalance | undefined = undefined;

  columns: WattTableColumnDef<DhMeteringGridAreaImbalance> = {
    documentDateTime: { accessor: 'documentDateTime' },
    receivedDateTime: { accessor: 'receivedDateTime' },
    id: { accessor: 'id' },
    gridArea: { accessor: 'gridAreaCode' },
    period: { accessor: null },
  };

  @Input() isLoading!: boolean;
  @Input() hasError!: boolean;

  @Input() tableDataSource!: WattTableDataSource<DhMeteringGridAreaImbalance>;

  @Output() sortChange = new EventEmitter<Sort>();

  onRowClick(activeRow: DhMeteringGridAreaImbalance): void {
    this.activeRow = activeRow;
  }

  onClose(): void {
    this.activeRow = undefined;
  }
}
