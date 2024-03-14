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
import { Component, ViewChild, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Apollo, MutationResult } from 'apollo-angular';
import { TranslocoDirective, translate } from '@ngneat/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatepickerV2Component } from '@energinet-datahub/watt/datepicker';
import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet-datahub/watt/modal';

import { parseGraphQLErrorResponse } from '@energinet-datahub/dh/shared/data-access-graphql';
import { readApiErrorResponse } from '@energinet-datahub/dh/market-participant/data-access-api';

import {
  GetDelegationsForActorDocument,
  StopDelegationsDocument,
  StopDelegationsMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhDelegation } from '../dh-delegations';

@Component({
  standalone: true,
  selector: 'dh-delegation-stop-modal',
  styles: `
    :host {
      display: block;
    }
  `,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    WattButtonComponent,
    WattDatepickerV2Component,

    VaterStackComponent,
  ],
  template: `<watt-modal
    [title]="t('stopModalTitle')"
    *transloco="let t; read: 'marketParticipant.delegation'"
  >
    <form
      id="stop-delegation-form"
      [formGroup]="stopDelegationForm"
      (ngSubmit)="stopSelectedDelegations()"
    >
      <vater-stack align="flex-start">
        <watt-datepicker-v2
          [label]="t('stopDate')"
          [formControl]="stopDelegationForm.controls.stopDate"
        />
      </vater-stack>
      <watt-modal-actions>
        <watt-button (click)="closeModal(false)" variant="secondary">
          {{ t('cancel') }}
        </watt-button>
        <watt-button
          [loading]="isSaving()"
          formId="stop-delegation-form"
          type="submit"
          variant="primary"
        >
          {{ t('shared.stopDelegation') }}
        </watt-button>
      </watt-modal-actions>
    </form>
  </watt-modal>`,
})
export class DhDelegationStopModalComponent extends WattTypedModal<DhDelegation[]> {
  private _fb = inject(NonNullableFormBuilder);
  private _toastService = inject(WattToastService);
  private _apollo = inject(Apollo);

  isSaving = signal(false);

  @ViewChild(WattModalComponent)
  modal: WattModalComponent | undefined;

  stopDelegationForm = this._fb.group({
    stopDate: [null, Validators.required],
  });

  closeModal(result: boolean) {
    this.modal?.close(result);
  }

  stopSelectedDelegations() {
    if (this.stopDelegationForm.invalid) return;

    const { stopDate } = this.stopDelegationForm.getRawValue();

    if (!stopDate) return;

    this.isSaving.set(true);

    this._apollo
      .mutate({
        mutation: StopDelegationsDocument,
        refetchQueries: [GetDelegationsForActorDocument],
        variables: {
          input: {
            stopMessageDelegationDto: this.modalData.map((delegation) => ({
              id: { value: delegation.id },
              periodId: { value: delegation.periodId },
              stopDate: { value: stopDate },
            })),
          },
        },
      })
      .subscribe((response) => this.handleStopDelegationResponse(response));
  }

  private handleStopDelegationResponse(response: MutationResult<StopDelegationsMutation>): void {
    if (response.errors && response.errors.length > 0) {
      this._toastService.open({
        type: 'danger',
        message: parseGraphQLErrorResponse(response.errors),
      });
    }

    if (response.data?.stopDelegation?.errors && response.data?.stopDelegation?.errors.length > 0) {
      this._toastService.open({
        type: 'danger',
        message: readApiErrorResponse(response.data?.stopDelegation?.errors),
      });
    }

    if (response.data?.stopDelegation?.success) {
      this._toastService.open({
        type: 'success',
        message: translate('marketParticipant.delegation.stopDelegationSuccess'),
      });

      this.closeModal(true);
    }

    this.isSaving.set(false);
  }
}