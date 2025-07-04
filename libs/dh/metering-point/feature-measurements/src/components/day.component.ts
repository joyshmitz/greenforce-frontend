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
import { Component, computed, effect, inject, input, LOCALE_ID, signal } from '@angular/core';

import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { WattSupportedLocales } from '@energinet-datahub/watt/date';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { Quality, GetMeasurementsDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhCircleComponent } from './circle.component';
import { DhMeasurementsDayFilterComponent } from './day-filter.component';
import { MeasurementPosition, MeasurementsQueryVariables } from '../types';
import { DhMeasurementsDayDetailsComponent } from './day-details.component';
import { DhFormatObservationTimePipe } from './format-observation-time.pipe';
import { dhFormatMeasurementNumber } from '../utils/dh-format-measurement-number';

@Component({
  selector: 'dh-measurements-day',
  imports: [
    TranslocoDirective,
    WATT_TABLE,
    WattDataTableComponent,
    WattDataFiltersComponent,
    DhCircleComponent,
    DhFormatObservationTimePipe,
    DhMeasurementsDayFilterComponent,
    DhMeasurementsDayDetailsComponent,
  ],
  template: `
    <watt-data-table
      [enableSearch]="false"
      [enableCount]="false"
      [error]="query.error()"
      [ready]="query.called()"
      [enablePaginator]="false"
      *transloco="let t; read: 'meteringPoint.measurements'"
    >
      <watt-data-filters>
        <dh-measurements-day-filter (filter)="fetch($event)" />
      </watt-data-filters>
      <watt-table
        *transloco="let resolveHeader; read: 'meteringPoint.measurements.columns'"
        [resolveHeader]="resolveHeader"
        [columns]="columns()"
        [dataSource]="dataSource"
        [loading]="query.loading()"
        sortDirection="desc"
        [sortClear]="false"
        [stickyFooter]="true"
        [activeRow]="activeRow()"
        (rowClick)="activeRow.set($event)"
      >
        <ng-container *wattTableCell="columns().observationTime; let element">
          {{
            element.observationTime
              | dhFormatObservationTime: element.current?.resolution ?? element.resolution
          }}
        </ng-container>

        <ng-container *wattTableCell="columns().currentQuantity; let element">
          @let current = element.current;

          @if (current) {
            @if (
              current.quality === Quality.Estimated &&
              current.quantity !== null &&
              current.quantity !== undefined
            ) {
              ≈
            }
            {{ formatNumber(current.quantity) }}
          }
        </ng-container>

        <ng-container *wattTableCell="columns().hasQuantityOrQualityChanged; let element">
          @if (element.hasQuantityOrQualityChanged) {
            <dh-circle />
          }
        </ng-container>
      </watt-table>
    </watt-data-table>

    @let selectedRow = activeRow();

    @if (selectedRow) {
      <dh-measurements-day-details
        [selectedDay]="selectedDay()"
        [meteringPointId]="meteringPointId()"
        [measurementPosition]="selectedRow"
        (closed)="activeRow.set(undefined)"
      />
    }
  `,
})
export class DhMeasurementsDayComponent {
  private readonly actor = inject(DhActorStorage);
  private readonly transloco = inject(TranslocoService);
  private readonly locale = inject<WattSupportedLocales>(LOCALE_ID);
  private readonly sum = computed(
    () =>
      `${this.formatNumber(
        this.measurements()
          .map((x) => x.current?.quantity)
          .filter((quantity) => quantity !== null && quantity !== undefined)
          .reduce((acc, quantity) => acc + Number(quantity), 0)
      )} ${this.unit()}`
  );
  private readonly unit = computed(() => {
    const currentMeasurement = this.measurements()[0]?.current;
    if (!currentMeasurement) return '';
    return this.transloco.translate('meteringPoint.measurements.units.' + currentMeasurement.unit);
  });
  query = lazyQuery(GetMeasurementsDocument);
  meteringPointId = input.required<string>();

  dataSource = new WattTableDataSource<MeasurementPosition>([]);
  activeRow = signal<MeasurementPosition | undefined>(undefined);

  measurements = computed(() => this.query.data()?.measurements.measurementPositions ?? []);
  selectedDay = computed(() => this.query.getOptions().variables?.date);

  showHistoricValues = signal(false);

  Quality = Quality;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  columns = computed<WattTableColumnDef<MeasurementPosition>>(() => {
    const measurements = this.measurements();
    const numberOfColumnsNeeded = Math.max(0, ...measurements.map((x) => x.historic.length));
    const showHistoricValues = this.showHistoricValues();
    const columns: WattTableColumnDef<MeasurementPosition> = {
      position: {
        accessor: 'index',
        footer: { value: signal(this.transloco.translate('meteringPoint.measurements.sum')) },
      },
      observationTime: { accessor: 'observationTime' },
      currentQuantity: {
        accessor: (row) => row.current?.quantity ?? '',
        align: 'right',
        footer: { value: this.sum },
      },
      hasQuantityOrQualityChanged: {
        header: '',
        size: showHistoricValues && numberOfColumnsNeeded > 0 ? '100px' : '1fr',
        accessor: null,
      },
    };

    if (numberOfColumnsNeeded === 0 || !showHistoricValues) return columns;

    for (let i = 0; i < numberOfColumnsNeeded; i++) {
      columns[`column-${i}`] = {
        accessor: null,
        cell: (value) =>
          `${value.historic[i]?.quality === Quality.Estimated ? '≈' : ''} ${value.historic[i]?.quantity != undefined ? this.formatNumber(value.historic[i]?.quantity) : ''}`,
        header: '',
        size: 'auto',
        align: 'right',
      };

      if (i + 1 === numberOfColumnsNeeded) {
        columns[`column-spacer`] = {
          accessor: null,
          header: '',
          size: '1fr',
        };
      }
    }

    return columns;
  });

  constructor() {
    effect(() => {
      this.dataSource.data = this.measurements();
    });
  }

  fetch(variables: MeasurementsQueryVariables) {
    const withMeteringPointId = {
      ...variables,
      meteringPointId: this.meteringPointId(),
      actorNumber: this.actor.getSelectedActor().gln,
      marketRole: this.actor.getSelectedActor().marketRole,
    };

    this.showHistoricValues.set(variables.showHistoricValues ?? false);

    this.query.refetch(withMeteringPointId);
  }

  formatNumber(value: number | null | undefined) {
    return dhFormatMeasurementNumber(value, this.locale);
  }
}
