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
import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattTypedModal, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { DhCertificateUploaderComponent } from '../certificate/dh-certificate-uploader.component';

@Component({
  selector: 'dh-replace-client-secret-modal',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <watt-modal
      #modal
      *transloco="
        let t;
        read: 'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.clientSecret.replaceSecretModal'
      "
      [title]="t('title')"
    >
      <p>{{ t('message') }}</p>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('cancel') }}
        </watt-button>

        <dh-certificate-uploader
          [actorId]="modalData.actorId"
          (uploadSuccess)="modal.close(true)"
        />
      </watt-modal-actions>
    </watt-modal>
  `,
  imports: [TranslocoDirective, WATT_MODAL, WattButtonComponent, DhCertificateUploaderComponent],
})
export class DhReplaceClientSecretModalComponent extends WattTypedModal<{
  actorId: string;
}> {}
