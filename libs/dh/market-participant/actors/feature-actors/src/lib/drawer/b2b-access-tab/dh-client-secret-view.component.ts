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
import { Component, Input, effect, inject, signal } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { DhMarketPartyCredentialsStore } from '@energinet-datahub/dh/market-participant/actors/data-access-api';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattCopyToClipboardDirective } from '@energinet-datahub/watt/clipboard';

import { DhRemoveClientSecretModalComponent } from './dh-remove-client-secret-modal.component';
import { DhCreateSecretComponent } from './dh-create-secret.component';

type DhClientSecretTableRow = {
  translationKey: string;
  value?: string;
  valueIsDate?: boolean;
  showActionButton?: boolean;
};

@Component({
  selector: 'dh-client-secret-view',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }

      h4 {
        margin-top: 0;
      }
    `,
  ],
  templateUrl: './dh-client-secret-view.component.html',
  imports: [
    NgIf,
    TranslocoDirective,
    TranslocoPipe,

    WattButtonComponent,
    WATT_CARD,
    VaterFlexComponent,
    VaterStackComponent,
    WattSpinnerComponent,
    WattDatePipe,
    WATT_TABLE,
    WattCopyToClipboardDirective,

    DhEmDashFallbackPipe,
    DhCreateSecretComponent,
  ],
})
export class DhClientSecretViewComponent {
  private readonly store = inject(DhMarketPartyCredentialsStore);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);
  private readonly modalService = inject(WattModalService);

  dataSource = new WattTableDataSource<DhClientSecretTableRow>([]);
  columns: WattTableColumnDef<DhClientSecretTableRow> = {
    translationKey: { accessor: 'translationKey' },
    value: { accessor: 'value' },
    showActionButton: { accessor: 'showActionButton', align: 'right' },
  };

  wasClientSecretCopied = signal(false);

  clientSecret = toSignal(this.store.clientSecret$);
  clientSecretExists = toSignal(this.store.clientSecretExists$);
  clientSecretMetadata = toSignal(this.store.clientSecretMetadata$);

  @Input({ required: true }) actorId = '';

  constructor() {
    effect(() => {
      const tableData: DhClientSecretTableRow[] = [
        {
          translationKey: 'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.clientId',
          value: this.clientSecretMetadata()?.clientSecretIdentifier,
        },
        {
          translationKey:
            'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.clientSecretLabel',
          value: this.clientSecret() ?? '**********',
          showActionButton: true,
        },
        {
          translationKey: 'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.expiryDate',
          value: this.clientSecretMetadata()?.expirationDate,
          valueIsDate: true,
        },
      ];

      this.dataSource.data = tableData;
    });
  }

  onCopySuccess(isSuccess: boolean): void {
    this.wasClientSecretCopied.set(isSuccess);

    if (isSuccess) {
      this.store.resetClientSecret();
    }
  }

  removeClientSecret(): void {
    this.modalService.open({
      component: DhRemoveClientSecretModalComponent,
      onClosed: (result) => {
        if (result) {
          this.store.removeActorCredentials({
            actorId: this.actorId,
            onSuccess: this.onRemoveSuccessFn,
            onError: this.onRemoveErrorFn,
          });
        }
      },
    });
  }

  private readonly onRemoveSuccessFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.removeSuccess'
    );

    this.toastService.open({ type: 'success', message });
  };

  private readonly onRemoveErrorFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.removeError'
    );

    this.toastService.open({ type: 'danger', message });
  };
}
