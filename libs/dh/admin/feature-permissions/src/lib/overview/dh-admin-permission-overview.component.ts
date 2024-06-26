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
import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { ApolloError } from '@apollo/client';
import { translate, TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import {
  MarketParticipantPermissionsHttp,
  PermissionDto,
} from '@energinet-datahub/dh/shared/domain';
import {
  DhEmDashFallbackPipe,
  exportToCSV,
  streamToFile,
} from '@energinet-datahub/dh/shared/ui-util';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { WattSearchComponent } from '@energinet-datahub/watt/search';

import { DhAdminPermissionDetailComponent } from '../details/dh-admin-permission-detail.component';
import { getPermissionsWatchQuery } from '../shared/dh-get-permissions-watch-query';
import { switchMap } from 'rxjs';
import { DhPermissionsTableComponent } from '@energinet-datahub/dh/admin/shared';

@Component({
  selector: 'dh-admin-permission-overview',
  standalone: true,
  templateUrl: './dh-admin-permission-overview.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      h3 {
        margin: 0;
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    VaterStackComponent,
    VaterFlexComponent,
    VaterSpacerComponent,
    VaterUtilityDirective,
    WattButtonComponent,
    DhPermissionRequiredDirective,
    WattEmptyStateComponent,
    WATT_CARD,
    WATT_TABLE,
    WattSearchComponent,

    DhPermissionsTableComponent,
    DhEmDashFallbackPipe,
    DhAdminPermissionDetailComponent,
  ],
})
export class DhAdminPermissionOverviewComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private readonly toastService = inject(WattToastService);
  private readonly httpClient = inject(MarketParticipantPermissionsHttp);

  query = getPermissionsWatchQuery();
  loading = false;
  error?: ApolloError;

  columns: WattTableColumnDef<PermissionDto> = {
    name: { accessor: 'name' },
    description: { accessor: 'description' },
  };

  dataSource = new WattTableDataSource<PermissionDto>([]);
  activeRow: PermissionDto | undefined = undefined;

  @ViewChild(DhAdminPermissionDetailComponent)
  permissionDetail!: DhAdminPermissionDetailComponent;

  ngOnInit(): void {
    this.query.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
      next: (result) => {
        this.loading = result.loading;
        this.error = result.error;
        this.dataSource.data = result.data?.permissions ?? [];
      },
      error: (error) => {
        this.loading = false;
        this.error = error;
      },
    });
  }

  onRowClick(row: PermissionDto): void {
    this.activeRow = row;
    this.permissionDetail.open(row);
  }

  onClosed(): void {
    this.activeRow = undefined;
  }

  onSearch(value: string): void {
    this.dataSource.filter = value;
  }

  refresh(): void {
    this.query.refetch({ searchTerm: '' });
  }

  exportAsCsv(): void {
    if (this.dataSource.sort) {
      const basePath = 'admin.userManagement.permissionsTab.';
      const headers = [
        `"${translate(basePath + 'permissionName')}"`,
        `"${translate(basePath + 'permissionDescription')}"`,
      ];

      const marketRoles = this.dataSource.sortData(
        [...this.dataSource.filteredData],
        this.dataSource.sort
      );

      const lines = marketRoles.map((x) => [`"${x.name}"`, `"${x.description}"`]);

      exportToCSV({ headers, lines });
    }
  }

  downloadRelationCSV() {
    this.toastService.open({
      type: 'loading',
      message: translate('shared.downloadStart'),
    });

    const fileOptions = {
      name: 'permissions-relation-report',
      type: 'text/csv',
    };

    this.httpClient
      .v1MarketParticipantPermissionsGetPermissionRelationsCSVGet()
      .pipe(switchMap(streamToFile(fileOptions)))
      .subscribe({
        complete: () => this.toastService.dismiss(),
        error: () => {
          this.toastService.open({
            type: 'danger',
            message: translate('shared.downloadFailed'),
          });
        },
      });
  }
}
