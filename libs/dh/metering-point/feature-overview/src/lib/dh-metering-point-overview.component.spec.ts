/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { render, RenderResult, screen } from '@testing-library/angular';
import { HttpClientModule } from '@angular/common/http';
import user from '@testing-library/user-event';
import { RouterTestingModule } from '@angular/router/testing';
import {
  SpectacularAppComponent,
  SpectacularFeatureTestingModule,
  SpectacularFeatureRouter,
  SpectacularFeatureLocation,
} from '@ngworker/spectacular';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';

import { DhMeteringPointFeatureOverviewModule } from './dh-metering-point-feature-overview.module';
import { DhMeteringPointOverviewComponent } from './dh-metering-point-overview.component';
import { dhMeteringPointPath } from './routing/dh-metering-point-path';

describe(DhMeteringPointOverviewComponent.name, () => {
  beforeEach(async () => {
    @Component({
      template: '<h2>Default route</h2>',
    })
    class TestMeteringPointComponent {}

    view = await render(SpectacularAppComponent, {
      declarations: [TestMeteringPointComponent],
      imports: [
        HttpClientModule,
        DhApiModule.forRoot(),
        RouterTestingModule,
        getTranslocoTestingModule(),
        SpectacularFeatureTestingModule.withFeature({
          featureModule: DhMeteringPointFeatureOverviewModule,
          featurePath: dhMeteringPointPath,
        }),
      ],
      routes: [
        {
          path: dhMeteringPointPath,
          children: [
            {
              component: TestMeteringPointComponent,
              path: '',
              pathMatch: 'full',
            },
          ],
        },
      ],
    });

    featureRouter = TestBed.inject(SpectacularFeatureRouter);
    featureLocation = TestBed.inject(SpectacularFeatureLocation);
  });

  let view: RenderResult<SpectacularAppComponent>;
  const meteringPointId = '575391908025497398';
  let featureRouter: SpectacularFeatureRouter;
  let featureLocation: SpectacularFeatureLocation;

  it('displays a link to the Metering point URL', async () => {
    await featureRouter.navigateByUrl(`~/${meteringPointId}`);

    const [topLevelLink]: HTMLAnchorElement[] = await screen.findAllByRole(
      'link',
      undefined,
      { timeout: 3000 }
    );
    user.click(topLevelLink);

    await view.fixture.whenStable();

    expect(featureLocation.path()).toBe(`~/`);
  });

  it('displays the metering point id in a heading for an existing metering point', async () => {
    await featureRouter.navigateByUrl(`~/${meteringPointId}`);

    await view.fixture.whenStable();

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: meteringPointId,
      })
    ).toBeInTheDocument();
  });
});
