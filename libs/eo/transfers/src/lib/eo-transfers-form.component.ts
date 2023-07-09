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
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { add, fromUnixTime, isAfter, isBefore, isEqual } from 'date-fns';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Subject, distinctUntilChanged, of, switchMap, takeUntil } from 'rxjs';

import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattInputDirective } from '@energinet-datahub/watt/input';
import { WattModalActionsComponent } from '@energinet-datahub/watt/modal';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';

import {
  compareValidator,
  endDateMustBeLaterThanStartDateValidator,
  minTodayValidator,
  nextHourOrLaterValidator,
} from './validations';
import { EoTransfersTimepickerComponent } from './eo-transfers-timepicker.component';
import { EoExistingTransferAgreement } from './eo-transfers.store';

export interface EoTransfersFormInitialValues {
  receiverTin?: string;
  startDate?: string;
  startDateTime?: string;
  hasEndDate?: boolean;
  endDate?: string;
  endDateTime?: string;
}

interface EoTransfersForm {
  receiverTin: FormControl<string | null>;
  startDate: FormControl<string | null>;
  startDateTime: FormControl<string>;
  hasEndDate: FormControl<boolean>;
  endDate: FormControl<string | null>;
  endDateTime: FormControl<string | null>;
}

@Component({
  selector: 'eo-transfers-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    WATT_FORM_FIELD,
    WattInputDirective,
    WattDatepickerComponent,
    WattModalActionsComponent,
    WattButtonComponent,
    EoTransfersTimepickerComponent,
    WattRadioComponent,
    NgIf,
    NgClass,
  ],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .eo-transfers-form-overlapping-date,
      .eo-transfers-form-overlapping-date .mat-calendar-body-selected {
        background: var(--watt-color-state-danger-light) !important;
        border-radius: 100%;
        pointer-events: none;
      }

      eo-transfers-form fieldset {
        display: flex;
        flex-wrap: wrap;
      }

      eo-transfers-form watt-form-field {
        margin-bottom: var(--watt-space-m);
      }

      eo-transfers-form .receiver {
        margin-top: var(--watt-space-l);
      }

      eo-transfers-form .receiver,
      eo-transfers-form .start-date {
        max-width: 280px;
      }

      eo-transfers-form .start-date {
        margin-bottom: var(--watt-space-xs);
        position: relative;
        padding-bottom: var(--watt-space-s);
      }

      eo-transfers-form .start-date watt-error {
        position: absolute;
        bottom: 0;
      }

      eo-transfers-form
        .endDate
        watt-form-field
        .mat-placeholder-required.mat-form-field-required-marker {
        display: none;
      }

      eo-transfers-form .end-date-label {
        width: 100%;
        margin-bottom: var(--watt-space-s);
      }

      eo-transfers-form .end-date-container {
        display: flex;
        flex-wrap: wrap;
        margin-top: 26px;
        max-width: 60%;
      }

      eo-transfers-form .end-date-container watt-error {
        margin-top: -32px;
      }

      eo-transfers-form .radio-buttons-container {
        display: flex;
        flex-direction: column;
        gap: var(--watt-space-l);
        margin-bottom: 46px;
      }

      eo-transfers-form .datepicker {
        max-width: 160px;
        margin-right: var(--watt-space-m);
      }

      eo-transfers-form eo-transfers-timepicker:first-of-type {
        max-width: 104px;
      }

      eo-transfers-form .datetime .mat-form-field-type-mat-date-range-input .mat-form-field-infix {
        width: auto !important;
      }

      eo-transfers-form .asterisk {
        color: var(--watt-color-primary);
      }

      eo-transfers-form .has-error,
      eo-transfers-form .has-error .asterisk {
        color: var(--watt-color-state-danger);
      }
    `,
  ],
  template: `
    <form [formGroup]="form">
      <watt-form-field class="receiver">
        <watt-label>Receiver</watt-label>
        <input
          wattInput
          required="true"
          inputmode="numeric"
          type="text"
          formControlName="receiverTin"
          [maxlength]="8"
          (keydown)="preventNonNumericInput($event)"
          data-testid="new-agreement-receiver-input"
        />
        <watt-error *ngIf="form.controls.receiverTin.errors?.['receiverTinEqualsSenderTin']">
          The receiver cannot be your own TIN/CVR
        </watt-error>
        <watt-error
          *ngIf="form.controls.receiverTin.errors && !form.controls.receiverTin.errors?.['receiverTinEqualsSenderTin']"
        >
          An 8-digit TIN/CVR number is required
        </watt-error>
      </watt-form-field>
      <fieldset class="start-date">
        <watt-form-field class="datepicker">
          <watt-label>Start of period</watt-label>
          <watt-datepicker
            formControlName="startDate"
            [min]="minStartDate"
            [dateClass]="dateClass"
            data-testid="new-agreement-start-date-input"
          />
        </watt-form-field>
        <eo-transfers-timepicker
          formControlName="startDateTime"
          [selectedDate]="form.controls.startDate.value"
          [errors]="form.controls.startDateTime.errors"
          (invalidOptionReset)="form.controls.startDate.updateValueAndValidity()"
        ></eo-transfers-timepicker>
        <watt-error *ngIf="form.controls.startDate.errors?.['nextHourOrLater']" class="watt-text-s">
          The start of the period must be at least the next hour from now
        </watt-error>
      </fieldset>
      <fieldset class="endDate">
        <p
          class="watt-label end-date-label"
          [ngClass]="{ 'has-error': form.controls.endDate.errors }"
        >
          End of period <span class="asterisk">*</span>
        </p>

        <div class="radio-buttons-container">
          <watt-radio group="has_enddate" formControlName="hasEndDate" [value]="false"
            >No end date</watt-radio
          >
          <watt-radio group="has_enddate" formControlName="hasEndDate" [value]="true"
            >End by</watt-radio
          >
        </div>

        <div *ngIf="form.value.hasEndDate" class="end-date-container">
          <watt-form-field class="datepicker">
            <watt-datepicker
              #endDatePicker
              formControlName="endDate"
              data-testid="new-agreement-end-date-input"
              [min]="minEndDate"
            />
          </watt-form-field>
          <eo-transfers-timepicker
            formControlName="endDateTime"
            [selectedDate]="form.controls.endDate.value"
            [errors]="form.controls.endDateTime.errors"
            [disabledHours]="
              form.controls.startDateTime.value ? [form.controls.startDateTime.value] : []
            "
            (invalidOptionReset)="form.controls.endDate.updateValueAndValidity()"
          >
          </eo-transfers-timepicker>
          <watt-error *ngIf="form.controls.endDate.errors?.['minToday']" class="watt-text-s">
            The end of the period must be today or later
          </watt-error>
          <watt-error
            *ngIf="form.controls.endDate.errors?.['endDateMustBeLaterThanStartDate']"
            class="watt-text-s"
          >
            The end of the period must be later than the start of the period
          </watt-error>
        </div>
      </fieldset>
    </form>

    <watt-modal-actions>
      <watt-button
        variant="secondary"
        data-testid="close-new-agreement-button"
        (click)="onCancel()"
      >
        Cancel
      </watt-button>
      <watt-button
        data-testid="create-new-agreement-button"
        [disabled]="!form.valid"
        (click)="onSubmit()"
      >
        {{ submitButtonText }}
      </watt-button>
    </watt-modal-actions>
  `,
})
export class EoTransfersFormComponent implements OnInit, OnDestroy {
  @Input() senderTin?: string;
  @Input() submitButtonText = 'Create';
  @Input() initialValues: EoTransfersFormInitialValues = {
    receiverTin: '',
    startDate: new Date().toISOString(),
    startDateTime: this.getNextHour(),
    hasEndDate: false,
    endDate: '',
    endDateTime: '',
  };
  @Input() editableFields: (keyof EoTransfersForm)[] = [
    'receiverTin',
    'startDate',
    'startDateTime',
    'hasEndDate',
    'endDate',
    'endDateTime',
  ];
  @Input() existingTransferAgreements: EoExistingTransferAgreement[] = [];

  @Output() submitted = new EventEmitter();
  @Output() canceled = new EventEmitter();
  @Output() receiverTinChanged = new EventEmitter<string | null>();

  protected minStartDate: Date = new Date();
  protected minEndDate: Date = new Date();
  protected form!: FormGroup<EoTransfersForm>;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initForm();

    this.form.controls['startDate'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((startDate) => {
        const today = new Date();

        this.minEndDate =
          startDate && isAfter(new Date(startDate), today) ? new Date(startDate) : new Date();
      });

    this.form.controls['hasEndDate'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasEndDate) => {
        if (hasEndDate) {
          if (!this.form.controls['startDate'].value) return;

          const nextDay = add(
            new Date(this.form.controls['startDate'].value as string).setHours(0, 0, 0, 0),
            {
              days: 1,
            }
          );

          this.form.controls['endDate'].setValue(
            isAfter(nextDay, this.minEndDate)
              ? nextDay.toISOString()
              : this.minEndDate.toISOString()
          );

          this.form.controls['endDateTime'].setValue(
            this.form.controls['startDateTime'].value > this.getNextHour()
              ? this.form.controls['startDateTime'].value
              : this.getNextHour()
          );
        } else {
          this.form.controls['endDate'].setValue(null);
          this.form.controls['endDateTime'].setValue(null);
        }
      });

    this.form.controls['receiverTin'].valueChanges
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          return of(this.form.controls['receiverTin'].valid);
        }),
        distinctUntilChanged()
      )
      .subscribe((receiverTinValidity) => {
        const receiverTin = receiverTinValidity ? this.form.controls['receiverTin'].value : null;
        this.receiverTinChanged.emit(receiverTin);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onCancel() {
    this.canceled.emit();
  }

  protected onSubmit() {
    this.submitted.emit(this.form.value);
  }

  protected preventNonNumericInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
    const isNumericInput = /^[0-9]+$/.test(event.key);
    const isSpecialKey = allowedKeys.includes(event.key);

    if (!isNumericInput && !isSpecialKey) {
      event.preventDefault();
    }
  }

  protected dateClass = (cellDate: Date, view: 'month' | 'year' | 'multi-year') => {


    // Only highlight dates inside the month view.
    if (view === 'month') {
      console.log('dateclass', cellDate);
      return this.isOverlappingDate(cellDate, this.existingTransferAgreements)
        ? 'eo-transfers-form-overlapping-date'
        : '';
    }

    return '';
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private isOverlappingDate(date: Date, periods: EoExistingTransferAgreement[]): boolean {
    let isOverlapping = false;

    // TODO: EDIT SHOULD SKIP ITSELF
    periods.forEach((period) => {
      const { startDate, endDate } = period;
      const time = date.setHours(23,0,0,0);

      if(time >= startDate && time <= (endDate || time)) {
        isOverlapping = true;
      }
    });

    return isOverlapping;
  }

  private initForm() {
    const { receiverTin, startDate, startDateTime, hasEndDate, endDate, endDateTime } =
      this.initialValues;

    const formGroupValidators = [endDateMustBeLaterThanStartDateValidator()];
    if (this.editableFields.includes('startDate')) {
      formGroupValidators.push(nextHourOrLaterValidator());
    }

    this.form = new FormGroup(
      {
        receiverTin: new FormControl(
          {
            value: receiverTin || '',
            disabled: !this.editableFields.includes('receiverTin'),
          },
          {
            validators: [
              Validators.required,
              Validators.pattern('^[0-9]{8}$'),
              compareValidator(this.senderTin || '', 'receiverTinEqualsSenderTin'),
            ],
          }
        ),
        startDate: new FormControl({
          value: startDate || new Date().toISOString(),
          disabled: !this.editableFields.includes('startDate'),
        }),
        startDateTime: new FormControl(
          {
            value: startDateTime || this.getNextHour(),
            disabled: !this.editableFields.includes('startDateTime'),
          },
          { nonNullable: true }
        ),
        hasEndDate: new FormControl(
          {
            value: hasEndDate || false,
            disabled: !this.editableFields.includes('hasEndDate'),
          },
          {
            nonNullable: true,
            validators: [Validators.required],
          }
        ),
        endDate: new FormControl(
          {
            value: endDate || '',
            disabled: !this.editableFields.includes('endDate'),
          },
          [minTodayValidator()]
        ),
        endDateTime: new FormControl({
          value: endDateTime || '',
          disabled: !this.editableFields.includes('endDateTime'),
        }),
      },
      { validators: formGroupValidators }
    );
  }

  private getNextHour(): string {
    const nextHour = new Date().getHours() + 1;
    return nextHour.toString().padStart(2, '0');
  }
}
