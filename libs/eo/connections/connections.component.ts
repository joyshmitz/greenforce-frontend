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
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { WATT_CARD } from '@energinet-datahub/watt/card';

import { EoBetaMessageComponent } from '../shared/atomic-design/ui-atoms/src/lib/eo-beta-message/eo-beta-message.component';
import { EoConnectionsTableComponent } from './connections-table.component';
import { EoConnectionsStore } from './connections.store';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
} from '@energinet-datahub/watt/vater';

@Component({
  standalone: true,
  imports: [
    EoBetaMessageComponent,
    EoConnectionsTableComponent,
    WATT_CARD,
    AsyncPipe,
    WattButtonComponent,
    VaterFlexComponent,
    VaterStackComponent,
    VaterSpacerComponent,
  ],
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      .badge {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background-color: var(--watt-color-neutral-grey-300);
        color: var(--watt-on-light-high-emphasis);
        border-radius: 24px;
        padding: 2px 8px;

        small {
          @include watt.typography-font-weight('semi-bold');
        }
      }
    `,
  ],
  template: `
    <eo-eo-beta-message></eo-eo-beta-message>

    <watt-card>
      <watt-card-title>
        <vater-stack direction="row" gap="s">
          <h3 class="watt-on-light--high-emphasis">Results</h3>
          <div class="badge"
            ><small>{{ (store.connections$ | async)?.length || 0 }}</small></div
          >
          <vater-spacer />
          <watt-button variant="secondary" icon="plus">New invitation link</watt-button>
        </vater-stack>
      </watt-card-title>
      <eo-connections-table
        [connections]="store.connections$ | async"
        [loading]="!!(store.loadingConnections$ | async)"
        [hasError]="!!(store.loadingConnectionsError$ | async)"
      ></eo-connections-table>
    </watt-card>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class EoConnectionsComponent implements OnInit {
  protected store = inject(EoConnectionsStore);

  ngOnInit(): void {
    this.store.getConnections();
  }
}
