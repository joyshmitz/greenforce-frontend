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
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vater-scroller, [vater-scroller]',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  styles: [
    `
      vater-scroller,
      [vater-scroller] {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: auto;
      }

      vater-scroller > *,
      [vater-scroller] > * {
        flex: 1 1 auto;
      }
    `,
  ],
  template: `<ng-content />`,
})
export class VaterScrollerComponent {}
