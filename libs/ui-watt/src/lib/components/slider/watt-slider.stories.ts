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

import { WattSliderComponent } from './watt-slider.component';
import { WattSliderModule } from './watt-slider.module';

const meta: Meta<WattSliderComponent> = {
  title: 'Components/Slider',
  component: WattSliderComponent,
  decorators: [
    moduleMetadata({
      imports: [WattSliderModule],
    }),
  ],
};

export default meta;

export const Overview: StoryObj<WattSliderComponent> = {
  render: (args) => ({
    props: args,
  }),

  args: {
    value: { min: 0, max: 100 },
  },
};
