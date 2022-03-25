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
import { EoFooterScam } from '@energinet-datahub/eo/shared/atomic-design/ui-organisms';

import { EoLandingPageCallToActionScam } from './eo-landing-page-call-to-action.component';
import { EoLandingPageCompanyScam } from './eo-landing-page-company.component';
import { EoLandingPageHeaderScam } from './eo-landing-page-header.component';
import { EoLandingPageHeroScam } from './eo-landing-page-hero.component';
import { EoLandingPageIntroductionScam } from './eo-landing-page-introduction.component';
import { EoLandingPageLoginButtonScam } from './eo-landing-page-login-button.component';
import { EoLandingPageNotificationScam } from './eo-landing-page-notification.component';
import { EoLandingPageOriginOfEnergyScam } from './eo-landing-page-origin-of-energy.component';
import { EoLandingPageStore } from './eo-landing-page.store';
import { EoLandingPageAudienceScam } from './eo-landinge-page-audience.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-landing-page-shell',
  styles: [
    `
      :host {
        --eo-screen-medium-min-width: 960px;
        --eo-landing-page-content-max-width: var(--eo-screen-medium-min-width);

        display: block;
      }

      img {
        display: block;
      }

      .u-positioning-context {
        position: relative !important;
      }

      .u-snap-bottom {
        position: absolute;
        bottom: 0 !important;
      }

      .u-collapse-bottom {
        padding-bottom: 0 !important;
      }
    `,
  ],
  template: `
    <eo-landing-page-header></eo-landing-page-header>

    <div class="u-positioning-context">
      <eo-landing-page-notification
        class="u-collapse-bottom"
      ></eo-landing-page-notification>

      <eo-landing-page-hero></eo-landing-page-hero>

      <eo-landing-page-introduction></eo-landing-page-introduction>

      <eo-landing-page-origin-of-energy></eo-landing-page-origin-of-energy>

      <eo-landing-page-audience></eo-landing-page-audience>

      <eo-landing-page-company></eo-landing-page-company>

      <eo-landing-page-call-to-action></eo-landing-page-call-to-action>

      <div class="u-snap-bottom">
        <img src="/assets/images/landing-page/landing-page-mesh-bottom.png" />
      </div>
    </div>

    <eo-footer></eo-footer>
  `,
  viewProviders: [EoLandingPageStore],
})
export class EoLandingPageShellComponent {}

@NgModule({
  declarations: [EoLandingPageShellComponent],
  imports: [
    EoLandingPageHeaderScam,
    EoFooterScam,
    EoLandingPageHeroScam,
    EoLandingPageIntroductionScam,
    EoLandingPageLoginButtonScam,
    EoLandingPageCallToActionScam,
    EoLandingPageNotificationScam,
    EoLandingPageOriginOfEnergyScam,
    EoLandingPageAudienceScam,
    EoLandingPageCompanyScam,
  ],
})
export class EoLandingPageShellScam {}
