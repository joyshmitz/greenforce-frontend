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
import { StoryObj, moduleMetadata, StoryFn, Meta } from '@storybook/angular';

import { WattCardModule } from './watt-card.module';
import { WattCardComponent } from './watt-card.component';

const meta: Meta<WattCardComponent> = {
  title: 'Components/Card',
  component: WattCardComponent,
  decorators: [
    moduleMetadata({
      imports: [WattCardModule],
    }),
  ],
};

export default meta;

export const WithTitle: StoryObj<WattCardComponent> = {
  render: (args) => ({
    props: args,
    template: `
    <watt-card>
      <watt-card-title>
        <h3>Title</h3>
      </watt-card-title>

      Content
    </watt-card>
    `,
  }),

  args: {},
};

export const WithoutTitle: StoryObj<WattCardComponent> = {
  render: (args) => ({
    props: args,
    template: `
    <watt-card>
      Content
    </watt-card>
    `,
  }),

  args: {},
};

export const CardWithVariant: StoryObj<WattCardComponent> = {
  render: (args) => ({
    props: args,
    template: `
    <watt-card variant="${args.variant}">
      <watt-card-title>
        <h3>Title</h3>
      </watt-card-title>

      Content
    </watt-card>
    `,
  }),

  args: {
    variant: 'solid',
  },
};
