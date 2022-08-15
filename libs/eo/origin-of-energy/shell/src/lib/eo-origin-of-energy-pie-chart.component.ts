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
import { Component, NgModule } from '@angular/core';
import { EoPieChartScam } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { WattSpinnerModule } from '@energinet-datahub/watt';
import { EoOriginOfEnergyStore } from './eo-origin-of-energy.store';

@Component({
  selector: 'eo-origin-of-energy-pie-chart',
  template: `
    <div *ngIf="(loadingDone$ | async) === false" class="loadingObfuscator">
      <watt-spinner [diameter]="100"></watt-spinner>
      <div class="loadingText">
        <strong>
          Phew, loading is taking a while, but don't worry. It usually takes 3
          minutes, but soon it will be faster
        </strong>
      </div>
    </div>
    <eo-pie-chart
      [data]="[
        convertToPercentage((renewableShare$ | async) || 0.5),
        convertToPercentage(1 - ((renewableShare$ | async) || 0.5))
      ]"
    ></eo-pie-chart>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
      }

      .loadingObfuscator {
        text-align: center;
        position: absolute;
        height: 100%;
        width: 100%;
        background-color: var(--watt-on-dark-high-emphasis);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .loadingText {
        width: 210px; /* Magic UX number */
      }
    `,
  ],
})
export class EoOriginOfEnergyPieChartComponent {
  loadingDone$ = this.store.loadingDone$;
  renewableShare$ = this.store.renewable$;

  constructor(private store: EoOriginOfEnergyStore) {}

  convertToPercentage(num: number): number {
    if (!num || Number.isNaN(num)) return 0;

    return Number((num * 100).toFixed(0));
  }
}

@NgModule({
  declarations: [EoOriginOfEnergyPieChartComponent],
  exports: [EoOriginOfEnergyPieChartComponent],
  imports: [EoPieChartScam, CommonModule, WattSpinnerModule],
})
export class EoOriginOfEnergyPieChartScam {}
