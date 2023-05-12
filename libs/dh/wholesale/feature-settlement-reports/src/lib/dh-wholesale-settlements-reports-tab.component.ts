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
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { WattChipsComponent } from '@energinet-datahub/watt/chips';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { WattDatepickerModule } from '@energinet-datahub/watt/datepicker';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { MarketParticipantFilteredActorDto, graphql } from '@energinet-datahub/dh/shared/domain';
import { Subject, takeUntil } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { WattDropdownModule } from '@energinet-datahub/watt/dropdown';
import { ActorFilter } from '@energinet-datahub/dh/wholesale/domain';

@Component({
  standalone: true,
  selector: 'dh-wholesale-settlements-reports-tab',
  templateUrl: './dh-wholesale-settlements-reports-tab.component.html',
  styleUrls: ['./dh-wholesale-settlements-reports-tab.component.scss'],
  imports: [
    WATT_TABS,
    WattCardModule,
    TranslocoModule,
    WattButtonModule,
    WattChipsComponent,
    WattDatepickerModule,
    ReactiveFormsModule,
    WattFormFieldModule,
    WattDropdownModule,
  ],
})
export class DhWholesaleSettlementsReportsTabComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private apollo = inject(Apollo);
  private destroy$ = new Subject<void>();
  private selectedActor?: MarketParticipantFilteredActorDto;

  @Input() set executionTime(executionTime: { start: string; end: string }) {
    this.searchForm.patchValue({ executionTime });
  }
  searchForm = this.fb.group({
    executionTime: [this.executionTime],
    actor: [{ value: '', disabled: true }],
  });

  actors!: ActorFilter;

  actorsQuery = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetActorsForSettlementReportDocument,
  });

  ngOnInit(): void {
    this.actorsQuery.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        this.actors = result.data?.actorsforsettlement ?? [];
        if (!result.loading) this.searchForm.controls.actor.enable();
      },
    });
  }
}
