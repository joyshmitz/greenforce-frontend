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
import { Component } from '@angular/core';
import { render } from '@testing-library/angular';

import { WattNavListModule } from './watt-nav-list.component';

describe(WattNavListModule.name, () => {
  it('exports shared Watt Design System nav list', async () => {
    const text = 'Page 1';

    const view = await render(
      `
      <watt-nav-list>
        <watt-nav-list-item link="/">
          ${text}
        </watt-nav-list-item>
      </watt-nav-list>
    `,
      {
        imports: [WattNavListModule],
      }
    );

    expect(view.queryByText(text)).not.toBeNull();
  });

  it('adds "active" class when a route path is activated', async () => {
    @Component({
      template: '<h2>Page route</h2>',
    })
    class TestPageComponent {}

    @Component({
      selector: 'watt-main',
      template: `<watt-nav-list>
          <watt-nav-list-item link="/page-1">Page 1</watt-nav-list-item>
          <watt-nav-list-item link="/page-2">Page 2</watt-nav-list-item>
        </watt-nav-list>

        <router-outlet></router-outlet>`,
    })
    class TestAppComponent {}

    const view = await render(TestAppComponent, {
      declarations: [TestPageComponent],
      imports: [WattNavListModule],
      routes: [
        {
          path: '',
          children: [
            {
              path: 'page-1',
              component: TestPageComponent,
            },
            {
              path: 'page-2',
              component: TestPageComponent,
            },
          ],
        },
      ],
    });

    const expectedClass = 'active';

    let link = view.getByRole('link', {
      name: /page 2/i,
    }) as HTMLAnchorElement;

    expect(Object.values(link.classList)).not.toContain(expectedClass);

    await view.navigate(link);

    link = view.getByRole('link', {
      name: /page 2/i,
    }) as HTMLAnchorElement;

    expect(Object.values(link.classList)).toContain(expectedClass);
  });
});
