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
import { DatePipe, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SharedUtilities } from '@energinet-datahub/eo/shared/utilities';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { EoTransfersDrawerComponent } from './eo-transfers-drawer.component';
import { EoTransfersModalComponent } from './eo-transfers-modal.component';
import { EoListedTransfer } from './eo-transfers.service';
import { EoTransfersStore } from './eo-transfers.store';

interface EoTransferTableElement extends EoListedTransfer {
  period?: string;
  status?: boolean;
}

@Component({
  selector: 'eo-transfers-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    WattBadgeComponent,
    WattButtonComponent,
    WattPaginatorComponent,
    WattDropdownComponent,
    ReactiveFormsModule,
    WATT_FORM_FIELD,
    WATT_TABLE,
    EoTransfersDrawerComponent,
    EoTransfersModalComponent,
  ],
  styles: [
    `
      .card-header {
        display: flex;
        justify-content: space-between;

        .actions {
          gap: 16px;
          display: flex;
        }
      }

      .search-filters {
        watt-form-field {
          margin-top: 0;
        }

        ::ng-deep .mat-form-field-appearance-legacy .mat-form-field-wrapper {
          padding-bottom: 0;
        }

        ::ng-deep
          .mat-form-field-type-mat-select:not(.mat-form-field-disabled)
          .mat-form-field-flex {
          margin-top: 0;
        }
      }

      .no-data {
        text-align: center;
        padding: var(--watt-space-m);
      }
    `,
  ],
  template: `
    <div class="card-header">
      <h3>Transfer agreements</h3>
      <div class="actions">
        <watt-button
          data-testid="download-button"
          [disabled]="true"
          icon="fileDownload"
          variant="text"
          >Download</watt-button
        >
        <watt-button
          data-testid="new-agreement-button"
          icon="plus"
          variant="secondary"
          (click)="transfersModal.open()"
        >
          New transfer agreement
        </watt-button>
      </div>
    </div>
    <div class="search-filters watt-space-stack-s">
      <form [formGroup]="filterForm">
        <watt-form-field>
          <watt-dropdown
            [chipMode]="true"
            placeholder="Status"
            formControlName="statusFilter"
            (ngModelChange)="applyFilters()"
            [options]="[
              { value: 'true', displayValue: 'Active' },
              { value: 'false', displayValue: 'Inactive' }
            ]"
          ></watt-dropdown>
        </watt-form-field>
      </form>
    </div>
    <watt-table
      #table
      [columns]="columns"
      [dataSource]="dataSource"
      sortBy="recipient"
      sortDirection="asc"
      [sortClear]="false"
      (rowClick)="onRowClick($event)"
      [activeRow]="activeRow"
      class="watt-space-stack-s"
      data-testid="transfers-table"
    >
      <!-- Period - Custom column -->
      <ng-container *wattTableCell="table.columns['period']; let element">
        {{ element.startDate | date : 'dd/MM/yyyy' }} -
        {{ utils.checkForMidnightInLocalTime(element.endDate) | date : 'dd/MM/yyyy' }}
      </ng-container>

      <!-- Status - Custom column -->
      <ng-container *wattTableCell="table.columns['status']; let element">
        <watt-badge *ngIf="utils.isDateActive(element.endDate); else notActive" type="success">
          Active
        </watt-badge>
      </ng-container>
    </watt-table>

    <!-- No Data to show -->
    <p *ngIf="dataSource.data.length < 1" class="watt-space-stack-s no-data">
      You do not have any transfer agreements to show right now.
    </p>

    <watt-paginator
      data-testid="table-paginator"
      [pageSize]="10"
      [pageSizeOptions]="[10, 25, 50, 100, 250]"
      [for]="dataSource"
    >
    </watt-paginator>
    <ng-template #notActive><watt-badge type="neutral">Inactive</watt-badge></ng-template>

    <eo-transfers-modal title="New transfer agreement"></eo-transfers-modal>
    <eo-transfers-drawer></eo-transfers-drawer>
  `,
})
export class EoTransfersTableComponent implements AfterViewInit {
  @ViewChild(EoTransfersDrawerComponent) transfersDrawer!: EoTransfersDrawerComponent;
  @ViewChild(EoTransfersModalComponent) transfersModal!: EoTransfersModalComponent;

  filterForm = this.fb.group({ statusFilter: '' });
  transfers: EoListedTransfer[] = [];
  activeRow: EoListedTransfer | undefined = undefined;
  dataSource = new WattTableDataSource<EoTransferTableElement>();
  columns = {
    receiver: { accessor: 'receiverTin' },
    period: { accessor: (transfer) => transfer.startDate },
    status: { accessor: (transfer) => this.utils.isDateActive(transfer.endDate) },
  } as WattTableColumnDef<EoTransferTableElement>;

  constructor(
    private store: EoTransfersStore,
    private fb: FormBuilder,
    public utils: SharedUtilities
  ) {}

  ngAfterViewInit() {
    this.loadData();
  }

  applyFilters() {
    this.dataSource.data = this.transfers.filter((transfer) =>
      this.filterByStatus(transfer.endDate)
    );
  }

  filterByStatus(endDate: string): boolean {
    if (this.filterForm.controls['statusFilter'].value === null) return true;
    return (
      this.filterForm.controls['statusFilter'].value === this.utils.isDateActive(endDate).toString()
    );
  }

  loadData() {
    this.store.transfers$.subscribe((transfers) => {
      this.transfers = transfers;
      this.populateTable();
    });
  }

  populateTable() {
    this.dataSource.data = this.transfers;
  }

  onRowClick(row: EoListedTransfer): void {
    this.activeRow = row;
    this.transfersDrawer.open(row);
  }
}
