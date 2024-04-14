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
import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
  inject,
  OnInit,
  Input,
  signal,
  effect,
} from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_TABLE, WattTableDataSource, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WattDatePipe, dayjs } from '@energinet-datahub/watt/date';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { Calculation } from '@energinet-datahub/dh/wholesale/domain';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import {
  VaterFlexComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { DhCalculationsFiltersComponent } from '../filters/filters.component';
import { Apollo } from 'apollo-angular';
import {
  GetCalculationsDocument,
  CalculationQueryInput,
  OnCalculationProgressDocument,
  GetCalculationsQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';

type wholesaleTableData = WattTableDataSource<Calculation>;

@Component({
  standalone: true,
  imports: [
    TranslocoDirective,
    VaterFlexComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    WATT_TABLE,
    WattDatePipe,
    WattBadgeComponent,
    WattButtonComponent,
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattEmptyStateComponent,
    DhCalculationsFiltersComponent,
    DhEmDashFallbackPipe,
  ],
  selector: 'dh-calculations-table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhCalculationsTableComponent implements OnInit {
  private apollo = inject(Apollo);

  @Input() id?: string;
  @Output() selectedRow = new EventEmitter();
  @Output() create = new EventEmitter<void>();

  loading = false;
  error = false;

  filter = signal<CalculationQueryInput>({
    executionTime: {
      start: dayjs().startOf('day').subtract(10, 'days').toDate(),
      end: dayjs().endOf('day').toDate(),
    },
  });

  query = this.apollo.watchQuery({
    fetchPolicy: 'network-only',
    query: GetCalculationsDocument,
    variables: { input: this.filter() },
  });

  // The subscription returned by `subscribeToMore` is automatically disposed
  // when the dependent query is stopped, so no need to manually unsubscribe.
  subscription = this.query.subscribeToMore({
    document: OnCalculationProgressDocument,
    updateQuery: (prev, options) =>
      this.updateQuery(prev, options.subscriptionData.data.calculationProgress),
  });

  refetch = effect(() => this.query.refetch({ input: this.filter() }));

  dataSource: wholesaleTableData = new WattTableDataSource(undefined);
  columns: WattTableColumnDef<Calculation> = {
    startedBy: { accessor: 'createdByUserName' },
    periodFrom: { accessor: (calculation) => calculation.period?.start },
    periodTo: { accessor: (calculation) => calculation.period?.end },
    executionTime: { accessor: 'executionTimeStart' },
    calculationType: { accessor: 'calculationType' },
    status: { accessor: 'executionState' },
  };

  getActiveRow = () => this.dataSource.data.find((row) => row.id === this.id);

  updateQuery = (prev: GetCalculationsQuery, calculation: Calculation) => {
    // Check if the updated calculation is already in the cache
    const isExistingCalculation = prev.calculations.some((c) => c.id === calculation.id);

    // If the calculation exists, update it with the new values
    const calculations = isExistingCalculation
      ? prev.calculations.map((c) => (c.id === calculation.id ? calculation : c))
      : prev.calculations;

    // If it was an update, replace the cached calculations with the updated array
    if (isExistingCalculation) return { ...prev, calculations };

    // Reaching this point means that the calculation is new. Add it to the cache if
    // the current filter is a live query (arbitrarily defined as a query with an end
    // date in the future and with no other filters applied). This is the default state
    // of the query when first entering the page. The reason for this is to avoid having
    // the table rows change position when viewing the data with different filters.
    const input = this.filter();
    const isLiveQuery =
      input.executionTime?.end && Object.values(input).filter(Boolean).length === 1
        ? input.executionTime.end > new Date()
        : false;

    // Add the new calculation to the top of the list if it was a live query
    return { ...prev, calculations: isLiveQuery ? [calculation, ...calculations] : calculations };
  };

  ngOnInit() {
    this.query.valueChanges.subscribe({
      next: (result) => {
        this.loading = result.loading;
        this.error = !!result.errors;
        if (result.data?.calculations) this.dataSource.data = result.data.calculations;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      },
    });
  }
}
