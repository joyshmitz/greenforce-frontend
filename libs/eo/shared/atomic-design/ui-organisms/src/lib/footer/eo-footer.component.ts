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
  selector: 'eo-footer',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        position: relative;
        z-index: 100;
        background: var(--watt-color-neutral-white);
      }

      .content {
        display: flex;
        padding: var(--watt-space-m);
        flex-direction: column;

        @include watt.media('>=Large') {
          padding: var(--watt-space-xl) var(--watt-space-m);
          gap: calc(var(--watt-space-xl) * 2);
          flex-direction: row;
        }
      }

      .powered-by {
        font-size: 14px;
        color: var(--watt-color-primary-dark);
        line-height: 20px;
        padding-bottom: 4px;
      }

      .logo {
        width: 100%;
        max-width: 360px;
        padding-bottom: var(--watt-space-m);
      }

      .link {
        text-decoration: none;
        color: var(--watt-color-primary);
      }
    `,
  ],
  template: `
    <div class="content">
      <div class="watt-space-stack-l">
        <p class="powered-by">Powered by</p>
        <img src="/assets/energinet-logo.svg" alt="Energinet" class="logo " />
        <ng-content></ng-content>
      </div>

      <div class="watt-space-stack-m">
        <h5 class="watt-space-stack-s">Address</h5>
        <p>
          Tonne Kjærsvej 65<br />
          7000 Fredericia<br />
          Danmark<br />
          CVR: 39315041
        </p>
      </div>

      <div>
        <h5 class="watt-space-stack-s">Contact</h5>
        <p class="watt-space-stack-s">
          <a href="tel:+4570222810" aria-label="Phone" class="link"
            >+45 70 22 28 10
          </a>
        </p>
        <p class="watt-space-stack-s">
          <a href="mailto:datahub@energinet.dk" aria-label="Email" class="link">
            datahub@energinet.dk
          </a>
        </p>
      </div>
    </div>
  `,
})
export class EoFooterComponent {}

@NgModule({
  declarations: [EoFooterComponent],
  exports: [EoFooterComponent],
})
export class EoFooterScam {}
