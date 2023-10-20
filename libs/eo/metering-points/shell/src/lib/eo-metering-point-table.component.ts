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

import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { WATT_TABLE, WattTableDataSource, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WATT_MODAL, WattModalService } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { EoMeteringPoint } from '@energinet-datahub/eo/metering-points/domain';
import { EoMeteringPointType } from '@energinet-datahub/eo/shared/domain';

@Component({
  standalone: true,
  imports: [WATT_MODAL, WattButtonComponent],
  template: `
    <watt-modal
      #modal
      title="Not all metering points can be enabled"
      closeLabel="Close modal"
      size="small"
    >
      <p>A metering point must have a wind or solar source to become eligible for activation.</p>
      <watt-modal-actions>
        <watt-button (click)="modal.close(false)">Close</watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
class GranularCertificateHelperComponent {}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    AsyncPipe,
    WattBadgeComponent,
    WattSpinnerComponent,
    WATT_TABLE,
    WattPaginatorComponent,
    WattEmptyStateComponent,
    MatSlideToggleModule,
  ],
  providers: [WattModalService],
  standalone: true,
  selector: 'eo-metering-points-table',
  styles: [
    `
      :host {
        --mdc-switch-selected-track-color: var(--watt-color-primary);
        --mdc-switch-selected-hover-track-color: var(--watt-color-primary);
        --mdc-switch-selected-focus-track-color: var(--watt-color-primary);
      }

      watt-empty-state {
        padding: var(--watt-space-l);
      }

      watt-paginator {
        display: block;
        margin: 0 -24px -24px -24px;
      }
    `,
  ],
  template: `
    <watt-table [loading]="loading" [columns]="columns" [dataSource]="dataSource">
      <!-- ADDRESS Column -->
      <ng-container *wattTableCell="columns.address; let meteringPoint">
        <ng-container *ngIf="meteringPoint.address?.address1">
          {{ meteringPoint.address.address1 + ',' }}
        </ng-container>
        <ng-container *ngIf="meteringPoint.address?.address2">
          {{ meteringPoint.address.address2 + ',' }}
        </ng-container>
        <ng-container *ngIf="meteringPoint.address?.locality">
          {{ meteringPoint.address.locality + ',' }}
        </ng-container>
        {{ meteringPoint?.address?.postalCode }}
        {{ meteringPoint?.address?.city }}
      </ng-container>

      <ng-container *wattTableCell="columns.unit; let meteringPoint">
        <watt-badge type="neutral">{{ meteringPoint.type }}</watt-badge>
      </ng-container>

      <!-- GRANULAR CERTIFICATES Column -->
      <ng-container *wattTableCell="columns.gc; let meteringPoint">
        <div
          *ngIf="
            meteringPoint.type === 'consumption' ||
            (meteringPoint.type === 'production' &&
              (meteringPoint.assetType === 'Wind' || meteringPoint.assetType === 'Solar'))
          "
          style="display: flex; align-items: center;"
        >
          <mat-slide-toggle
            (change)="
              toggleContract.emit({
                checked: $event.checked,
                gsrn: meteringPoint.gsrn,
                type: meteringPoint.type
              })
            "
            [disabled]="meteringPoint.loadingContract"
            [checked]="meteringPoint.contract && !meteringPoint.loadingContract"
          ></mat-slide-toggle>
          <watt-spinner
            [diameter]="24"
            style="margin-left: var(--watt-space-m);"
            [style.opacity]="meteringPoint.loadingContract ? 1 : 0"
          ></watt-spinner>
        </div>
      </ng-container>
    </watt-table>

    <watt-empty-state
      *ngIf="loading === false && dataSource.data.length === 0 && !hasError"
      icon="custom-power"
      title="No metering points found"
      message="You do not have any metering points."
    ></watt-empty-state>

    <watt-empty-state
      *ngIf="loading === false && hasError"
      icon="custom-power"
      title="Oops! Something went wrong."
      message="Please try reloading the page.."
    ></watt-empty-state>

    <watt-paginator [for]="dataSource" />
  `,
})
export class EoMeteringPointsTableComponent {
  dataSource: WattTableDataSource<EoMeteringPoint> = new WattTableDataSource(undefined);
  columns: WattTableColumnDef<EoMeteringPoint> = {
    gsrn: { accessor: 'gsrn', header: 'Metering point' },
    address: { accessor: (meteringPoint) => meteringPoint.address.address1 },
    unit: { accessor: (meteringPoint) => meteringPoint.type },
    source: { accessor: (meteringPoint) => meteringPoint.assetType },
    type: { accessor: (meteringPoint) => meteringPoint.subMeterType },
    gc: {
      accessor: (meteringPoint) => {
        const itemHasActiveContract = meteringPoint.contract ? 'active' : 'enable';
        return meteringPoint.type === 'production' ? itemHasActiveContract : '';
      },
      header: 'On/Off',
      align: 'center',
      helperAction: () => this.onToggleGranularCertificatesHelperText(),
    },
  };

  @Input() set meteringPoints(data: EoMeteringPoint[] | null) {
    this.dataSource.data = data || [];
  }
  @Input() loading = false;
  @Input() hasError = false;
  @Output() toggleContract = new EventEmitter<{
    checked: boolean;
    gsrn: string;
    type: EoMeteringPointType;
  }>();

  private modalService = inject(WattModalService);

  onToggleGranularCertificatesHelperText() {
    this.modalService.open({
      component: GranularCertificateHelperComponent,
    });
  }
}
