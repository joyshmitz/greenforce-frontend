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
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';

export type StackSize = 'XS' | 'S' | 'M' | 'L' | 'XL';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-stack',
  styles: [
    `
      :host {
        display: block;
        --_stack-size: var(--watt-space-l);
      }

      eo-stack > * + * {
        margin-block-start: var(--_stack-size);
      }

      eo-stack[data-size='xl'] > * {
        --_stack-size: var(--watt-space-xl);
      }

      eo-stack[data-size='l'] > * {
        --_stack-size: var(--watt-space-l);
      }

      eo-stack[data-size='m'] > * {
        --_stack-size: var(--watt-space-m);
      }

      eo-stack[data-size='s'] > * {
        --_stack-size: var(--watt-space-s);
      }

      eo-stack[data-size='xs'] > * {
        --_stack-size: var(--watt-space-xs);
      }
    `,
  ],
  template: `<ng-content></ng-content>`,
})
export class EoStackComponent {
  @Input() size: StackSize = 'L';
  @HostBinding('attr.data-size') get stackSize() {
    return this.size.toLowerCase();
  }
}

@NgModule({
  declarations: [EoStackComponent],
  exports: [EoStackComponent],
})
export class EoStackScam {}
