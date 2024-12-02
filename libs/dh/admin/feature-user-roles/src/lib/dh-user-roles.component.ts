//#region License
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
//#endregion
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTableColumnDef, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattTooltipDirective } from '@energinet-datahub/watt/tooltip';

import {
  DhActorUserRole,
  DhActorUserRoles,
  UpdateUserRoles,
} from '@energinet-datahub/dh/admin/shared';

import {
  FilterUserRolesPipe,
  UserRolesIntoTablePipe,
} from './dh-filter-user-roles-into-table.pipe';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { GetActorsAndUserRolesDocument } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-user-roles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  templateUrl: './dh-user-roles.component.html',
  styleUrls: ['./dh-user-roles.component.scss'],
  imports: [
    TranslocoDirective,
    MatExpansionModule,
    FormsModule,

    WATT_TABLE,
    WattIconComponent,
    WattBadgeComponent,
    WattTooltipDirective,
    WattFieldErrorComponent,
    WATT_EXPANDABLE_CARD_COMPONENTS,

    FilterUserRolesPipe,
    UserRolesIntoTablePipe,
  ],
})
export class DhUserRolesComponent {
  private actorsAndRolesQuery = lazyQuery(GetActorsAndUserRolesDocument);
  private _updateUserRoles: UpdateUserRoles = {
    actors: [],
  };

  id = input.required<string>();
  selectMode = input(false);
  expanded = input(true);

  updateUserRoles = output<UpdateUserRoles>();

  user = computed(() => this.actorsAndRolesQuery.data()?.userById);

  userRolesPerActor = computed(() => this.user()?.actors ?? []);

  columns: WattTableColumnDef<DhActorUserRole> = {
    name: { accessor: 'name' },
    description: { accessor: 'description', sort: false },
  };

  constructor() {
    effect(() => {
      this.actorsAndRolesQuery.query({ variables: { id: this.id() } });
    });
  }

  resetUpdateUserRoles(): void {
    this._updateUserRoles = {
      actors: [],
    };
  }

  checkIfAtLeastOneRoleIsAssigned(actorId: string): boolean {
    const actor = this._updateUserRoles.actors.find((actor) => actor.id === actorId);
    return actor ? actor.atLeastOneRoleIsAssigned : false;
  }

  selectionChanged(actorId: string, userRoles: DhActorUserRoles, allAssignable: DhActorUserRoles) {
    const actor = this.getOrAddActor(actorId);

    actor.atLeastOneRoleIsAssigned = userRoles.length > 0;

    actor.userRolesToUpdate.added = userRoles
      .filter((userRole) => !userRole.assigned)
      .map((userRole) => userRole.id);

    actor.userRolesToUpdate.removed = allAssignable
      .filter((userRole) => userRole.assigned)
      .filter((userRole) => !userRoles.map((ur) => ur.id).includes(userRole.id))
      .map((userRole) => userRole.id);

    this.updateUserRoles.emit(this._updateUserRoles);
  }

  private getOrAddActor(actorId: string) {
    const actor = this._updateUserRoles.actors.find((actor) => actor.id === actorId);
    if (!actor) {
      const actorChanges = {
        id: actorId,
        atLeastOneRoleIsAssigned: true,
        userRolesToUpdate: { added: [], removed: [] },
      };

      this._updateUserRoles.actors.push(actorChanges);
      return actorChanges;
    }

    return actor;
  }
}
