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

import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { EMPTY, catchError, forkJoin } from 'rxjs';
import { DatePipe, NgIf } from '@angular/common';

import { WATT_CARD } from '@energinet-datahub/watt/card';

import { EoCertificatesService } from '@energinet-datahub/eo/certificates/data-access-api';
import { EoTimeAggregate } from '@energinet-datahub/eo/shared/domain';
import { EoClaimsService } from '@energinet-datahub/eo/claims/data-access-api';
import {
  EnergyUnitPipe,
  energyUnit,
  findNearestUnit,
  fromWh,
} from '@energinet-datahub/eo/shared/utilities';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  eachDayOfInterval,
  endOfToday,
  fromUnixTime,
  getUnixTime,
  startOfToday,
  subDays,
} from 'date-fns';
@Component({
  standalone: true,
  imports: [
    WATT_CARD,
    NgChartsModule,
    LottieComponent,
    NgIf,
    EnergyUnitPipe,
    WattEmptyStateComponent,
    WattButtonComponent,
  ],
  providers: [EnergyUnitPipe],
  selector: 'eo-dashboard-consumption',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        display: block;
        max-width: 100%;

        h5 {
          // TODO: NEW FONT STYLES
          font-size: 30px;
          line-height: 28px;
          color: var(--watt-on-light-high-emphasis);
          font-weight: 400;
        }

        small {
          color: var(--watt-on-light-low-emphasis);
        }

        .chart-container {
          position: relative;
          width: calc(100vw - 80px);
          height: 196px;
          padding-top: var(--watt-space-m);
          max-width: 100%;

          @include watt.media('>=Large') {
            width: calc(100vw - 372px);
          }
        }

        .loader-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
        }

        watt-card {
          position: relative;
        }
      }
    `,
  ],
  template: `<watt-card>
    <watt-card-title>
      <h4>Green consumption</h4>
    </watt-card-title>

    <div class="loader-container" *ngIf="isLoading || hasError">
      <ng-lottie height="64px" width="64px" [options]="options" *ngIf="isLoading" />
      <watt-empty-state
        *ngIf="hasError"
        icon="custom-power"
        title="An unexpected error occured"
        message="Try again or contact your system administrator if you keep getting this error."
      >
        <watt-button variant="primary" size="normal" (click)="getData()">Reload</watt-button>
      </watt-empty-state>
    </div>

    <ng-container>
      <h5>{{ claimedTotal | energyUnit }}</h5>
      <small>Out of {{ consumptionTotal | energyUnit }} total consumption</small>
    </ng-container>

    <div class="chart-container">
      <canvas
        baseChart
        [data]="barChartData"
        [options]="barChartOptions"
        [legend]="false"
        [type]="'bar'"
      >
      </canvas>
    </div>
  </watt-card>`,
})
export class EoDashboardConsumptionComponent implements OnInit {
  private cd = inject(ChangeDetectorRef);
  private certificatesService = inject(EoCertificatesService);
  private claimsService = inject(EoClaimsService);
  private energyUnitPipe = inject(EnergyUnitPipe);

  private startDate = getUnixTime(subDays(startOfToday(), 30)); // 30 days ago at 00:00
  private endDate = getUnixTime(endOfToday()); // Today at 23:59
  private labels = this.generateLabels();

  protected claimedTotal = 0;
  protected consumptionTotal = 0;

  protected options: AnimationOptions = {
    path: '/assets/graph-loader.json',
  };
  protected isLoading = false;
  protected hasError = false;

  protected barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.labels,
    datasets: [],
  };
  protected barChartOptions: ChartConfiguration<'bar'>['options'] = {
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: {
          maxRotation: 0,
          autoSkipPadding: 12,
        },
      },
      y: {
        stacked: true,
        title: { display: true, text: 'Wh', align: 'end' },
      },
    },
  };

  ngOnInit(): void {
    this.getData();
  }

  protected getData() {
    this.isLoading = true;
    this.hasError = false;

    const claims$ = this.claimsService.getAggregatedClaims(
      EoTimeAggregate.Day,
      this.startDate,
      this.endDate
    );
    const certificates$ = this.certificatesService.getAggregatedCertificates(
      EoTimeAggregate.Day,
      this.startDate,
      this.endDate
    );

    forkJoin([claims$, certificates$])
      .pipe(
        catchError(() => {
          this.isLoading = false;
          this.hasError = true;
          this.cd.detectChanges();
          return EMPTY;
        })
      )
      .subscribe((data) => {
        const [claims, certificates] = data;

        this.claimedTotal = claims.reduce((a, b) => a + b, 0);
        this.consumptionTotal = certificates.reduce((a, b) => a + b, 0);
        const unit: energyUnit = findNearestUnit(
          Math.max(this.claimedTotal, this.consumptionTotal) / this.labels.length
        )[1];

        const consumptions = certificates.map((certificate, index) => {
          return Math.max(certificate - claims[index], 0);
        });

        this.barChartOptions = {
          ...this.barChartOptions,
          scales: {
            ...this.barChartOptions?.scales,
            y: {
              ...this.barChartOptions?.scales?.y,
              title: {
                ...this.barChartOptions?.scales?.y?.title,
                display: true,
                text: unit,
                align: 'end',
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const text = context.dataset.label === 'Consumption' ? 'consumed' : 'claimed';
                  return `${context.parsed.y} ${unit} ${text}`;
                },
              },
            },
          },
        };

        this.barChartData = {
          ...this.barChartData,
          datasets: [
            {
              data: claims.map((x) => fromWh(x, unit)),
              label: 'Claimed',
              borderRadius: Number.MAX_VALUE,
              maxBarThickness: 8,
              backgroundColor: '#00C898',
            },
            {
              data: consumptions.map((x) => fromWh(x, unit)),
              label: 'Consumption',
              borderRadius: Number.MAX_VALUE,
              maxBarThickness: 8,
              backgroundColor: '#02525E',
            },
          ],
        };

        this.isLoading = false;
        this.cd.detectChanges();
      });
  }

  private generateLabels() {
    return eachDayOfInterval({
      start: fromUnixTime(this.startDate),
      end: fromUnixTime(this.endDate),
    }).map((date) => {
      const datePipe = new DatePipe('en-US');
      return datePipe.transform(date, 'd MMM');
    });
  }
}
