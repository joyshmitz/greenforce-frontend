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
import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Input, ViewChild, inject } from '@angular/core';
import { ArchivedMessage, Stream } from '@energinet-datahub/dh/shared/domain';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { WattDrawerComponent, WattDrawerModule } from '@energinet-datahub/watt/drawer';
import { WattIconModule } from '@energinet-datahub/watt/icon';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { DhMessageArchiveStatusComponent } from '../shared/dh-message-archive-status.component';
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { DhMessageArchiveDocumentApiStore } from '@energinet-datahub/dh/message-archive/data-access-api';
import { ActorNamePipe } from '../shared/dh-message-archive-actor.pipe';
import { DocumentTypeNamePipe } from '../shared/dh-message-archive-documentTypeName.pipe';
import { PushModule } from '@rx-angular/template/push';
import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/shared/ui-util';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { provideComponentStore } from '@ngrx/component-store';

@Component({
  standalone: true,
  selector: 'dh-message-archive-drawer',
  templateUrl: './dh-message-archive-drawer.component.html',
  styleUrls: ['./dh-message-archive-drawer.component.scss'],
  imports: [
    CommonModule,
    WattDrawerModule,
    TranslocoModule,
    WattIconModule,
    DhSharedUiDateTimeModule,
    DhMessageArchiveStatusComponent,
    MatDividerModule,
    ActorNamePipe,
    DocumentTypeNamePipe,
    WattButtonModule,
    PushModule,
    DhEmDashFallbackPipeScam,
  ],
  providers: [provideComponentStore(DhMessageArchiveDocumentApiStore)],
})
export class DhMessageArchiveDrawerComponent {
  private document = inject(DOCUMENT);
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  @ViewChild('drawer') drawer!: WattDrawerComponent;
  @Input() actors: WattDropdownOptions | null = null;

  message: ArchivedMessage | null = null;

  constructor(private apiStore: DhMessageArchiveDocumentApiStore) {}

  open(message: ArchivedMessage) {
    this.message = message;
    this.drawer.open();
  }

  onClose() {
    this.drawer.close();
  }
  downloadDocument(message: ArchivedMessage | null) {
    if (message === null) return;

    this.apiStore.getDocument({
      id: message.messageId,
      onSuccessFn: this.onSuccesFn,
      onErrorFn: this.onErrorFn,
    });
  }

  private readonly onSuccesFn = (id: string, data: Stream) => {
    const blobPart = data as unknown as BlobPart;
    const blob = new Blob([blobPart]);
    const basisData = window.URL.createObjectURL(blob);
    const link = this.document.createElement('a');
    link.href = basisData;
    link.download = `${id}.txt`;
    link.click();
    link.remove();
  };

  private readonly onErrorFn = () => {
    const message = this.transloco.translate('messageArchive.document.downloadFailed');

    this.toastService.open({ message, type: 'danger' });
  };
}
