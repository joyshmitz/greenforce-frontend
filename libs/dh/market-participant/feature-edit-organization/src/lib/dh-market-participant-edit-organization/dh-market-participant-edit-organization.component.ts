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
  Component,
  EventEmitter,
  NgModule,
  Output,
} from '@angular/core';
import {
  ContactChanges,
  DhMarketParticipantEditOrganizationDataAccessApiStore,
  OrganizationChanges,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import { LetModule } from '@rx-angular/template/let';
import { DhMarketParticipantOrganizationMasterDataComponentScam } from './master-data/dh-market-participant-organization-master-data.component';
import { DhMarketParticipantOrganizationContactDataComponentScam } from './contact-data/dh-market-participant-organization-contact-data.component';
import {
  WattButtonModule,
  WattSpinnerModule,
  WattTabsModule,
  WattValidationMessageModule,
} from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';
import { ContactDto } from '@energinet-datahub/dh/shared/domain';
import { map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { dhMarketParticipantOrganizationIdParam } from '@energinet-datahub/dh/market-participant/routing';
import { PushModule } from '@rx-angular/template';

@Component({
  selector: 'dh-market-participant-edit-organization',
  templateUrl: './dh-market-participant-edit-organization.component.html',
  styleUrls: ['./dh-market-participant-edit-organization.component.scss'],
  providers: [DhMarketParticipantEditOrganizationDataAccessApiStore],
})
export class DhMarketParticipantEditOrganizationComponent {
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter();

  organizationId$ = this.route.params.pipe(
    map((params) => params[dhMarketParticipantOrganizationIdParam] as string)
  );

  isLoading$ = this.store.isLoading$;
  isEditing$ = this.store.isEditing$;
  contacts$ = this.store.contacts$;
  organization$ = this.store.organization$;
  validation$ = this.store.validation$;

  constructor(
    public store: DhMarketParticipantEditOrganizationDataAccessApiStore,
    private route: ActivatedRoute
  ) {
    this.store.getOrganizationAndContacts(this.organizationId$);
  }

  readonly onMasterDataChanged = (changes: OrganizationChanges) => {
    this.store.setMasterDataChanges(changes);
  };

  readonly onContactsChanged = (
    added: ContactChanges[],
    removed: ContactDto[]
  ) => {
    this.store.setContactChanges(added, removed);
  };

  readonly onCancelled = () => {
    this.cancelled.emit();
  };

  readonly onSaved = () => {
    this.store.save();
  };
}

@NgModule({
  imports: [
    LetModule,
    CommonModule,
    TranslocoModule,
    WattButtonModule,
    WattTabsModule,
    WattSpinnerModule,
    PushModule,
    DhMarketParticipantOrganizationMasterDataComponentScam,
    DhMarketParticipantOrganizationContactDataComponentScam,
    WattValidationMessageModule,
  ],
  exports: [DhMarketParticipantEditOrganizationComponent],
  declarations: [DhMarketParticipantEditOrganizationComponent],
})
export class DhMarketParticipantEditOrganizationScam {}
