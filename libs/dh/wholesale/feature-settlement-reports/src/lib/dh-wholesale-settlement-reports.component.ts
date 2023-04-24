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
import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy, OnInit } from '@angular/core';
import { PushModule } from '@rx-angular/template/push';
import { LetModule } from '@rx-angular/template/let';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';

import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattToastService } from '@energinet-datahub/watt/toast';

import {
  DhWholesaleTableComponent,
  settlementReportsTableColumns,
} from './table/dh-wholesale-table.component';
import { DhWholesaleFormComponent } from './form/dh-wholesale-form.component';
import { WattTopBarComponent } from '@energinet-datahub/watt/top-bar';
import { Subject, takeUntil } from 'rxjs';
import { Apollo } from 'apollo-angular';
import {
  MarketParticipantFilteredActorDto,
  graphql,
  WholesaleSettlementReportHttp,
} from '@energinet-datahub/dh/shared/domain';
import sub from 'date-fns/sub';
import { SettlementReport } from '@energinet-datahub/dh/wholesale/domain';
import '@energinet-datahub/watt/button.svelte';

@Component({
  selector: 'dh-wholesale-settlement-reports',
  standalone: true,
  imports: [
    CommonModule,
    DhFeatureFlagDirectiveModule,
    DhWholesaleFormComponent,
    DhWholesaleTableComponent,
    LetModule,
    PushModule,
    TranslocoModule,
    WattEmptyStateComponent,
    WattSpinnerModule,
    WattTopBarComponent,
    WattCardModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dh-wholesale-settlement-reports.component.html',
  styleUrls: ['./dh-wholesale-settlement-reports.component.scss'],
})
export class DhWholesaleSettlementReportsComponent implements OnInit, OnDestroy {
  private document = inject(DOCUMENT);
  private apollo = inject(Apollo);
  private destroy$ = new Subject<void>();
  private selectedProcessTypes: graphql.ProcessType[] | null = null;
  private selectedGridAreas?: string[];
  private selectedActor?: MarketParticipantFilteredActorDto;
  private toastService = inject(WattToastService);
  private translations = inject(TranslocoService);
  private wholesaleSettlementReportHttp = inject(WholesaleSettlementReportHttp);

  loading = false;
  error = false;
  data: settlementReportsTableColumns[] = [];
  executionTime = {
    start: sub(new Date().setHours(0, 0, 0, 0), { days: 10 }).toISOString(),
    end: new Date().toISOString(),
  };

  query = this.apollo.watchQuery({
    fetchPolicy: 'cache-only',
    nextFetchPolicy: 'cache-first',
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetSettlementReportsDocument,
    variables: { executionTime: this.executionTime },
  });

  ngOnInit() {
    this.query.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        this.loading = result.loading;
        this.data = result.data?.settlementReports
          ?.filter((x) => {
            if (!this.selectedProcessTypes || this.selectedProcessTypes?.length === 0) return true;
            return this.selectedProcessTypes?.includes(x.processType);
          })
          ?.filter((x) => {
            if (this.selectedGridAreas && this.selectedGridAreas.length > 0) {
              return this.selectedGridAreas.includes(x.gridArea.code);
            } else {
              return true;
            }
          })
          .map((x) => {
            // Only enable download for grid access providers
            const download = !!this.selectedActor?.marketRoles?.includes('GridAccessProvider');
            return { ...x, download };
          });
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange(filters: any) {
    this.selectedProcessTypes = filters.processTypes;
    this.selectedGridAreas = filters.gridAreas;
    this.selectedActor = filters.actor;
    this.query.refetch({
      executionTime: filters.executionTime,
      period: filters.period,
    });
  }

  onDownload(settlementReport: SettlementReport) {
    this.wholesaleSettlementReportHttp
      .v1WholesaleSettlementReportGet(settlementReport.batchNumber, settlementReport.gridArea.code)
      .subscribe({
        next: (data) => {
          const blob = new Blob([data as unknown as BlobPart], {
            type: 'application/zip',
          });
          const basisData = window.URL.createObjectURL(blob);
          const link = this.document.createElement('a');
          link.href = basisData;
          link.download = `${settlementReport.batchNumber}.zip`;
          link.click();
        },
        error: () => {
          this.toastService.open({
            type: 'danger',
            message: this.translations.translate('wholesale.settlementReports.downloadFailed'),
          });
        },
      });
  }
}
