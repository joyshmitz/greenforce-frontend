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
import { Component } from '@angular/core';
import { EoLineChartComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { RxLet } from '@rx-angular/template/let';
import { map } from 'rxjs';
import { EoConsumptionStore } from './eo-consumption.store';
import { WATT_CARD } from '@energinet-datahub/watt/card';

@Component({
  standalone: true,
  imports: [RxLet, EoLineChartComponent, WattSpinnerComponent, NgIf, AsyncPipe, WATT_CARD],
  selector: 'eo-consumption-line-chart',
  template: ` <watt-card class="chart-card watt-space-inline-l">
    <h3 class="watt-space-stack-s">kWh</h3>
    <ng-container>
      <div *ngIf="(loadingDone$ | async) === false" class="loadingObfuscator">
        <watt-spinner [diameter]="100"></watt-spinner>
      </div>
      <eo-line-chart *rxLet="dataInKWH$ as data" [data]="data"></eo-line-chart>
    </ng-container>
  </watt-card>`,
  styles: [
    `
      :host {
        display: block;
      }

      .chart-card {
        width: 375px; /* Magic UX number */
      }

      .loadingObfuscator {
        position: absolute;
        height: calc(100% - 64px);
        width: calc(100% - 32px);
        background-color: var(--watt-on-dark-high-emphasis);
        padding-top: 32px;
        padding-left: 120px;
      }
    `,
  ],
})
export class EoConsumptionLineChartComponent {
  loadingDone$ = this.store.loadingDone$;
  dataInKWH$ = this.store.measurements$.pipe(
    map((all) => all.map((one) => ({ ...one, value: Number(one.value / 1000) })))
  );

  constructor(private store: EoConsumptionStore) {}
}
