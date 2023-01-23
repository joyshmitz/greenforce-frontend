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
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { translate } from '@ngneat/transloco';

import { UserRoleDto } from '@energinet-datahub/dh/shared/domain';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import { DhRoleStatusComponent } from '../../shared/dh-role-status.component';
import {
  WattTableDataSource,
  WattTableColumnDef,
  WATT_TABLE,
} from '@energinet-datahub/watt/table';
import { DhRoleDrawerComponent } from '../../drawer/roles/dh-role-drawer.component';

@Component({
  selector: 'dh-roles-tab-table',
  standalone: true,
  templateUrl: './dh-roles-tab-table.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  // Using `OnPush` causes issues with table's header row translations
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    WATT_TABLE,
    DhSharedUiPaginatorComponent,
    DhRoleStatusComponent,
    DhRoleDrawerComponent,
  ],
})
export class DhRolesTabTableComponent implements OnChanges, AfterViewInit {
  activeRow: UserRoleDto | undefined = undefined;

  @Input() roles: UserRoleDto[] = [];

  @ViewChild(DhSharedUiPaginatorComponent)
  paginator!: DhSharedUiPaginatorComponent;

  @ViewChild(DhRoleDrawerComponent)
  drawer!: DhRoleDrawerComponent;

  readonly dataSource: WattTableDataSource<UserRoleDto> =
    new WattTableDataSource<UserRoleDto>();

  columns: WattTableColumnDef<UserRoleDto> = {
    name: { accessor: 'name' },
    marketrole: { accessor: 'eicFunction' },
    status: { accessor: 'status' },
  };

  translateHeader = (key: string) =>
    translate(`admin.userManagement.tabs.roles.table.columns.${key}`);

  ngOnChanges() {
    this.dataSource.data = this.roles;
    this.dataSource.paginator = this.paginator?.instance;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator?.instance;
  }

  onRowClick(row: UserRoleDto): void {
    this.drawer.open(row);
    this.activeRow = row;
  }

  onClosed(): void {
    this.activeRow = undefined;
  }
}
