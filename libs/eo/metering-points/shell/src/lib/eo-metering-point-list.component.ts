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
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { EoMeteringPointsStore } from './eo-metering-points.store';

@Component({
  selector: 'eo-metering-points-list',
  styles: [
    `
      :host {
        display: block;
      }

      .metering-point {
        color: var(--watt-color-neutral-grey-900);
      }
    `,
  ],
  template: `<ng-container *ngIf="meteringPoints$ | async as meteringPoints">
    <p class="metering-point" *ngIf="meteringPoints.length === 0">
      You do not have any metering points.
    </p>
    <p
      class="metering-point watt-space-stack-m"
      *ngFor="let point of meteringPoints"
    >
      {{ point.gsrn }}
    </p>
  </ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoMeteringPointListComponent {
  loadingDone$ = this.store.loadingDone$;
  meteringPoints$ = this.store.meteringPoints$;

  constructor(private store: EoMeteringPointsStore) {}
}

@NgModule({
  providers: [EoMeteringPointsStore],
  declarations: [EoMeteringPointListComponent],
  exports: [EoMeteringPointListComponent],
  imports: [CommonModule],
})
export class EoMeteringPointListScam {}
