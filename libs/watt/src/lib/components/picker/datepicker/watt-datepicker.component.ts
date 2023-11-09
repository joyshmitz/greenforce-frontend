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
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  LOCALE_ID,
  Optional,
  Self,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormatWidth, getLocaleDateFormat, CommonModule } from '@angular/common';
import {
  MatDatepickerInput,
  MatEndDate,
  MatStartDate,
  MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
  MatDatepickerModule,
  MatDateRangePicker,
  MatCalendarCellClassFunction,
} from '@angular/material/datepicker';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { combineLatest, map, merge, startWith, takeUntil, tap } from 'rxjs';
import { parse, isValid, parseISO, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { WattFieldComponent } from '@energinet-datahub/watt/field';

import { WattButtonComponent } from '../../button';
import { WattInputMaskService } from '../shared/watt-input-mask.service';
import { WattRangeInputService } from '../shared/watt-range-input.service';
import { WattDateRange } from '../../../utils/date';
import { WattPickerBase } from '../shared/watt-picker-base';
import { WattPickerValue } from '../shared/watt-picker-value';

const dateShortFormat = 'dd-MM-yyyy';
const danishLocaleCode = 'da';
export const danishTimeZoneIdentifier = 'Europe/Copenhagen';

/**
 * Usage:
 * `import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';`
 *
 * IMPORTANT:
 * The styling is calculated based on our monospaced font.
 */
@Component({
  selector: 'watt-datepicker',
  templateUrl: './watt-datepicker.component.html',
  styleUrls: ['./watt-datepicker.component.scss'],
  providers: [
    WattInputMaskService,
    WattRangeInputService,
    { provide: MatFormFieldControl, useExisting: WattDatepickerComponent },
    MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatInputModule,
    WattButtonComponent,
    CommonModule,
    WattFieldComponent,
  ],
})
export class WattDatepickerComponent extends WattPickerBase {
  @Input() max: Date | null = null;
  @Input() min: Date | null = null;
  @Input() startAt = new Date();
  @Input() rangeMonthOnlyMode = false;
  @Input() label = '';

  @ViewChild(MatDatepickerInput)
  matDatepickerInput!: MatDatepickerInput<Date | null>;

  @ViewChild(MatDateRangePicker)
  matDateRangePicker!: MatDateRangePicker<Date | null>;

  @ViewChild(MatStartDate)
  matStartDate!: MatStartDate<Date | null>;

  @ViewChild(MatEndDate)
  matEndDate!: MatEndDate<Date | null>;

  @ViewChild('dateInput')
  input!: ElementRef;

  @ViewChild('startDateInput')
  startInput!: ElementRef;

  @ViewChild('endDateInput')
  endInput!: ElementRef;

  protected _placeholder = this.getPlaceholder(this.getInputFormat());

  @Input() dateClass: MatCalendarCellClassFunction<Date> = () => '';

  constructor(
    protected override inputMaskService: WattInputMaskService,
    protected override rangeInputService: WattRangeInputService,
    protected override elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() ngControl: NgControl,
    @Inject(LOCALE_ID) private locale: string,
    private cdr: ChangeDetectorRef
  ) {
    super(
      `watt-datepicker-${WattDatepickerComponent.nextId++}`,
      inputMaskService,
      rangeInputService,
      elementRef,
      cdr,
      ngControl
    );
  }

  protected initSingleInput() {
    const pickerInputElement = this.input.nativeElement;
    const { onChange$, inputMask } = this.inputMaskService.mask(
      this.initialValue as string | null,
      this.getInputFormat(),
      this.placeholder,
      pickerInputElement,
      (value: string) => this.onBeforePaste(value)
    );

    const onInputOnChange$ = onChange$.pipe(
      // `value` can have one of three values:
      // 1. An empty string (usually when no initial value is set or input value is manually deleted)
      // 2. A `dd-MM-yyyy` format (keep in sync with `dateShortFormat`) (usually when date is manually typed)
      // 3. Full ISO 8601 format (usually when initial value is set)
      map((value) => {
        const parsedDate = this.parseDateShortFormat(value);

        if (isValid(parsedDate)) {
          this.matDatepickerInput.value = parsedDate;
          value = this.formatDateFromViewToModel(parsedDate);
        }

        return value;
      })
    );

    const matDatepickerChange$ = this.matDatepickerInput.dateInput.pipe(
      tap(() => {
        this.inputMaskService.setInputColor(pickerInputElement, inputMask);
      }),
      map(({ value }) => {
        let formattedDate = '';

        if (value instanceof Date) {
          formattedDate = this.formatDateFromViewToModel(value);
        }

        return formattedDate;
      })
    );

    merge(onInputOnChange$, matDatepickerChange$)
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        this.changeParentValue(value);
      });
  }

  onMonthSelected(date: Date) {
    if (this.rangeMonthOnlyMode && date) {
      this.matDateRangePicker.select(startOfMonth(date));
      this.matDateRangePicker.select(endOfMonth(date));
      this.matDateRangePicker.close();
    }
  }

  protected initRangeInput() {
    const startDateInputElement = this.startInput.nativeElement;
    const maskedStartDate = this.inputMaskService.mask(
      (this.initialValue as WattDateRange | null)?.start,
      this.getInputFormat(),
      this.placeholder,
      startDateInputElement,
      (value: string) => this.onBeforePaste(value)
    );

    const endDateInputElement = this.endInput.nativeElement;
    const maskedEndDate = this.inputMaskService.mask(
      (this.initialValue as WattDateRange | null)?.end,
      this.getInputFormat(),
      this.placeholder,
      endDateInputElement,
      (value: string) => this.onBeforePaste(value)
    );

    this.rangeInputService.init({
      startInput: {
        element: startDateInputElement,
        maskedInput: maskedStartDate,
      },
      endInput: {
        element: endDateInputElement,
        maskedInput: maskedEndDate,
      },
    });

    const getInitialValue = (initialValue: string) => {
      let value: Date | string = '';

      if (initialValue) {
        value = this.parseDateShortFormat(this.formatDateTimeFromModelToView(initialValue));
      }

      return { value };
    };

    const matStartDateChange$ = this.matStartDate.dateInput.pipe(
      startWith(getInitialValue((this.initialValue as WattDateRange)?.start)),
      tap(() => {
        this.inputMaskService.setInputColor(startDateInputElement, maskedStartDate.inputMask);
      }),
      map(({ value }) => {
        let start = '';

        if (value instanceof Date) {
          start = this.formatDateFromViewToModel(value);
        }

        return start;
      })
    );

    const matEndDateChange$ = this.matEndDate.dateInput.pipe(
      startWith(getInitialValue((this.initialValue as WattDateRange)?.end)),
      tap(() => {
        this.inputMaskService.setInputColor(endDateInputElement, maskedEndDate.inputMask);
      }),
      map(({ value }) => {
        let end = '';

        if (value instanceof Date) {
          const endOfDay = this.setToEndOfDay(value);

          end = this.formatDateFromViewToModel(endOfDay);
        }

        return end;
      })
    );

    /*
     * Initial is used to prevent marking the control as touched on initial values.
     */
    let initialDateChange = true;

    // Subscribe for changes from date-range picker
    combineLatest([matStartDateChange$, matEndDateChange$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([start, end]) => {
        if (initialDateChange) {
          initialDateChange = false;
          return;
        }
        this.markParentControlAsTouched();
        this.changeParentValue({ start, end });
      });

    /*
     * Initial is used to prevent marking the control as touched on initial values.
     */
    let initialInputChange = true;

    // Subscribe for input changes
    this.rangeInputService.onInputChanges$
      ?.pipe(takeUntil(this.destroy$))
      // `start` and `end` can have one of three values:
      // 1. An empty string (usually when no initial value is set or input value is manually deleted)
      // 2. A `dd-MM-yyyy` format (keep in sync with `dateShortFormat`) (usually when date is manually typed)
      // 3. Full ISO 8601 format (usually when initial value is set)
      .subscribe(([start, end]) => {
        if (initialInputChange) {
          initialInputChange = false;
          return;
        }
        const parsedStartDate = this.parseDateShortFormat(start);

        if (isValid(parsedStartDate)) {
          this.matStartDate.value = parsedStartDate;
          start = this.formatDateFromViewToModel(parsedStartDate);
        }

        const maybeEndDateInDanishTimeZone: Date | null = this.setEndDateToDanishTimeZone(end);

        if (maybeEndDateInDanishTimeZone != null) {
          const endDateEndOfDay = this.setToEndOfDay(maybeEndDateInDanishTimeZone);

          this.matEndDate.value = endDateEndOfDay;
          end = this.formatDateFromViewToModel(endDateEndOfDay);
        }

        this.changeParentValue({ start, end });

        // Needed for updating the datepicker in components with `ChangeDetectionStrategy.OnPush`;
        setTimeout(() => this.cdr.markForCheck());
      });
  }

  protected setSingleValue(
    value: Exclude<WattPickerValue, WattDateRange>,
    input: HTMLInputElement
  ) {
    this.setValueToInput(value, input, this.matDatepickerInput);
  }

  protected setRangeValue(
    value: WattDateRange | null,
    startInput: HTMLInputElement,
    endInput: HTMLInputElement
  ) {
    const { start, end } = value ?? {};

    this.setValueToInput(start, startInput, this.matStartDate);
    this.setValueToInput(end, endInput, this.matEndDate);
  }

  private onBeforePaste(pastedValue: string): string {
    if (this.locale !== danishLocaleCode) return pastedValue;

    // Reverse the pasted value, if starts with "year"
    if (pastedValue.search(/^\d{4}/g) !== -1) {
      const sepearators = pastedValue.match(/(\D)/);
      const seperator = sepearators ? sepearators[0] : '';
      return pastedValue.split(seperator).reverse().join(seperator);
    }
    return pastedValue;
  }

  private getInputFormat(): string {
    const localeDateFormat = getLocaleDateFormat(this.locale, FormatWidth.Short);

    return localeDateFormat
      .toLowerCase()
      .replace(/d+/, 'dd')
      .replace(/m+/, 'mm')
      .replace(/y+/, 'yyyy')
      .replace(/\./g, '-'); // seperator
  }

  private getPlaceholder(inputFormat: string): string {
    return this.locale === danishLocaleCode ? inputFormat.split('y').join('å') : inputFormat;
  }

  private parseDateShortFormat(value: string): Date {
    return parse(value, dateShortFormat, new Date());
  }

  private parseISO8601Format(value: string): Date {
    return parseISO(value);
  }

  private setValueToInput<D extends { value: Date | null }>(
    value: string | null | undefined,
    nativeInput: HTMLInputElement,
    matDateInput: D
  ): void {
    nativeInput.value = value ? this.formatDateTimeFromModelToView(value) : '';
    matDateInput.value = value ? zonedTimeToUtc(value, danishTimeZoneIdentifier) : null;
  }

  /**
   * @ignore
   * Formats Date to full ISO 8601 format (e.g. `2022-08-31T22:00:00.000Z`)
   */
  private formatDateFromViewToModel(value: Date): string {
    return zonedTimeToUtc(value, danishTimeZoneIdentifier).toISOString();
  }

  private formatDateTimeFromModelToView(value: string): string {
    return formatInTimeZone(value, danishTimeZoneIdentifier, dateShortFormat);
  }

  private toDanishTimeZone(value: Date): Date {
    return utcToZonedTime(value.toISOString(), danishTimeZoneIdentifier);
  }

  private setToEndOfDay(value: Date): Date {
    return endOfDay(value);
  }

  private setEndDateToDanishTimeZone(value: string): Date | null {
    const dateBasedOnShortFormat = this.parseDateShortFormat(value);
    const dateBasedOnISO8601Format = this.parseISO8601Format(value);

    let maybeDateInDanishTimeZone: Date | null = null;

    if (isValid(dateBasedOnShortFormat)) {
      maybeDateInDanishTimeZone = this.toDanishTimeZone(dateBasedOnShortFormat);
    } else if (isValid(dateBasedOnISO8601Format)) {
      maybeDateInDanishTimeZone = this.toDanishTimeZone(dateBasedOnISO8601Format);
    }

    return maybeDateInDanishTimeZone;
  }
}
