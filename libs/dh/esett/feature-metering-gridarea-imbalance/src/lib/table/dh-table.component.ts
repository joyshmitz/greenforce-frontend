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
import { Component, EventEmitter, Input, ViewChild, Output } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhMeteringGridAreaImbalance } from '../dh-metering-gridarea-imbalance';
import { DhMeteringGridAreaImbalanceDrawerComponent } from '../drawer/dh-drawer.component';
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
    TranslocoDirective,
    TranslocoPipe,

    DhMeteringGridAreaImbalanceDrawerComponent,

    WATT_TABLE,
    WattPaginatorComponent,
    WattEmptyStateComponent,
    WattDatePipe,
    VaterFlexComponent,
    VaterStackComponent,
  ],
})
export class DhMeteringGridAreaImbalanceTableComponent {
  activeRow: DhMeteringGridAreaImbalance | undefined = undefined;

  @ViewChild(DhMeteringGridAreaImbalanceDrawerComponent)
  drawer!: DhMeteringGridAreaImbalanceDrawerComponent;

  columns: WattTableColumnDef<DhMeteringGridAreaImbalance> = {
    documentDateTime: { accessor: 'documentDateTime' },
    receivedDateTime: { accessor: 'receivedDateTime' },
    id: { accessor: 'id' },
    gridArea: { accessor: 'gridArea' },
    period: { accessor: null },
  };

  @Input() isLoading!: boolean;
  @Input() hasError!: boolean;

  @Input() tableDataSource!: WattTableDataSource<DhMeteringGridAreaImbalance>;
  @Input() sortMetadata!: Sort;

  @Output() sortChange = new EventEmitter<Sort>();

  onRowClick(activeRow: DhMeteringGridAreaImbalance): void {
    this.activeRow = activeRow;
    this.drawer.open(activeRow);
  }

  onClose(): void {
    this.activeRow = undefined;
  }
}
