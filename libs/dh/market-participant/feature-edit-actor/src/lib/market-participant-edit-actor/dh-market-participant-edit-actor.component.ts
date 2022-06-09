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
import { Component, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule, PushModule } from '@rx-angular/template';
import { map } from 'rxjs';

import {
  ActorChanges,
  ActorContactChanges,
  DhMarketParticipantEditActorDataAccessApiStore,
  MeteringPointTypeChanges,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import {
  dhMarketParticipantActorIdParam,
  dhMarketParticipantOrganizationIdParam,
  dhMarketParticipantPath,
} from '@energinet-datahub/dh/market-participant/routing';
import {
  GridAreaDto,
  EicFunction,
  MarketRoleDto,
  ActorContactDto,
} from '@energinet-datahub/dh/shared/domain';
import {
  WattButtonModule,
  WattSpinnerModule,
  WattTabsModule,
  WattValidationMessageModule,
} from '@energinet-datahub/watt';

import { DhMarketParticipantActorGridAreasComponentScam } from './grid-areas/dh-market-participant-actor-grid-areas.component';
import { DhMarketParticipantActorContactDataComponentScam } from './contact-data/dh-market-participant-actor-contact-data.component';
import { DhMarketParticipantActorMasterDataComponentScam } from './master-data/dh-market-participant-actor-master-data.component';
import { DhMarketParticipantActorMeteringPointTypeComponentScam } from './metering-point-type/dh-market-participant-actor-metering-point-type.component';
import { DhMarketParticipantActorMarketRolesComponentScam } from './market-roles/dh-market-participant-actor-market-roles.component';

@Component({
  selector: 'dh-market-participant-edit-actor',
  templateUrl: './dh-market-participant-edit-actor.component.html',
  styleUrls: ['./dh-market-participant-edit-actor.component.scss'],
  providers: [DhMarketParticipantEditActorDataAccessApiStore],
})
export class DhMarketParticipantEditActorComponent {
  routeParams$ = this.route.params.pipe(
    map((params) => ({
      organizationId: params[dhMarketParticipantOrganizationIdParam] as string,
      actorId: params[dhMarketParticipantActorIdParam] as string,
    }))
  );
  isLoading$ = this.store.isLoading$;
  isEditing$ = this.store.isEditing$;
  actor$ = this.store.actor$;
  validation$ = this.store.validation$;
  gridAreas$ = this.store.gridAreas$;
  selectedGridAreas$ = this.store.selectedGridAreas$;
  marketRolesEicFunctions$ = this.store.marketRolesEicFunctions$;
  contacts$ = this.store.contacts$;

  constructor(
    private store: DhMarketParticipantEditActorDataAccessApiStore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.store.loadInitialData(this.routeParams$);
  }

  readonly onMasterDataChanged = (changes: ActorChanges) => {
    this.store.setMasterDataChanges(changes);
  };

  readonly onMeteringPointTypeChanged = (changes: MeteringPointTypeChanges) => {
    this.store.setMeteringPoinTypeChanges(changes);
  };

  readonly onGridAreasChanged = (changes: GridAreaDto[]) => {
    this.store.setGridAreaChanges(changes);
  };

  readonly onMarketRolesEicFunctionsChange = (eicFunctions: EicFunction[]) => {
    const marketRoles = eicFunctions.map(this.toMarketRole);
    this.store.setMarketRoles(marketRoles);
  };

  readonly onContactsChanged = (
    added: ActorContactChanges[],
    removed: ActorContactDto[]
  ) => {
    this.store.setContactChanges(added, removed);
  };

  readonly onCancelled = () => {
    this.backToOverview();
  };

  readonly onSaved = () => {
    this.store.save(this.backToOverview);
  };

  private readonly backToOverview = () => {
    this.router.navigateByUrl(dhMarketParticipantPath);
  };

  private toMarketRole(value: EicFunction): MarketRoleDto {
    return { eicFunction: value };
  }
}

@NgModule({
  imports: [
    LetModule,
    PushModule,
    CommonModule,
    TranslocoModule,
    WattButtonModule,
    WattTabsModule,
    WattSpinnerModule,
    PushModule,
    DhMarketParticipantActorMasterDataComponentScam,
    DhMarketParticipantActorMeteringPointTypeComponentScam,
    DhMarketParticipantActorGridAreasComponentScam,
    DhMarketParticipantActorMarketRolesComponentScam,
    DhMarketParticipantActorContactDataComponentScam,
    WattValidationMessageModule,
  ],
  exports: [DhMarketParticipantEditActorComponent],
  declarations: [DhMarketParticipantEditActorComponent],
})
export class DhMarketParticipantEditActorScam {}
