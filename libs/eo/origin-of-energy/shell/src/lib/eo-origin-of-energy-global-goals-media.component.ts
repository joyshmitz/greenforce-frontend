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
import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { EoMediaModule } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';

@Component({
  selector: 'eo-origin-of-energy-global-goals-media',
  template: `<eo-media [eoMediaMaxWidthPixels]="360" class="global-goals-box">
    <p class="watt-space-inset-m">
      <strong>Global goals 7.2</strong><br />
      increase the share of renewable energy globally
    </p>
    <img
      eoMediaImage
      [eoMediaImageMaxWidthPixels]="106"
      src="/assets/images/origin-of-energy/un-global-goal-7.2.svg"
      alt="UN Global goal 7.2"
    />
  </eo-media>`,
  styles: [
    `
      :host {
        display: block;
      }

      .global-goals-box {
        border: 1px solid var(--watt-color-state-warning);
        max-height: 106px; /* Magic UX number that makes the box fit the text and margin */
      }
    `,
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class EoOriginOfEnergyGlobalGoalsMediaComponent {}

@NgModule({
  declarations: [EoOriginOfEnergyGlobalGoalsMediaComponent],
  exports: [EoOriginOfEnergyGlobalGoalsMediaComponent],
  imports: [EoMediaModule],
})
export class EoOriginOfEnergyGlobalGoalsMediaScam {}
