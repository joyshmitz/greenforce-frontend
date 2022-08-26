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
import { DhMarketParticipantOverviewDataAccessApiStore } from '@energinet-datahub/dh/market-participant/data-access-api';
import { LetModule } from '@rx-angular/template/let';
import { TranslocoModule } from '@ngneat/transloco';
import {
  WattButtonModule,
  WattEmptyStateModule,
  WattSpinnerModule,
  WattValidationMessageModule,
} from '@energinet-datahub/watt';
import { Router } from '@angular/router';
import {
  dhMarketParticipantGridAreasCreatePath,
  dhMarketParticipantGridAreasEditPath,
  dhMarketParticipantGridAreasPath,
  dhMarketParticipantPath,
} from '@energinet-datahub/dh/market-participant/routing';
import { DhMarketParticipantGridAreaOverviewScam } from './overview/dh-market-participant-gridarea-overview.component';
import { PushModule } from '@rx-angular/template';

@Component({
  selector: 'dh-market-participant-gridarea',
  styleUrls: ['./dh-market-participant-gridarea.component.scss'],
  templateUrl: './dh-market-participant-gridarea.component.html',
  providers: [DhMarketParticipantOverviewDataAccessApiStore],
})
export class DhMarketParticipantGridAreaComponent {
  constructor(
    private store: DhMarketParticipantOverviewDataAccessApiStore,
    private router: Router
  ) {
    this.store.loadOverviewRows();
  }

  isLoading$ = this.store.isLoading$;
  validationError$ = this.store.validationError$;
  overviewList$ = this.store.overviewList$;
  gridAreas$ = this.store.gridAreas$;

  readonly editGridArea = (gridAreaId: string) => {
    const url = this.router.createUrlTree([
      dhMarketParticipantPath,
      dhMarketParticipantGridAreasPath,
      gridAreaId,
      dhMarketParticipantGridAreasEditPath,
    ]);

    this.router.navigateByUrl(url);
  };

  readonly createGridArea = () => {
    const url = this.router.createUrlTree([
      dhMarketParticipantPath,
      dhMarketParticipantGridAreasPath,
      dhMarketParticipantGridAreasCreatePath,
    ]);

    this.router.navigateByUrl(url);
  };
}

@NgModule({
  imports: [
    CommonModule,
    LetModule,
    TranslocoModule,
    WattButtonModule,
    WattEmptyStateModule,
    WattSpinnerModule,
    WattValidationMessageModule,
    DhMarketParticipantGridAreaOverviewScam,
    PushModule,
  ],
  declarations: [DhMarketParticipantGridAreaComponent],
})
export class DhMarketParticipantGridAreaScam {}
