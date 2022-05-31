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
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GridAreaDto } from '@energinet-datahub/dh/shared/domain';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'dh-market-participant-actor-grid-areas',
  templateUrl: './dh-market-participant-actor-grid-areas.component.html',
})
export class DhMarketParticipantActorGridAreasComponent {
  @Input() gridAreas: GridAreaDto[] = [];
  @Input() selectedGridAreas: GridAreaDto[] | undefined;
  @Output() hasChanges = new EventEmitter<GridAreaDto[]>();

  readonly onModelChanged = () => {
    this.hasChanges.emit(this.selectedGridAreas);
  };
}

@NgModule({
  imports: [CommonModule, FormsModule, MatListModule],
  exports: [DhMarketParticipantActorGridAreasComponent],
  declarations: [DhMarketParticipantActorGridAreasComponent],
})
export class DhMarketParticipantActorGridAreasComponentScam {}
