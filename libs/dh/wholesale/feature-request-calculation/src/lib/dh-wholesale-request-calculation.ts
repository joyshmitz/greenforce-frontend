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
import { Component, DestroyRef, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  MeteringPointType,
  EdiB2CProcessType,
  RequestCalculationDocument,
  EicFunction,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { VaterStackComponent, VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { Apollo, MutationResult } from 'apollo-angular';
import { graphql } from '@energinet-datahub/dh/shared/domain';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { differenceInDays, parseISO, subDays, subYears } from 'date-fns';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattRange } from '@energinet-datahub/watt/date';
import { JsonPipe, NgIf } from '@angular/common';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { catchError, of } from 'rxjs';

const maxOneMonthDateRangeValidator =
  () =>
  (control: AbstractControl): ValidationErrors | null => {
    const range = control.value as WattRange<string>;

    if (!range) return null;

    const rangeInDays = differenceInDays(parseISO(range.end), parseISO(range.start));
    if (rangeInDays > 31) {
      return { maxOneMonthDateRange: true };
    }

    return null;
  };

const label = (key: string) => `wholesale.requestCalculation.${key}`;

const ExtendMeteringPoint = { ...MeteringPointType, All: 'All' } as const;
type ExtendMeteringPointType = (typeof ExtendMeteringPoint)[keyof typeof ExtendMeteringPoint];

type FormType = {
  processType: FormControl<EdiB2CProcessType | null>;
  period: FormControl<WattRange<string | null>>;
  gridarea: FormControl<string | null>;
  meteringPointType: FormControl<ExtendMeteringPointType | null>;
  energySupplierId: FormControl<string | null>;
  balanceResponsibleId: FormControl<string | null>;
};

@Component({
  selector: 'dh-wholesale-request-calculation',
  templateUrl: './dh-wholesale-request-calculation.html',
  standalone: true,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;

        watt-card {
          width: 70%;
        }

        watt-dropdown,
        watt-datepicker {
          width: 50%;
        }
      }
    `,
  ],
  imports: [
    WATT_CARD,
    WattDropdownComponent,
    WattButtonComponent,
    DhDropdownTranslatorDirective,
    VaterStackComponent,
    VaterFlexComponent,
    ReactiveFormsModule,
    FormsModule,
    TranslocoDirective,
    WattDatepickerComponent,
    WattFieldErrorComponent,
    JsonPipe,
    NgIf,
  ],
})
export class DhWholesaleRequestCalculationComponent {
  private _apollo = inject(Apollo);
  private _fb = inject(NonNullableFormBuilder);
  private _transloco = inject(TranslocoService);
  private _toastService = inject(WattToastService);
  private _destroyRef = inject(DestroyRef);
  private _selectedEicFunction: EicFunction | null | undefined;

  maxDate = subDays(new Date(), 5);
  minDate = subYears(new Date(), 3);

  form = this._fb.group<FormType>({
    processType: this._fb.control(null, Validators.required),
    period: this._fb.control({ start: null, end: null }, [
      Validators.required,
      WattRangeValidators.required(),
      maxOneMonthDateRangeValidator(),
    ]),
    energySupplierId: this._fb.control(null),
    balanceResponsibleId: this._fb.control(null),
    gridarea: this._fb.control(null, Validators.required),
    meteringPointType: this._fb.control(null, Validators.required),
  });

  gridAreaOptions: WattDropdownOptions = [];
  energySupplierOptions: WattDropdownOptions = [];
  balanceResponsibleOptions: WattDropdownOptions = [];

  meteringPointOptions: WattDropdownOptions = [];
  progressTypeOptions = dhEnumToWattDropdownOptions(EdiB2CProcessType);

  selectedActorQuery = this._apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetSelectedActorDocument,
  });

  energySupplierQuery = this._apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetActorsForRequestCalculationDocument,
    variables: {
      eicFunctions: [EicFunction.EnergySupplier, EicFunction.BalanceResponsibleParty],
    },
  });

  constructor() {
    this.selectedActorQuery.valueChanges.pipe(takeUntilDestroyed()).subscribe({
      next: (result) => {
        if (result.loading || result.error) return;

        const { glnOrEicNumber, gridAreas, marketRole } = result.data.selectedActor;

        if (!glnOrEicNumber || !marketRole) return;

        this._selectedEicFunction = marketRole;

        if (this._selectedEicFunction === EicFunction.BalanceResponsibleParty) {
          this.form.controls.balanceResponsibleId.setValue(glnOrEicNumber);
        }

        if (this._selectedEicFunction === EicFunction.EnergySupplier) {
          this.form.controls.energySupplierId.setValue(glnOrEicNumber);
        }

        if (gridAreas.length === 1) {
          this.form.controls.gridarea.setValue(gridAreas[0].code);
        }

        this.form.controls.meteringPointType.setValue(ExtendMeteringPoint.All);

        const exclude = this.getExcludedMeterpointTypes(this._selectedEicFunction);

        this.meteringPointOptions = dhEnumToWattDropdownOptions(
          ExtendMeteringPoint,
          exclude,
          'asc'
        );

        this.gridAreaOptions = gridAreas.map((gridArea) => ({
          displayValue: `${gridArea.name} - ${gridArea.name}`,
          value: gridArea.code,
        }));
      },
    });

    this.energySupplierQuery.valueChanges.pipe(takeUntilDestroyed()).subscribe({
      next: (result) => {
        if (result.loading === false) {
          const { actorsForEicFunction } = result.data;
          this.energySupplierOptions = actorsForEicFunction
            .filter((actor) => actor.marketRole === EicFunction.EnergySupplier)
            .map((actor) => ({
              displayValue: actor.displayValue,
              value: actor.value,
            }));

          this.balanceResponsibleOptions = actorsForEicFunction
            .filter((actor) => actor.marketRole === EicFunction.BalanceResponsibleParty)
            .map((actor) => ({
              displayValue: actor.displayValue,
              value: actor.value,
            }));
        }
      },
    });
  }

  handleResponse(queryResult: MutationResult<graphql.RequestCalculationMutation> | null): void {
    if (queryResult === null) {
      this.showErrorToast();
      return;
    }

    if (queryResult.loading) return;

    if (!queryResult.errors && queryResult?.data?.createAggregatedMeasureDataRequest) {
      const message = this._transloco.translate(label('success'));
      this._toastService.open({ message, type: 'success' });
    } else {
      this.showErrorToast();
    }
  }

  showErrorToast(): void {
    const message = this._transloco.translate(label('error'));
    this._toastService.open({ message, type: 'danger' });
  }

  showEnergySupplierDropdown(): boolean {
    return false; //Not support yet this._selectedEicFunction === EicFunction.BalanceResponsibleParty;
  }

  showBalanceResponsibleDropdown(): boolean {
    return this._selectedEicFunction === EicFunction.EnergySupplier;
  }

  requestCalculation(form: FormGroup, formGroupDirective: FormGroupDirective): void {
    const {
      gridarea,
      meteringPointType,
      period,
      energySupplierId,
      balanceResponsibleId,
      processType: processtType,
    } = this.form.getRawValue();
    if (!gridarea || !meteringPointType || !processtType || !period.start || !period.end) return;

    const meteringPoint = meteringPointType as MeteringPointType;

    form.reset();
    formGroupDirective.resetForm();

    this._apollo
      .mutate({
        useMutationLoading: true,
        mutation: RequestCalculationDocument,
        variables: {
          meteringPointType: meteringPointType === ExtendMeteringPoint.All ? null : meteringPoint,
          processtType,
          startDate: period.start,
          endDate: period.end,
          balanceResponsibleId,
          energySupplierId,
          gridArea: gridarea,
        },
      })
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        catchError(() => of(null))
      )
      .subscribe((res) => this.handleResponse(res));
  }

  private getExcludedMeterpointTypes(selectedEicFunction: EicFunction | null | undefined) {
    return selectedEicFunction === EicFunction.BalanceResponsibleParty ||
      selectedEicFunction === EicFunction.EnergySupplier
      ? [MeteringPointType.Exchange, MeteringPointType.TotalConsumption]
      : [];
  }
}
