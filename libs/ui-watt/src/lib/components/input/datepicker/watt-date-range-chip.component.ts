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
import { DateRange, MatDatepickerModule } from '@angular/material/datepicker';

import { WattDatePipe } from '../../../configuration/watt-date.pipe';
import { WattIconComponent } from '../../../foundations/icon/icon.component';
import { WattMenuChipComponent } from '../../chip/watt-menu-chip.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    WattMenuChipComponent,
    WattDatePipe,
    WattIconComponent,
  ],
  selector: 'watt-date-range-chip',
  styles: [
    `
      mat-date-range-input {
        top: 0;
        bottom: 0;
        height: auto;
        pointer-events: none;
      }
    `,
  ],
  template: `
    <mat-date-range-picker #picker></mat-date-range-picker>
    <watt-menu-chip
      role="dialog"
      [disabled]="disabled"
      [selected]="value?.start && value?.end ? true : false"
      [opened]="picker.opened"
      (toggle)="picker.open()"
    >
      <mat-date-range-input #input class="cdk-visually-hidden" [rangePicker]="picker">
        <input
          type="date"
          matStartDate
          tabindex="-1"
          [value]="value?.start"
          (dateChange)="value = input.value ?? undefined"
          (dateChange)="selectionChange.emit(input.value ?? undefined)"
        />
        <input
          type="date"
          matEndDate
          tabindex="-1"
          [value]="value?.end"
          (dateChange)="value = input.value ?? undefined"
          (dateChange)="selectionChange.emit(input.value ?? undefined)"
        />
      </mat-date-range-input>
      <ng-content *ngIf="!value?.start || !value?.end; else range" />
      <ng-template #range>
        {{ value!.start | wattDate }} - {{ value!.end | wattDate }}
      </ng-template>
    </watt-menu-chip>
  `,
})
export class WattDateRangeChipComponent {
  @Input() disabled = false;
  @Input() label?: string;
  @Input() value?: DateRange<string>;
  @Output() selectionChange = new EventEmitter<DateRange<string>>();
}
