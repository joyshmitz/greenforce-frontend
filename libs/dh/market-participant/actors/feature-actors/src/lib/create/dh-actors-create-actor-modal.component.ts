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
import { TranslocoDirective, translate } from '@ngneat/transloco';
import { Apollo, MutationResult } from 'apollo-angular';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RxPush } from '@rx-angular/template/push';
import { concat, distinctUntilChanged, map, merge, of, switchMap, tap } from 'rxjs';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattTypedModal, WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import {
  ContactCategory,
  CreateMarketParticipantDocument,
  CreateMarketParticipantMutation,
  EicFunction,
  GetOrganizationFromCvrDocument,
  GetOrganizationsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  dhCvrValidator,
  dhDomainValidator,
  dhGlnOrEicValidator,
} from '@energinet-datahub/dh/shared/ui-validators';
import { readApiErrorResponse } from '@energinet-datahub/dh/market-participant/data-access-api';
import { parseGraphQLErrorResponse } from '@energinet-datahub/dh/shared/data-access-graphql';
import { DhOrganizationDetails } from '@energinet-datahub/dh/market-participant/actors/domain';

import { DhChooseOrganizationStepComponent } from './steps/dh-choose-organization-step.component';
import { DhNewOrganizationStepComponent } from './steps/dh-new-organization-step.component';
import { DhNewActorStepComponent } from './steps/dh-new-actor-step.component';
import { ActorForm } from './dh-actor-form.model';
import { dhMarketParticipantNameMaxLengthValidatorFn } from '../dh-market-participant-name-max-length.validator';

@Component({
  standalone: true,
  selector: 'dh-actors-create-actor-modal',
  templateUrl: './dh-actors-create-actor-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    RxPush,

    WATT_CARD,
    WATT_MODAL,
    WATT_STEPPER,

    DhChooseOrganizationStepComponent,
    DhNewOrganizationStepComponent,
    DhNewActorStepComponent,
  ],
})
export class DhActorsCreateActorModalComponent extends WattTypedModal {
  private _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private _toastService = inject(WattToastService);
  private _apollo = inject(Apollo);
  private _changeDetection = inject(ChangeDetectorRef);

  showCreateNewOrganization = signal(false);
  isCompleting = signal(false);

  modal = viewChild.required(WattModalComponent);

  chooseOrganizationForm = this._fb.group({
    orgId: new FormControl<string | null>(null, Validators.required),
  });

  newOrganizationForm = this._fb.group({
    country: ['', Validators.required],
    cvrNumber: ['', { validators: [Validators.required] }],
    companyName: [{ value: '', disabled: true }, Validators.required],
    domain: ['', [Validators.required, dhDomainValidator]],
  });

  newActorForm: ActorForm = this._fb.group({
    glnOrEicNumber: ['', [Validators.required, dhGlnOrEicValidator()]],
    name: ['', [Validators.required, dhMarketParticipantNameMaxLengthValidatorFn]],
    marketrole: new FormControl<EicFunction | null>(null, Validators.required),
    gridArea: [{ value: [] as string[], disabled: true }, Validators.required],
    contact: this._fb.group({
      departmentOrName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    }),
  });

  constructor() {
    super();

    this.newOrganizationForm.controls.country.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        const internalCvrValidator: ValidatorFn = (control) =>
          this.isInternalCvr(control.value as string) ? null : { invalidCvrNumber: true };

        if (value === 'DK') {
          this.newOrganizationForm.controls.cvrNumber.setValidators([
            Validators.required,
            Validators.maxLength(64),
            (control) =>
              dhCvrValidator()(control) && internalCvrValidator(control)
                ? { invalidCvrNumber: true }
                : null,
          ]);
        } else {
          this.newOrganizationForm.controls.cvrNumber.setValidators(Validators.required);
        }

        this.newOrganizationForm.controls.cvrNumber.updateValueAndValidity();
      });

    this.newOrganizationForm.controls.country.setValue('DK');

    this.newOrganizationNameToActorName();
  }

  cvrLookup$ = merge(
    this.newOrganizationForm.controls.country.valueChanges,
    this.newOrganizationForm.controls.cvrNumber.valueChanges
  ).pipe(
    distinctUntilChanged(),
    switchMap(() => {
      const country = this.newOrganizationForm.controls.country.value;
      const cvrNumber = this.newOrganizationForm.controls.cvrNumber.value;

      if (country === '') {
        return of({ isLoading: false, isReadOnly: true });
      }

      if (country === 'DK') {
        if (this.isInternalCvr(cvrNumber)) {
          return of({ isLoading: false, isReadOnly: false });
        }

        if (cvrNumber.length === 8) {
          return this.callCvrLookup(cvrNumber);
        } else {
          return of({ isLoading: false, isReadOnly: true });
        }
      }

      return of({ isLoading: false, isReadOnly: false });
    }),
    tap((state) => {
      if (state.isReadOnly) {
        this.newOrganizationForm.controls.companyName.disable();
      } else {
        this.newOrganizationForm.controls.companyName.enable();
      }

      this._changeDetection.detectChanges();
    }),
    map((result) => result.isLoading)
  );

  isInternalCvr(cvrNumber: string): boolean {
    return cvrNumber.startsWith('ENDK');
  }

  callCvrLookup(cvrNumber: string) {
    const cvrQuery = this._apollo
      .query({
        query: GetOrganizationFromCvrDocument,
        fetchPolicy: 'network-only',
        variables: { cvr: cvrNumber },
      })
      .pipe(
        map((cvrResult) => {
          const foundOrg = cvrResult.data.searchOrganizationInCVR;

          this.newOrganizationForm.controls.companyName.setValue(foundOrg.name);

          if (foundOrg.hasResult) {
            return { isLoading: false, isReadOnly: true };
          }

          return { isLoading: false, isReadOnly: false };
        })
      );

    return concat(of({ isLoading: true, isReadOnly: true }), cvrQuery);
  }

  onSelectOrganization(organization: DhOrganizationDetails): void {
    this.newActorForm.controls.name.setValue(organization.name);
  }

  toggleShowCreateNewOrganization(): void {
    this.showCreateNewOrganization.set(!this.showCreateNewOrganization());
  }

  open(): void {
    this.modal().open();
  }

  close(isSuccess = false): void {
    this.modal().close(isSuccess);
  }

  createMarketParticipent(): void {
    if (this.chooseOrganizationForm.controls.orgId.value && this.newActorForm.invalid) return;

    if (
      (this.chooseOrganizationForm.controls.orgId.value === null &&
        this.newOrganizationForm.invalid) ||
      this.newActorForm.invalid
    )
      return;

    this.isCompleting.set(true);
    this._apollo
      .mutate({
        mutation: CreateMarketParticipantDocument,
        variables: {
          input: {
            organizationId: this.chooseOrganizationForm.controls.orgId.value,
            organization: this.chooseOrganizationForm.controls.orgId.value
              ? null
              : {
                  address: {
                    country: this.newOrganizationForm.controls.country.value,
                  },
                  domain: this.newOrganizationForm.controls.domain.value,
                  businessRegisterIdentifier: this.newOrganizationForm.controls.cvrNumber.value,
                  name: this.newOrganizationForm.controls.companyName.value,
                },
            actorContact: {
              email: this.newActorForm.controls.contact.controls.email.value,
              name: this.newActorForm.controls.contact.controls.departmentOrName.value,
              phone: this.newActorForm.controls.contact.controls.phone.value,
              category: ContactCategory.Default,
            },
            actor: {
              name: { value: this.newActorForm.controls.name.value },
              // The hardcoded value is a placeholder for the organizationId what be replaced in the BFF with the created organizationId
              organizationId:
                this.chooseOrganizationForm.controls.orgId.value === null
                  ? '3f2504e0-4f89-41d3-9a0c-0305e82c3301'
                  : this.chooseOrganizationForm.controls.orgId.value,
              marketRoles: [
                {
                  eicFunction: this.newActorForm.controls.marketrole.value as EicFunction,
                  gridAreas: this.newActorForm.controls.gridArea.value.map((gridArea) => ({
                    code: gridArea,
                    meteringPointTypes: [],
                  })),
                },
              ],
              actorNumber: {
                value: this.newActorForm.controls.glnOrEicNumber.value,
              },
            },
          },
        },
        refetchQueries: [GetOrganizationsDocument],
      })
      .subscribe((result) => this.handleCreateMarketParticipentResponse(result));
  }

  private handleCreateMarketParticipentResponse(
    response: MutationResult<CreateMarketParticipantMutation>
  ): void {
    if (response.errors && response.errors.length > 0) {
      this._toastService.open({
        type: 'danger',
        message: parseGraphQLErrorResponse(response.errors),
      });
    }

    if (
      response.data?.createMarketParticipant?.errors &&
      response.data?.createMarketParticipant?.errors.length > 0
    ) {
      this._toastService.open({
        type: 'danger',
        message: readApiErrorResponse(response.data?.createMarketParticipant?.errors),
      });
    }

    if (response.data?.createMarketParticipant?.success) {
      this._toastService.open({
        type: 'success',
        message: translate('marketParticipant.actor.create.createSuccess'),
      });

      this.close(true);
    }

    this.isCompleting.set(false);
  }

  private newOrganizationNameToActorName(): void {
    this.newOrganizationForm.controls.companyName.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.newActorForm.controls.name.setValue(value);
      });
  }
}
