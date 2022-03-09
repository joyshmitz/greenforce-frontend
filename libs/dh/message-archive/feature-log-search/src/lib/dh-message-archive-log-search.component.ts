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

 import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { CommonModule } from '@angular/common';
 import { ChangeDetectionStrategy, Component, NgModule, OnDestroy } from "@angular/core";
 import {
  WattButtonModule,
  WattFormFieldModule,
  WattIconModule,
  WattInputModule,
  WattCheckboxModule,
  WattBadgeModule,
 } from '@energinet-datahub/watt';
 import { DhMessageArchiveDataAccessApiModule, DhMessageArchiveDataAccessBlobApiModule } from '@energinet-datahub/dh/message-archive/data-access-api'
 import { SearchCriteria, SearchResultItemDto } from '@energinet-datahub/dh/shared/data-access-api';
 import { LetModule } from '@rx-angular/template';
 import { TranslocoModule } from '@ngneat/transloco';
 import { DhMessageArchiveLogSearchResultScam } from './searchresult/dh-message-archive-log-search-result.component';
 import { BusinessReasonCodes } from '../../../models/businessReasonCodes'
 import { DocumentTypes } from '../../../models/documentTypes'
 import { RoleTypes } from '../../../models/roleTypes'
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

 @Component({
   changeDetection: ChangeDetectionStrategy.OnPush,
   selector: 'dh-message-archive-log-search',
   styleUrls: ['./dh-message-archive-log-search.component.scss'],
   templateUrl: './dh-message-archive-log-search.component.html',
   providers: [DhMessageArchiveDataAccessApiModule, DhMessageArchiveDataAccessBlobApiModule],

 })
 export class DhMessageArchiveLogSearchComponent implements OnDestroy {
    private destroy$ = new Subject<void>();

    searchResult$ = this.store.searchResult$;
    searching$ = this.store.isSearching$;
    hasSearchError$ = this.store.hasGeneralError$;

    searchResultsDtos: Array<SearchResultItemDto> = [];
    businessReasonCodes = BusinessReasonCodes;
    documentTypes = DocumentTypes;
    roleTypes = RoleTypes;

    private regexBlobName = new RegExp(/\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\/.*/);

    tempCheckedValue = false;

   searchCriteria: SearchCriteria = {
     messageId: "253698245",
     reasonCode: null,
     dateTimeFrom: "2022-03-04T00:00:00Z",
     dateTimeTo: "2022-03-04T23:59:59Z",
     senderRoleType: null,
     rsmName: null,
     includeRelated: false,
     traceId: null,
     functionName: null,
     invocationId: null,
    };

   constructor(
     private store: DhMessageArchiveDataAccessApiModule,
     private router: Router,
     private currentRoute: ActivatedRoute,
     private logStore: DhMessageArchiveDataAccessBlobApiModule)
  {
    this.store.searchResult$.subscribe((searchResult) => {
      this.searchResultsDtos = searchResult;
    })

    this.currentRoute.queryParamMap.subscribe(q => {
        this.searchCriteria.traceId = q.has("traceId") ? q.get("traceId") : null;
        this.searchCriteria.functionName = q.has("functionName") ? q.get("functionName") : null;
        this.searchCriteria.invocationId = q.has("invocationId") ? q.get("invocationId") : null;
    });
  }

  onSubmit() {
    if (!this.searchCriteria.messageId) {
      this.searchCriteria.includeRelated = false;
    }

    if(this.validateSearchParams()) {
      this.store.searchLogs(this.searchCriteria)
    }
  }

  redirectToDownloadLogPage(resultItem: SearchResultItemDto) {
    const blobName = this.findBlobName(resultItem.blobContentUri);
    const encodedBlobName = encodeURIComponent(blobName);
    const url = this.router.serializeUrl(this.router.createUrlTree([`/message-archive/${encodedBlobName}`]));
    const blobViewWindow = window.open(url, '_blank');
    blobViewWindow?.sessionStorage.setItem("messageId", resultItem.messageId ?? "");
  };

  downloadLog(resultItem: SearchResultItemDto) {
    const blobName = this.findBlobName(resultItem.blobContentUri);
    this.logStore.downloadLogFile(blobName);
  };

  validateSearchParams(): boolean {
    return (this.searchCriteria.dateTimeFrom != null && this.searchCriteria.dateTimeTo != null)
     && (this.searchCriteria.dateTimeFrom.length === 20 && this.searchCriteria.dateTimeTo.length === 20);
  }

  findBlobName(blobUrl: string): string {
    if (this.regexBlobName.test(blobUrl)) {
      const match = this.regexBlobName.exec(blobUrl);
      return match != null ? match[0] : "";
    }
    return "";
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
 @NgModule({
   imports: [
    WattFormFieldModule,
    WattInputModule,
    WattButtonModule,
    WattIconModule,
    WattCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LetModule,
    TranslocoModule,
    DhMessageArchiveLogSearchResultScam,
    WattBadgeModule
   ],
   declarations: [DhMessageArchiveLogSearchComponent],
 })
 export class DhMessageArchiveLogSearchScam {}
