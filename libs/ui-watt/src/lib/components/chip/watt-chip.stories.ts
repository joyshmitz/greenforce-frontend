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
import { StoryFn, Meta } from '@storybook/angular';

import { WattChipComponent } from './watt-chip.component';

const meta: Meta<WattChipComponent> = {
  title: 'Components/Chip',
  component: WattChipComponent,
};

export default meta;

export const Overview: StoryFn<WattChipComponent> = (args) => ({
  props: args,
  template: `
  <div style="display: flex;">
    <watt-chip selected="true">Chip label</watt-chip>
    <watt-chip [disabled]="true">Chip label</watt-chip>
  </div>
  `,
});

Overview.args = {
  selected: false,
};
