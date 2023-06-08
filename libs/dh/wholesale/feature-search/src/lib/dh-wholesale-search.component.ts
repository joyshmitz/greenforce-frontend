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
import { Component, inject, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';
import { sub, startOfDay, endOfDay } from 'date-fns';
import { Subject, map, takeUntil } from 'rxjs';

import { graphql } from '@energinet-datahub/dh/shared/domain';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattDateRangeChipComponent } from '@energinet-datahub/watt/datepicker';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

import { DhWholesaleTableComponent } from './table/dh-wholesale-table.component';
import { DhWholesaleFormComponent } from './form/dh-wholesale-form.component';
import { DhWholesaleBatchDetailsComponent } from './batch-details/dh-wholesale-batch-details.component';
import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { PushModule } from '@rx-angular/template/push';

type Batch = Omit<graphql.Batch, 'gridAreas'>;

@Component({
  selector: 'dh-wholesale-search',
  standalone: true,
  imports: [
    CommonModule,
    DhWholesaleBatchDetailsComponent,
    DhWholesaleFormComponent,
    DhWholesaleTableComponent,
    FormsModule,
    TranslocoModule,
    WATT_FORM_FIELD,
    WattDateRangeChipComponent,
    WattDropdownComponent,
    WattEmptyStateComponent,
    WattSpinnerComponent,
    PushModule,
  ],
  templateUrl: './dh-wholesale-search.component.html',
  styleUrls: ['./dh-wholesale-search.component.scss'],
})
export class DhWholesaleSearchComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('batchDetails')
  batchDetails!: DhWholesaleBatchDetailsComponent;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private apollo = inject(Apollo);
  private destroy$ = new Subject<void>();

  private routerBatchId = this.route.snapshot.queryParams.batch;
  private startedByFilter = '';

  selectedBatch?: Batch;
  executionTime = {
    start: sub(startOfDay(new Date()), { days: 10 }).toISOString(),
    end: endOfDay(new Date()).toISOString(),
  };

  query = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetBatchesDocument,
    variables: { executionTime: this.executionTime },
  });

  error = false;
  loading = false;
  batches?: Batch[];

  private transloco = inject(TranslocoService);
  processTypes: graphql.ProcessType[] = [];
  processTypeOptions = this.transloco.selectTranslateObject('wholesale').pipe(
    map(
      (t) =>
        [
          { displayValue: t.BALANCE_FIXING, value: graphql.ProcessType.BalanceFixing },
          { displayValue: t.AGGREGATION, value: graphql.ProcessType.Aggregation },
        ] satisfies WattDropdownOptions
    )
  );

  gridAreaCodes: string[] = [];
  gridAreaOptions = this.apollo
    .watchQuery({ query: graphql.GetGridAreasDocument })
    .valueChanges.pipe(
      map((result) => result.data?.gridAreas),
      exists(),
      map((gridAreas) =>
        gridAreas.map((gridArea) => ({
          value: gridArea.code,
          displayValue: `${gridArea.name} (${gridArea.code})`,
        }))
      )
    );

  ngOnInit() {
    this.query.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        this.loading = result.loading;

        if (result.data?.batches) {
          if (this.startedByFilter) {
            this.batches = result.data.batches.filter((batch) =>
              batch.createdByUserName.includes(this.startedByFilter)
            );
          } else {
            this.batches = result.data.batches;
          }
        }

        this.selectedBatch = this.batches?.find((batch) => batch.id === this.routerBatchId);
        this.error = !!result.errors;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      },
    });
  }

  ngAfterViewInit() {
    if (this.routerBatchId) this.batchDetails.open(this.routerBatchId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch({
    executionTime,
    startedBy,
  }: {
    executionTime: { start: string; end: string };
    startedBy: string;
  }) {
    this.startedByFilter = startedBy;
    this.query.refetch({ executionTime });
  }

  onBatchSelected(batch: Batch) {
    this.selectedBatch = batch;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { batch: batch.id },
    });

    this.batchDetails.open(batch.id);
  }

  onBatchDetailsClosed() {
    this.selectedBatch = undefined;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { batch: null },
    });
  }
}
