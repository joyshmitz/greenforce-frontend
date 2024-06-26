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
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { ApolloError } from '@apollo/client';
import { RxLet } from '@rx-angular/template/let';
import type { ResultOf } from '@graphql-typed-document-node/core';

import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { PermissionDto } from '@energinet-datahub/dh/shared/domain';
import {
  GetPermissionDetailsDocument,
  GetPermissionDetailsQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';

type UserRole = ResultOf<
  typeof GetPermissionDetailsDocument
>['permissionById']['userRoles'][number];

@Component({
  selector: 'dh-admin-permission-roles',
  templateUrl: './dh-admin-permission-roles.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      .no-results-text {
        text-align: center;
      }

      .spinner {
        display: flex;
        justify-content: center;
      }
    `,
  ],
  standalone: true,
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    RxLet,

    WATT_CARD,
    WATT_TABLE,
    WattEmptyStateComponent,
    WattSpinnerComponent,
  ],
})
export class DhAdminPermissionRolesComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) selectedPermission!: PermissionDto;
  private apollo = inject(Apollo);

  subscription!: Subscription;
  userRoles: UserRole[] = [];
  loading = false;
  error?: ApolloError;

  dataSource = new WattTableDataSource<UserRole>();

  columns: WattTableColumnDef<UserRole> = {
    name: { accessor: 'name' },
    eicFunction: { accessor: 'eicFunction' },
  };

  private getPermissionQuery?: QueryRef<
    GetPermissionDetailsQuery,
    {
      id: number;
    }
  >;

  ngOnInit(): void {
    this.getPermissionQuery = this.apollo.watchQuery({
      query: GetPermissionDetailsDocument,
      variables: { id: this.selectedPermission.id },
    });

    this.subscription = this.getPermissionQuery.valueChanges.subscribe({
      next: (result) => {
        this.userRoles = result.data?.permissionById?.userRoles ?? [];
        this.loading = result.loading;
        this.error = result.error;
        this.dataSource.data = this.userRoles;
      },
      error: (error) => {
        this.error = error;
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.selectedPermission.firstChange === false &&
      changes.selectedPermission.currentValue
    ) {
      const id = changes.selectedPermission.currentValue.id;
      this.getPermissionQuery?.refetch({ id });
    }
  }
}
