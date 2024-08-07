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
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';

import { TranslocoDirective } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
  WATT_TABLE,
} from '@energinet-datahub/watt/table';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import {
  DhTabDataGeneralErrorComponent,
  DhUser,
  DhUsers,
  DhUserStatusComponent,
} from '@energinet-datahub/dh/admin/shared';

import {
  MarketParticipantSortDirctionType,
  UserOverviewSortProperty,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

import { DhUserDrawerComponent } from '../drawer/dh-user-drawer.component';
@Component({
  selector: 'dh-users-overview-table',
  standalone: true,
  templateUrl: './dh-users-overview-table.component.html',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  // Using `OnPush` causes issues with table's header row translations
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    TranslocoDirective,

    VaterStackComponent,
    VaterFlexComponent,
    WattEmptyStateComponent,
    WATT_TABLE,

    DhTabDataGeneralErrorComponent,
    DhEmDashFallbackPipe,
    DhUserStatusComponent,
    DhUserDrawerComponent,
  ],
})
export class DhUsersTabTableComponent implements AfterViewInit {
  private _destroyRef = inject(DestroyRef);

  columns: WattTableColumnDef<DhUser> = {
    firstName: { accessor: 'firstName' },
    lastName: { accessor: 'lastName' },
    email: { accessor: 'email' },
    phoneNumber: { accessor: 'phoneNumber' },
    status: { accessor: 'status' },
  };

  dataSource = new WattTableDataSource<DhUser>();
  activeRow: DhUser | undefined = undefined;

  @Input({ required: true }) set users(value: DhUsers) {
    this.dataSource.data = value;
  }

  @Input({ required: true }) isLoading = false;
  @Input({ required: true }) hasGeneralError = false;

  @Input({ required: true }) sortChanged!: (
    prop: UserOverviewSortProperty,
    direction: MarketParticipantSortDirctionType
  ) => void;

  @Output() reload = new EventEmitter<void>();

  @ViewChild(DhUserDrawerComponent)
  drawer!: DhUserDrawerComponent;

  @ViewChild(WattTableComponent)
  usersTable!: WattTableComponent<DhUser>;

  ngAfterViewInit(): void {
    this.usersTable.sortChange.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((x) => {
      const property = (x.active.charAt(0).toUpperCase() +
        x.active.slice(1)) as UserOverviewSortProperty;
      const direction = (x.direction.charAt(0).toUpperCase() +
        x.direction.slice(1)) as MarketParticipantSortDirctionType;

      this.sortChanged(property, direction);
    });
  }

  onRowClick(row: DhUser): void {
    this.activeRow = row;
    this.drawer.open(row);
  }

  onClosed(): void {
    this.activeRow = undefined;
  }
}
