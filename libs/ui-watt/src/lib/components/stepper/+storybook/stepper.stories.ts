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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryObj, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { StepperExampleComponent } from './stepper.example.component';

const meta: Meta<StepperExampleComponent> = {
  title: 'Components/Stepper',
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
    }),
  ],
  component: StepperExampleComponent,
};

export default meta;

const template = `<watt-stepper-example></watt-stepper-example>`;

export const Stepper: StoryObj = {
  render: (args) => ({
    props: args,
    template,
  }),

  parameters: {
    docs: {
      source: {
        code: template,
      },
    },
  },
};
