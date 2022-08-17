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
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import {
  AppSettingsStore,
  CalendarDateRange,
} from '@energinet-datahub/eo/shared/services';
import { EoProductionLineChartScam } from './eo-production-chart-card.component';
import { EoProductionInfoScam } from './eo-production-info.component';
import { EoProductionTipScam } from './eo-production-tip.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-production-shell',
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: 375px 360px; // Magic numbers by designer
        grid-gap: var(--watt-space-l);
      }
    `,
  ],
  template: `
    <div>
      <eo-production-info class="watt-space-stack-l"></eo-production-info>
      <eo-production-line-chart
        class="watt-space-stack-l"
      ></eo-production-line-chart>
    </div>
    <div>
      <eo-production-tip class="watt-space-stack-l"></eo-production-tip>
    </div>
  `,
})
export class EoProductionShellComponent {
  appSettingsDates$ = this.appSettingsStore.calendarDateRange$;

  constructor(private appSettingsStore: AppSettingsStore) {}

  setNewAppDates(dates: CalendarDateRange) {
    this.appSettingsStore.setCalendarDateRange(dates);
  }
}

@NgModule({
  declarations: [EoProductionShellComponent],
  imports: [
    EoProductionTipScam,
    EoProductionInfoScam,
    EoProductionLineChartScam,
  ],
})
export class EoProductionShellScam {}
