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
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import {
  combineLatest,
  first,
  map,
  Observable,
  of,
  startWith,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template/let';
import { PushModule } from '@rx-angular/template/push';

import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WattInputDirective } from '@energinet-datahub/watt/input';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { WattFilterChipComponent } from '@energinet-datahub/watt/chip';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { DhFeatureFlagDirective } from '@energinet-datahub/dh/shared/feature-flags';
import { DateRange } from '@energinet-datahub/dh/shared/domain';
import { filterValidGridAreas, GridArea } from '@energinet-datahub/dh/wholesale/domain';
import { graphql } from '@energinet-datahub/dh/shared/domain';

interface CreateBatchFormValues {
  processType: FormControl<graphql.ProcessType | null>;
  gridAreas: FormControl<string[] | null>;
  dateRange: FormControl<DateRange | null>;
}

@Component({
  selector: 'dh-wholesale-start',
  templateUrl: './dh-wholesale-start.component.html',
  styleUrls: ['./dh-wholesale-start.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DhFeatureFlagDirective,
    WattDatePipe,
    LetModule,
    PushModule,
    ReactiveFormsModule,
    TranslocoModule,
    WattButtonComponent,
    WattDatepickerComponent,
    WattDropdownComponent,
    WATT_FORM_FIELD,
    WattInputDirective,
    WattSpinnerComponent,
    WattEmptyStateComponent,
    WattFilterChipComponent,
    WattValidationMessageComponent,
    WATT_MODAL,
  ],
})
export class DhWholesaleStartComponent implements OnInit, OnDestroy {
  private toast = inject(WattToastService);
  private transloco = inject(TranslocoService);
  private router = inject(Router);
  private apollo = inject(Apollo);

  private executionTypeChanged$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  @ViewChild('modal') modal?: WattModalComponent;

  loadingCreateBatch = false;

  confirmFormControl = new FormControl(null);

  createBatchForm = new FormGroup<CreateBatchFormValues>({
    processType: new FormControl(null, { validators: Validators.required }),
    gridAreas: new FormControl(
      { value: null, disabled: true },
      { validators: Validators.required }
    ),
    dateRange: new FormControl(null, {
      validators: WattRangeValidators.required(),
      asyncValidators: () => this.validateBalanceFixing(),
    }),
  });

  gridAreasQuery = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetGridAreasDocument,
  });

  onDateRangeChange$ = this.createBatchForm.controls.dateRange.valueChanges.pipe(startWith(null));

  processTypes: Observable<WattDropdownOption[]> = this.transloco
    .selectTranslateObject('wholesale.startBatch.processTypes')
    .pipe(
      map((processTypesTranslation) =>
        Object.values(graphql.ProcessType).map((value) => ({
          displayValue: processTypesTranslation[value],
          value,
        }))
      )
    );

  selectedExecutionType = 'ACTUAL';
  latestPeriodEnd?: string | null;
  showPeriodWarning = false;

  gridAreas$: Observable<WattDropdownOption[]> = combineLatest([
    this.gridAreasQuery.valueChanges.pipe(map((result) => result.data?.gridAreas ?? [])),
    this.onDateRangeChange$,
    this.executionTypeChanged$.pipe(startWith('')),
  ]).pipe(
    map(([gridAreas, dateRange]) => filterValidGridAreas(gridAreas, dateRange)),
    map((gridAreas) => {
      this.setMinDate(gridAreas);
      this.validatePeriod(gridAreas);
      return this.mapGridAreasToDropdownOptions(gridAreas);
    }),
    tap((gridAreas) => this.selectGridAreas(gridAreas))
  );

  minDate?: Date;
  maxDate = new Date();

  ngOnInit(): void {
    this.toggleGridAreasControl();

    // Close toast on navigation
    this.router.events.pipe(first((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.toast.dismiss();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.executionTypeChanged$.complete();
  }

  onExecutionTypeSelected(selection: HTMLInputElement) {
    this.selectedExecutionType = selection.value;
    this.executionTypeChanged$.next();
  }

  open() {
    this.modal?.open();
  }

  createBatch() {
    const { processType, gridAreas, dateRange } = this.createBatchForm.getRawValue();

    if (
      this.createBatchForm.invalid ||
      gridAreas === null ||
      dateRange === null ||
      processType === null
    )
      return;

    this.apollo
      .mutate({
        useMutationLoading: true,
        mutation: graphql.CreateBatchDocument,
        variables: {
          input: {
            gridAreaCodes: gridAreas,
            period: dateRange,
            processType: processType,
          },
        },
      })
      .subscribe({
        next: (result) => {
          // Update loading state of button
          this.loadingCreateBatch = result.loading;

          if (result.loading) {
            this.toast.open({
              type: 'loading',
              message: this.transloco.translate('wholesale.startBatch.creatingBatch'),
            });
          } else if (result.errors) {
            this.toast.update({
              type: 'danger',
              message: this.transloco.translate('shared.error.title'),
            });
          } else {
            this.toast.update({
              type: 'success',
              message: this.transloco.translate('wholesale.startBatch.creatingBatchSuccess'),
            });
          }
        },
        error: () => {
          this.toast.update({
            type: 'danger',
            message: this.transloco.translate('shared.error.title'),
          });
        },
      });
  }

  onClose(accepted: boolean) {
    if (accepted) this.createBatch();
    if (accepted || this.showPeriodWarning) this.reset();
  }

  reset() {
    this.latestPeriodEnd = null;
    this.showPeriodWarning = false;
    this.createBatchForm.reset();

    // This is apparently neccessary to reset the dropdown validity state
    this.createBatchForm.controls.processType.setErrors(null);
  }

  private selectGridAreas(gridAreas: WattDropdownOption[]) {
    if (this.selectedExecutionType === 'ACTUAL') {
      this.createBatchForm.patchValue({
        gridAreas: gridAreas.map((gridArea) => gridArea.value),
      });
    } else {
      this.createBatchForm.patchValue({
        gridAreas: [],
      });
    }
  }

  private setMinDate(gridAreas: GridArea[]) {
    if (gridAreas.length === 0) return;
    const validFromDates: number[] = gridAreas.map((gridArea) => {
      return new Date(gridArea.validFrom).getTime();
    });
    this.minDate = new Date(Math.min(...validFromDates));
  }

  private mapGridAreasToDropdownOptions(gridAreas: GridArea[]): WattDropdownOption[] {
    return (
      gridAreas.map((gridArea) => {
        return {
          displayValue: `${gridArea?.name} (${gridArea?.code})`,
          value: gridArea?.code,
        };
      }) || []
    );
  }

  private toggleGridAreasControl() {
    // Disable grid areas when date range is invalid
    this.onDateRangeChange$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const gridAreasControl = this.createBatchForm.controls.gridAreas;
      const disableGridAreas = this.createBatchForm.controls.dateRange.invalid;
      if (disableGridAreas == gridAreasControl.disabled) return; // prevent ng0100
      disableGridAreas ? gridAreasControl.disable() : gridAreasControl.enable();
    });
  }

  private validatePeriod(gridAreas: GridArea[]) {
    if (gridAreas.length === 0) {
      this.createBatchForm.controls.dateRange.setErrors({
        ...this.createBatchForm.controls.dateRange.errors,
        invalidPeriod: true,
      });
    }
  }

  private validateBalanceFixing(): Observable<null> {
    const { dateRange } = this.createBatchForm.controls;

    // Hide warning initially
    this.latestPeriodEnd = null;

    // Skip validation if end and start is not set
    if (!dateRange.value?.end || !dateRange.value?.start) return of(null);

    // This observable always returns null (no error)
    return this.apollo
      .query({
        query: graphql.GetLatestBalanceFixingDocument,
        fetchPolicy: 'network-only',
        variables: {
          period: {
            end: dateRange.value.end,
            start: dateRange.value.start,
          },
        },
      })
      .pipe(
        tap((result) => (this.latestPeriodEnd = result.data?.batches?.[0]?.period?.end)),
        map(() => null)
      );
  }
}