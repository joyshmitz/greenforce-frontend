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
import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnChanges } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { MatTableModule } from '@angular/material/table';
import {
  WattEmptyStateModule,
  WattSpinnerModule,
} from '@energinet-datahub/watt';
import { GridAreaAuditLogEntryDto } from '@energinet-datahub/dh/shared/domain';

interface AuditLogEntry {
  timestamp: string;
  message: string;
}

@Component({
  selector: 'dh-market-participant-gridarea-details-auditlog',
  styleUrls: [
    './dh-market-participant-gridarea-details-auditlog.component.scss',
  ],
  templateUrl:
    './dh-market-participant-gridarea-details-auditlog.component.html',
})
export class DhMarketParticipantGridAreaDetailsAuditLogComponent
  implements OnChanges
{
  constructor(private translocoServie: TranslocoService) {}

  @Input() isLoading = false;
  @Input() auditLogEntries: GridAreaAuditLogEntryDto[] = [];

  displayedColumns: string[] = ['timestamp', 'message'];
  rows: AuditLogEntry[] = [];

  ngOnChanges(): void {
    this.rows = this.auditLogEntries
      .map((entry) => {
        const field = this.translocoServie.translate(
          'marketParticipant.gridAreas.detailsAuditLog.fields.' +
            entry.field.toLowerCase()
        );
        const changed = this.translocoServie.translate(
          'marketParticipant.gridAreas.detailsAuditLog.changed'
        );
        const to = this.translocoServie.translate(
          'marketParticipant.gridAreas.detailsAuditLog.to'
        );
        return {
          timestamp: entry.timestamp,
          // 8 first chars of user ID until we can retrieve user name
          message: `${entry.userId.substring(0, 8)} ${changed} ${field} ${to} ${entry.newValue}`,
        };
      })
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }
}

@NgModule({
  imports: [
    CommonModule,
    TranslocoModule,
    MatTableModule,
    WattEmptyStateModule,
    WattSpinnerModule,
    DhSharedUiDateTimeModule,
  ],
  declarations: [DhMarketParticipantGridAreaDetailsAuditLogComponent],
  exports: [DhMarketParticipantGridAreaDetailsAuditLogComponent],
})
export class DhMarketParticipantGridAreaDetailsAuditLogScam {}
