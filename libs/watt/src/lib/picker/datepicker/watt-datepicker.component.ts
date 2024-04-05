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
  Input,
  LOCALE_ID,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormatWidth, getLocaleDateFormat, NgIf } from '@angular/common';
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
import { combineLatest, map, merge, startWith, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattFieldComponent } from '@energinet-datahub/watt/field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDateRange, WattDateUtils } from '@energinet-datahub/watt/utils/date';
import {
  WattInputMaskService,
  WattRangeInputService,
  WattPickerBase,
  WattPickerValue,
} from '@energinet-datahub/watt/picker/shared';

const dateShortFormat = 'DD-MM-YYYY';
const danishLocaleCode = 'da';
export const danishTimeZoneIdentifier = 'Europe/Copenhagen';

/**
 * @deprecated Use WattDatepickerV2Component instead
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
  imports: [NgIf, MatDatepickerModule, MatInputModule, WattButtonComponent, WattFieldComponent],
})
export class WattDatepickerComponent extends WattPickerBase {
  protected inputMaskService = inject(WattInputMaskService);
  protected rangeInputService = inject(WattRangeInputService);
  protected override elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected override ngControl = inject(NgControl, { optional: true, self: true });
  private locale = inject(LOCALE_ID);
  private cdr = inject(ChangeDetectorRef);
  private dateUtils = inject(WattDateUtils);

  @Input() max: Date | null = null;
  @Input() min: Date | null = null;
  @Input() startAt: Date | null = null;
  @Input() rangeMonthOnlyMode = false;
  @Input() label = '';

  /**
   * @ignore
   */
  @ViewChild(MatDatepickerInput)
  matDatepickerInput!: MatDatepickerInput<Date | null>;

  @ViewChild(MatDateRangePicker)
  matDateRangePicker!: MatDateRangePicker<Date | null>;

  /**
   * @ignore
   */
  @ViewChild(MatStartDate)
  matStartDate!: MatStartDate<Date | null>;

  /**
   * @ignore
   */
  @ViewChild(MatEndDate)
  matEndDate!: MatEndDate<Date | null>;

  /**
   * @ignore
   */
  @ViewChild('dateInput')
  input!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild('startDateInput')
  startInput!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild('endDateInput')
  endInput!: ElementRef;

  /**
   * @ignore
   */
  protected _placeholder = this.getPlaceholder(this.getInputFormat());

  @Input()
  dateClass: MatCalendarCellClassFunction<Date> = () => '';

  /**
   * @ignore
   */
  constructor() {
    super(`watt-datepicker-${WattDatepickerComponent.nextId++}`);
  }

  /**
   * @ignore
   */
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
      // 2. A `DD-MM-YYYY` format (keep in sync with `dateShortFormat`) (usually when date is manually typed)
      // 3. Full ISO 8601 format (usually when initial value is set)
      map((value) => {
        const parsedDate = this.parseDateShortFormat(value);

        if (this.dateUtils.isValid(parsedDate)) {
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
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((value: string) => {
        this.changeParentValue(value);
      });
  }

  onMonthSelected(date: Date) {
    if (this.rangeMonthOnlyMode && date) {
      this.matDateRangePicker.select(this.dateUtils.startOf(date, 'month'));
      this.matDateRangePicker.select(this.dateUtils.endOf(date, 'month'));
      this.matDateRangePicker.close();
    }
  }

  /**
   * @ignore
   */
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
      .pipe(takeUntilDestroyed(this._destroyRef))
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
      ?.pipe(takeUntilDestroyed(this._destroyRef))
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

        if (this.dateUtils.isValid(parsedStartDate)) {
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

  /**
   * @ignore
   */
  protected setSingleValue(
    value: Exclude<WattPickerValue, WattDateRange>,
    input: HTMLInputElement
  ) {
    this.setValueToInput(value, input, this.matDatepickerInput);
  }

  /**
   * @ignore
   */
  protected setRangeValue(
    value: WattDateRange | null,
    startInput: HTMLInputElement,
    endInput: HTMLInputElement
  ) {
    const { start, end } = value ?? {};

    this.setValueToInput(start, startInput, this.matStartDate);
    this.setValueToInput(end, endInput, this.matEndDate);
  }

  /**
   * @ignore
   */
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

  /**
   * @ignore
   */
  private getInputFormat(): string {
    const localeDateFormat = getLocaleDateFormat(this.locale, FormatWidth.Short);

    return localeDateFormat
      .toLowerCase()
      .replace(/d+/, 'dd')
      .replace(/m+/, 'mm')
      .replace(/y+/, 'yyyy')
      .replace(/\./g, '-'); // seperator
  }

  /**
   * @ignore
   */
  private getPlaceholder(inputFormat: string): string {
    return this.locale === danishLocaleCode ? inputFormat.split('y').join('å') : inputFormat;
  }

  /**
   * @ignore
   */
  private parseDateShortFormat(value: string): Date {
    return this.dateUtils.parse(value, dateShortFormat);
  }

  /**
   * @ignore
   */
  private setValueToInput<
    D extends {
      value: Date | null;
    },
  >(value: string | null | undefined, nativeInput: HTMLInputElement, matDateInput: D): void {
    nativeInput.value = value ? this.formatDateTimeFromModelToView(value) : '';
    matDateInput.value = value ? this.dateUtils.utc(value) : null;
  }

  /**
   * @ignore
   * Formats Date to full ISO 8601 format (e.g. `2022-08-31T22:00:00.000Z`)
   */
  private formatDateFromViewToModel(value: Date): string {
    return this.dateUtils.utc(value).toISOString();
  }

  /**
   * @ignore
   */
  private formatDateTimeFromModelToView(value: string): string {
    return this.dateUtils.format(value, dateShortFormat, danishTimeZoneIdentifier);
  }

  /**
   * @ignore
   */
  private setToEndOfDay(value: Date): Date {
    return this.dateUtils.endOf(value, 'day');
  }

  /**
   * @ignore
   */
  private setEndDateToDanishTimeZone(value: string): Date | null {
    return this.dateUtils.toTimeZone(value, danishTimeZoneIdentifier);
  }
}