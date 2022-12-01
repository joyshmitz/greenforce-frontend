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
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { LetModule } from '@rx-angular/template';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { MessageArchiveSearchResultItemDto } from '@energinet-datahub/dh/shared/domain';
import { WattIconModule } from '@energinet-datahub/watt/icon';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattBadgeModule } from '@energinet-datahub/watt/badge';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import {
  WattTableComponent,
  WattTableColumnDef,
  WattTableCellDirective,
} from '@energinet-datahub/watt/table';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { ToLowerSort } from '@energinet-datahub/dh/shared/util-table';
import { DocumentTypes } from '@energinet-datahub/dh/message-archive/domain';
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

import {
  DhMessageArchiveDrawerComponent,
  DhMessageArchiveDrawerScam,
} from '../drawer/dh-message-archive-drawer.component';

import { ActorNamePipe } from '../shared/dh-message-archive-actor.pipe';
import { DocumentTypeNamePipe } from '../shared/dh-message-archive-documentTypeName.pipe';

import { DhMessageArchiveStatusComponentScam } from '../shared/dh-message-archive-status.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-message-archive-log-search-result',
  templateUrl: './dh-message-archive-log-search-result.component.html',
  styleUrls: ['./dh-message-archive-log-search-result.component.scss'],
})
export class DhMessageArchiveLogSearchResultComponent
  implements AfterViewInit, OnChanges
{
  private _translateScrope = 'messageArchive.search';
  private _selectedRow: string | null | undefined = null;
  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(DhMessageArchiveDrawerComponent)
  messageDrawer!: DhMessageArchiveDrawerComponent;
  @Input() searchResult: Array<MessageArchiveSearchResultItemDto> = [];
  @Output() showLogDownloadPage =
    new EventEmitter<MessageArchiveSearchResultItemDto>();
  @Output() downloadLogFile =
    new EventEmitter<MessageArchiveSearchResultItemDto>();
  @Input() isSearching: boolean | null = false;

  columns: WattTableColumnDef<MessageArchiveSearchResultItemDto>;

  @Input() hasSearchError: boolean | null = false;
  @Input() isInit: boolean | null = false;
  @Input() actors: WattDropdownOptions | null = null;

  DocumentTypes = DocumentTypes;

  readonly dataSource: MatTableDataSource<MessageArchiveSearchResultItemDto> =
    new MatTableDataSource<MessageArchiveSearchResultItemDto>();

  constructor(private translocoService: TranslocoService) {
    this.columns = {
      messageId: {
        header: () =>
          translocoService.translate(`${this._translateScrope}.messageId`),
      },
      rsmName: {
        header: () =>
          translocoService.translate(`${this._translateScrope}.documenttype`),
      },
      senderGln: {
        header: () =>
          translocoService.translate(`${this._translateScrope}.senderId`),
      },
      receiverGln: {
        header: () =>
          translocoService.translate(`${this._translateScrope}.receiverId`),
      },
      createdDate: {
        header: () =>
          translocoService.translate(`${this._translateScrope}.dateTime`),
      },
      httpData: {
        header: () =>
          translocoService.translate(`${this._translateScrope}.status`),
      },
    };
  }

  onRowClick(row: MessageArchiveSearchResultItemDto) {
    this._selectedRow = row.messageId;
    this.messageDrawer.open(row);
  }

  isActiveRow = (row: MessageArchiveSearchResultItemDto) => {
    return this._selectedRow === row.messageId;
  };

  onScroll() {
    console.log('get more data');
  }

  ngOnChanges() {
    if (this.searchResult) this.dataSource.data = this.searchResult;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.matSort;
    this.dataSource.sortingDataAccessor = ToLowerSort();
  }
}
@NgModule({
  declarations: [DhMessageArchiveLogSearchResultComponent],
  exports: [DhMessageArchiveLogSearchResultComponent],
  imports: [
    WattTableCellDirective,
    CommonModule,
    TranslocoModule,
    LetModule,
    MatTableModule,
    MatSortModule,
    WattIconModule,
    WattTableComponent,
    WattEmptyStateModule,
    WattButtonModule,
    WattBadgeModule,
    DhSharedUiDateTimeModule,
    WattSpinnerModule,
    WattCardModule,
    DhMessageArchiveDrawerScam,
    DhMessageArchiveStatusComponentScam,
    ActorNamePipe,
    DocumentTypeNamePipe,
  ],
})
export class DhMessageArchiveLogSearchResultScam {}
