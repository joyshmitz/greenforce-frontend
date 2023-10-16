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
import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from '@apollo/client';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL } from '@energinet-datahub/watt/modal';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WattButtonComponent, WATT_MODAL, AsyncPipe, DatePipe],
  standalone: true,
  template: `
    <watt-modal #modal title="Automatic logout" size="small">
      <p>You will be logged out in:</p>
      <span class="watt-headline-1">{{ data.countdown$ | async }}</span>
      <br />
      <p>We are logging you out for security reasons.</p>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(true)">Log out</watt-button>
        <watt-button (click)="modal.close(false)">Stay logged in</watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class EoIdleTimerCountdownModalComponent {
  constructor(
    private dialogRef: MatDialogRef<EoIdleTimerCountdownModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { countdown$: Observable<string> }
  ) {
    data.countdown$.subscribe((countdown) => {
      if (countdown === '00:00') {
        this.dialogRef.close(true);
      }
    });
  }
}
