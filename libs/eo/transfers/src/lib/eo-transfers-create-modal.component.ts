//#region License
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
//#endregion
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { translations } from '@energinet-datahub/eo/translations';

import {
  EoListedTransfer,
  EoTransferAgreementRequest,
  EoTransfersService,
} from './eo-transfers.service';
import {
  EoTransfersFormComponent,
  EoTransfersFormValues,
} from './form/eo-transfers-form.component';
import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { Actor } from '@energinet-datahub/eo/auth/domain';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-transfers-create-modal',
  imports: [EoTransfersFormComponent, WATT_MODAL, WattSpinnerComponent, TranslocoPipe],
  template: `
    @if (opened) {
      <watt-modal
        #modal
        [title]="translations.createTransferAgreementProposal.title | transloco"
        [closeLabel]="translations.createTransferAgreementProposal.closeLabel | transloco"
        (closed)="onClosed()"
        minHeight="634px"
        size="large"
      >
        <!-- We don't use the build-in loading state for the modal, since it wont update properly -->
        @if (creatingTransferAgreementProposal) {
          <div class="watt-modal__spinner" style="z-index: 2;">
            <watt-spinner />
          </div>
        }

        <eo-transfers-form
          [initialValues]="{ senderTin: authService.user()?.profile?.org_cvr }"
          [transferAgreements]="transferAgreements()"
          [actors]="actors()"
          [generateProposalFailed]="creatingTransferAgreementProposalFailed"
          [proposalId]="proposalId"
          (submitted)="createAgreement($event)"
          (canceled)="modal.close(false)"
          [mode]="'create'"
        />
      </watt-modal>
    }
  `,
})
export class EoTransfersCreateModalComponent {
  transferAgreements = input.required<EoListedTransfer[]>();
  actors = input.required<Actor[]>();
  transferAgreementCreated = output<EoListedTransfer>();

  @ViewChild(WattModalComponent) modal!: WattModalComponent;

  protected authService = inject(EoAuthService);
  private service = inject(EoTransfersService);
  private cd = inject(ChangeDetectorRef);

  protected translations = translations;

  protected creatingTransferAgreementProposal = false;
  protected creatingTransferAgreementProposalFailed = false;
  protected isFormValid = false;
  protected opened = false;
  protected proposalId: null | string = null;

  open() {
    /**
     * This is a workaround for "lazy loading" the modal content
     */
    this.opened = true;
    this.cd.detectChanges();
    this.modal.open();
  }

  onClosed() {
    this.creatingTransferAgreementProposal = false;
    this.creatingTransferAgreementProposalFailed = false;
    this.isFormValid = false;
    this.opened = false;
  }

  createAgreement(transferAgreement: EoTransfersFormValues) {
    transferAgreement.isProposal
      ? this.createAgreementProposal(transferAgreement)
      : this.createAgreementRequest(transferAgreement);
  }

  createAgreementProposal(transferAgreementFormValues: EoTransfersFormValues) {
    const { receiverTin, period } = transferAgreementFormValues;
    const { startDate, endDate } = period;

    if (!startDate) return;

    this.creatingTransferAgreementProposal = true;
    this.proposalId = null;
    const proposal = {
      receiverTin: receiverTin,
      startDate,
      endDate,
      transferAgreementStatus: 'Proposal' as EoListedTransfer['transferAgreementStatus'],
    };
    this.service.createAgreementProposal(proposal).subscribe({
      next: (proposalId) => {
        this.proposalId = proposalId;
        this.creatingTransferAgreementProposal = false;
        this.creatingTransferAgreementProposalFailed = false;
        this.transferAgreementCreated.emit({
          ...proposal,
          id: proposalId,
          senderTin: this.authService.user()?.profile.org_cvr as string,
          senderName: this.authService.user()?.profile.name as string,
        });
        this.cd.detectChanges();
      },
      error: () => {
        this.proposalId = null;
        this.creatingTransferAgreementProposal = false;
        this.creatingTransferAgreementProposalFailed = true;
        this.cd.detectChanges();
      },
    });
  }

  createAgreementRequest(transferAgreementFormValues: EoTransfersFormValues) {
    const receiverOrganization: Actor | undefined = this.actors().find(
      (actor) => actor.tin === transferAgreementFormValues.receiverTin
    );
    const senderOrganization: Actor | undefined = this.actors().find(
      (actor) => actor.tin === transferAgreementFormValues.senderTin
    );
    if (!receiverOrganization || !senderOrganization) return;

    const transferAgreementRequest: EoTransferAgreementRequest = {
      receiverOrganizationId: receiverOrganization.org_id,
      senderOrganizationId: senderOrganization.org_id,
      startDate: transferAgreementFormValues.period.startDate,
      endDate: transferAgreementFormValues.period.endDate ?? undefined,
      type: transferAgreementFormValues.transferAgreementType,
    };
    this.service
      .createTransferAgreement(transferAgreementRequest)
      .subscribe((transferAgreement) => {
        this.transferAgreementCreated.emit({
          id: transferAgreement.id,
          senderTin: transferAgreement.senderTin,
          startDate: transferAgreement.startDate,
          senderName: transferAgreement.senderName,
          endDate: transferAgreement.endDate ?? null,
          receiverTin: transferAgreement.receiverTin,
          transferAgreementStatus: 'Inactive',
        });
      });
  }
}
