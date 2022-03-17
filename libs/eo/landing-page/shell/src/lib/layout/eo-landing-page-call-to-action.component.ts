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

import { EoLandingPageColumnLayoutScam } from './eo-landing-page-column-layout.component';
import { EoLandingPageLoginButtonScam } from './eo-landing-page-login-button.component';

@Component({
  selector: 'eo-landing-page-call-to-action',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        display: block;
        text-align: center;
      }

      h2 {
        display: inline-block;
      }

      .call-to-action-wrapper {
        height: calc(75 * var(--watt-space-xs));
        background: var(
          --watt-color-focus-selection
        ); // This is the light-blue-ish background color
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .link-icon {
        width: 24px;
        height: 24px;
        margin-left: calc(2.5 * var(--watt-space-xs));
        cursor: pointer;
      }
    `,
  ],
  template: `
    <div class="call-to-action-wrapper">
      <eo-landing-page-column-layout [layoutType]="'full'">
        <h2>Log in with your company NemID</h2>
        <a
          href="https://www.nemid.nu/dk-en/about_nemid/index.html"
          target="_blank"
          rel="nofollow noopener"
        >
          <img
            class="link-icon"
            src="/assets/images/icons/primary-info-icon.svg"
            alt="EnergyOrigin NemID log in"
          />
        </a>
        <eo-landing-page-login-button></eo-landing-page-login-button>
      </eo-landing-page-column-layout>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoLandingPageCallToActionComponent {}

@NgModule({
  declarations: [EoLandingPageCallToActionComponent],
  exports: [EoLandingPageCallToActionComponent],
  imports: [EoLandingPageColumnLayoutScam, EoLandingPageLoginButtonScam],
})
export class EoLandingPageCallToActionScam {}
