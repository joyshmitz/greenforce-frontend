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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WattIconModule } from '../../foundations/icon/icon.module';
import { WattChipComponent } from './watt-chip.component';

export type WattMenuChipRole = 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';

@Component({
  standalone: true,
  imports: [CommonModule, WattChipComponent, WattIconModule],
  selector: 'watt-menu-chip',
  styles: [
    `
      button {
        all: unset;
        display: inline-flex;
        gap: var(--watt-space-xs);
        pointer-events: none;
        margin-right: calc(var(--watt-space-xs) * -1);
      }

      .menu-icon {
        transition: linear 0.2s all;
        color: var(--watt-color-primary);
      }

      .opened {
        transform: rotate(180deg);
      }

      .selected {
        color: var(--watt-color-neutral-white);
      }
    `,
  ],
  template: `
    <watt-chip [disabled]="disabled" [selected]="selected">
      <button
        [attr.aria-haspopup]="role"
        [attr.aria-expanded]="opened"
        (click)="toggle.emit()"
        [disabled]="disabled"
      >
        {{ label }}
        <watt-icon
          size="s"
          name="arrowDropDown"
          class="menu-icon"
          [class.opened]="opened"
          [class.selected]="selected"
        />
      </button>
      <ng-content />
    </watt-chip>
  `,
})
export class WattMenuChipComponent {
  @Input() opened = false;
  @Input() disabled = false;
  @Input() selected = false;
  @Input() label?: string;
  @Input() name?: string;
  @Input() value?: string;
  @Input() role: WattMenuChipRole = 'menu';
  @Output() toggle = new EventEmitter<void>();
}
