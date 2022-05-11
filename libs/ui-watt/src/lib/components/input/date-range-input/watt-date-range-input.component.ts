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
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  Optional,
  Self,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FormatWidth, getLocaleDateFormat } from '@angular/common';
import { MatEndDate, MatStartDate } from '@angular/material/datepicker';
import { MatFormFieldControl } from '@angular/material/form-field';
import { combineLatest, map, Subject, takeUntil, tap } from 'rxjs';
import { parse, isValid } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { WattInputMaskService } from '../shared/watt-input-mask.service';
import { WattRangeInputService } from '../shared/watt-range-input.service';
import { WattRange } from '../shared/watt-range';

const dateTimeFormat = 'dd-MM-yyyy';
const danishTimeZoneIdentifier = 'Europe/Copenhagen';
const danishLocaleCode = 'da';

/**
 * Usage:
 * `import { WattDateRangeInputModule } from '@energinet-datahub/watt';`
 *
 * IMPORTANT:
 * The styling is calculated based on our monospaced font.
 */
@Component({
  selector: 'watt-date-range-input',
  templateUrl: './watt-date-range-input.component.html',
  styleUrls: ['./watt-date-range-input.component.scss'],
  providers: [
    WattInputMaskService,
    WattRangeInputService,
    { provide: MatFormFieldControl, useExisting: WattDateRangeInputComponent },
  ],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[id]': 'id',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WattDateRangeInputComponent
  implements
    AfterViewInit,
    OnDestroy,
    ControlValueAccessor,
    MatFormFieldControl<WattRange>
{
  /**
   * @ignore
   */
  static nextId = 0;

  /**
   * @ignore
   */
  private destroy$: Subject<void> = new Subject();

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
  stateChanges = new Subject<void>();

  /**
   * @ignore
   */
  focused = false;

  /**
   * @ignore
   */
  controlType = 'mat-date-range-input'; // We keep the controlType of Material Date Range Input as is, to keep some styling.

  /**
   * @ignore
   */
  id = `watt-date-range-input-${WattDateRangeInputComponent.nextId++}`;

  /**
   * @ignore
   */
  @HostBinding('id') hostId = this.id;

  /**
   * @ignore
   */
  get empty() {
    const { start, end } = this.ngControl.value;
    return !start && !end;
  }

  /**
   * @ignore
   */
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-describedby') userAriaDescribedBy?: string;

  /**
   * @ignore
   */
  inputFormat: string = this.getInputFormat();

  /**
   * @ignore
   */
  get placeholder(): string {
    return this._placeholder;
  }

  /**
   * @ignore
   */
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  /**
   * @ignore
   */
  private _placeholder: string = this.getPlaceholder(this.inputFormat);

  /**
   * @ignore
   */
  @Input()
  get required(): boolean {
    return this._required;
  }

  /**
   * @ignore
   */
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  /**
   * @ignore
   */
  private _required = false;

  /**
   * @ignore
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * @ignore
   */
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  /**
   * @ignore
   */
  private _disabled = false;

  /**
   * @ignore
   */
  @Input()
  get value(): WattRange | null {
    if (this.ngControl.valid) {
      const {
        value: { start, end },
      } = this.ngControl;
      return { start, end };
    }
    return null;
  }

  /**
   * @ignore
   */
  set value(range: WattRange | null) {
    if (!this.startDateInput || !this.endDateInput) {
      this.initialValue = range;
      return;
    }

    const inputEvent = new Event('input', { bubbles: true });

    if (range?.start) {
      this.startDateInput.nativeElement.value = range.start;
      this.startDateInput.nativeElement.dispatchEvent(inputEvent);
    }

    if (range?.end) {
      this.endDateInput.nativeElement.value = range.end;
      this.endDateInput.nativeElement.dispatchEvent(inputEvent);
    }
    this.stateChanges.next();
  }

  /**
   * @ignore
   */
  get errorState(): boolean {
    return !!this.ngControl.invalid && !!this.ngControl.touched;
  }

  /**
   * @ignore
   */
  @ViewChild('startDate')
  startDateInput!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild('endDate')
  endDateInput!: ElementRef;

  /**
   * @ignore
   */
  initialValue?: WattRange | null = null;

  /**
   * @ignore
   */
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private inputMaskService: WattInputMaskService,
    private rangeInputService: WattRangeInputService,
    private elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * @ignore
   */
  setDescribedByIds(ids: string[]) {
    this.elementRef.nativeElement.setAttribute(
      'aria-describedby',
      ids.join(' ')
    );
  }

  /**
   * @ignore
   */
  onContainerClick() {
    // Intentionally left empty
  }

  /**
   * @ignore
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  ngAfterViewInit() {
    if (this.initialValue) {
      this.writeValue(this.initialValue);
    }

    // Setup input masks
    const startDateInputElement = this.startDateInput.nativeElement;
    const startDateInputMask = this.inputMaskService.mask(
      this.inputFormat,
      this.placeholder,
      startDateInputElement,
      (value) => this.onBeforePaste(value)
    );

    const endDateInputElement = this.endDateInput.nativeElement;
    const endDateInputMask = this.inputMaskService.mask(
      this.inputFormat,
      this.placeholder,
      endDateInputElement,
      (value) => this.onBeforePaste(value)
    );

    this.rangeInputService.init({
      startInput: {
        element: startDateInputElement,
        initialValue: this.initialValue?.start,
        mask: startDateInputMask,
      },
      endInput: {
        element: endDateInputElement,
        initialValue: this.initialValue?.end,
        mask: endDateInputMask,
      },
    });

    const matStartDateChange$ = this.matStartDate.dateInput.pipe(
      tap(() => {
        this.inputMaskService.setInputColor(
          startDateInputElement,
          startDateInputMask
        );
      }),
      map(({ value }) => {
        let start = '';

        if (value instanceof Date) {
          start = this.formatDate(value);
        }

        return start;
      })
    );

    const matEndDateChange$ = this.matEndDate.dateInput.pipe(
      tap(() => {
        this.inputMaskService.setInputColor(
          endDateInputElement,
          endDateInputMask
        );
      }),
      map(({ value }) => {
        let end = '';

        if (value instanceof Date) {
          end = this.formatDate(value);
        }

        return end;
      })
    );

    // Subscribe for changes from date-range picker
    combineLatest([matStartDateChange$, matEndDateChange$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([start, end]) => {
        this.markParentControlAsTouched();
        this.changeParentValue({ start, end });
      });

    // Subscribe for input changes
    this.rangeInputService.onInputChanges$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(([start, end]) => {
        const parsedStartDate = this.parseDate(start);
        const parsedEndDate = this.parseDate(end);

        if (isValid(parsedStartDate)) {
          this.matStartDate.value = parsedStartDate;
        }

        if (isValid(parsedEndDate)) {
          this.matEndDate.value = parsedEndDate;
        }

        this.changeParentValue({ start, end });
      });
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.stateChanges.complete();
  }

  /**
   * @ignore
   */
  writeValue(range: WattRange | null): void {
    this.value = range;
  }

  /**
   * @ignore
   */
  registerOnChange(onChangeFn: (value: WattRange) => void): void {
    this.changeParentValue = onChangeFn;
  }

  /**
   * @ignore
   */
  registerOnTouched(onTouchFn: () => void) {
    this.markParentControlAsTouched = onTouchFn;
  }

  /**
   * @ignore
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * @ignore
   */
  onFocusIn() {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  /**
   * @ignore
   */
  onFocusOut(event: FocusEvent) {
    if (
      !this.elementRef.nativeElement.contains(event.relatedTarget as Element)
    ) {
      this.focused = false;
      this.markParentControlAsTouched();
      this.stateChanges.next();
    }
  }

  /**
   * @ignore
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private changeParentValue = (value: WattRange): void => {
    // Intentionally left empty
  };

  /**
   * @ignore
   */
  private markParentControlAsTouched = (): void => {
    // Intentionally left empty
  };

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
    const localeDateFormat = getLocaleDateFormat(
      this.locale,
      FormatWidth.Short
    );
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
    return this.locale === danishLocaleCode
      ? inputFormat.split('y').join('å')
      : inputFormat;
  }

  /**
   * @ignore
   */
  private formatDate(value: Date): string {
    return formatInTimeZone(value, danishTimeZoneIdentifier, dateTimeFormat);
  }

  /**
   * @ignore
   */
  private parseDate(value: string): Date {
    return parse(value, dateTimeFormat, new Date());
  }
}
