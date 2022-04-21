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

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-emissions-page-co2-reduction',
  styles: [
    `
      :host {
        height: 128px; // Magic number by designer
        outline: 1px solid #f9d557; // Does not exist as a variable in our design system
        display: grid;
        grid-template-columns: 128px 1fr; // Magic numbers by designer

        img {
          width: 128px; // Magic number by designer
          height: 128px; // Magic number by designer
        }
      }
    `,
  ],
  template: `
    <div>
      <img alt="CO2 reduction | EnergyOrigin" src="/assets/icons/co2-cloud.svg" />
    </div>
    <div class="watt-space-inset-m">
      <p>
        Denmark must <strong>reduce</strong> greenhouse gas
        <strong>emissions</strong> by <strong>70 percent</strong> in 2030
        compared to 1990
      </p>
    </div>
  `,
})
export class EoEmissionsPageCo2ReductionComponent {}

@NgModule({
  declarations: [EoEmissionsPageCo2ReductionComponent],
  exports: [EoEmissionsPageCo2ReductionComponent],
})
export class EoEmissionsPageCo2ReductionScam {}
