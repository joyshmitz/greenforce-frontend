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
import { RouterOutlet } from '@angular/router';
import { computed, Component, viewChild, input, effect, inject } from '@angular/core';

import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';

import {
  DhRoleStatusComponent,
  DhTabDataGeneralErrorComponent,
} from '@energinet-datahub/dh/admin/shared';

import {
  UserRoleStatus,
  GetUserRoleWithPermissionsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhDeactivedUserRoleComponent } from './deactivate.component';
import { DhRoleAuditLogsComponent } from './tabs/audit-logs.component';
import { DhRoleMasterDataComponent } from './tabs/master-data.component';
import { DhRolePermissionsComponent } from './tabs/permissions.component';

@Component({
  selector: 'dh-user-role-details',
  standalone: true,
  imports: [
    RouterOutlet,
    TranslocoDirective,

    WATT_TABS,
    WATT_MODAL,
    WATT_DRAWER,
    WattButtonComponent,

    DhPermissionRequiredDirective,

    DhRoleStatusComponent,
    DhRoleAuditLogsComponent,
    DhRoleMasterDataComponent,
    DhRolePermissionsComponent,
    DhDeactivedUserRoleComponent,
    DhTabDataGeneralErrorComponent,
  ],
  template: `
    @let userRole = userRoleWithPermissions();

    <watt-drawer
      *transloco="let t; read: 'admin.userManagement.drawer'"
      #drawer
      size="large"
      (closed)="onClose()"
      [loading]="isLoading()"
    >
      @if (userRole) {
        <watt-drawer-topbar>
          <dh-role-status [status]="userRole.status" />
        </watt-drawer-topbar>
      }

      @if (userRole) {
        <watt-drawer-heading>
          <h2>{{ userRole.name }}</h2>
        </watt-drawer-heading>
      }

      @if (userRole && userRole.status !== UserRoleStatus.Inactive) {
        <watt-drawer-actions>
          <watt-button
            *dhPermissionRequired="['user-roles:manage']"
            variant="secondary"
            (click)="deactivate.open()"
            [loading]="deactivate.isDeactivating()"
            >{{ t('disable') }}</watt-button
          >

          <watt-button
            *dhPermissionRequired="['user-roles:manage']"
            variant="secondary"
            (click)="edit()"
            >{{ t('editRole') }}</watt-button
          >
        </watt-drawer-actions>
      }

      @if (userRole) {
        <watt-drawer-content>
          <watt-tabs *transloco="let tab; read: 'admin.userManagement.drawer.roles.tabs'">
            <watt-tab [label]="tab('masterData.tabLabel')">
              <dh-role-master-data [role]="userRole" />
            </watt-tab>
            <watt-tab *dhPermissionRequired="['fas']" [label]="tab('permissions.tabLabel')">
              <dh-role-permissions [role]="userRole" />
            </watt-tab>
            <watt-tab *dhPermissionRequired="['fas']" [label]="tab('history.tabLabel')">
              @defer {
                <dh-role-audit-logs [id]="userRole.id" />
              }
            </watt-tab>
          </watt-tabs>

          @if (hasError()) {
            <dh-tab-data-general-error (reload)="reload()" />
          }
        </watt-drawer-content>
      }
    </watt-drawer>
    <dh-deactivate-user-role [id]="userRole?.id" #deactivate />
    <router-outlet />
  `,
})
export class DhUserRoleDetailsComponent {
  private navigationService = inject(DhNavigationService);
  private userRolesWithPermissionsQuery = lazyQuery(GetUserRoleWithPermissionsDocument);

  UserRoleStatus = UserRoleStatus;

  userRoleWithPermissions = computed(() => this.userRolesWithPermissionsQuery.data()?.userRoleById);
  isLoading = this.userRolesWithPermissionsQuery.loading;
  hasError = this.userRolesWithPermissionsQuery.hasError;

  // Router param
  id = input<string>();

  drawer = viewChild.required(WattDrawerComponent);

  confirmationModal = viewChild.required(WattModalComponent);

  isEditUserRoleModalVisible = false;

  onClose(): void {
    this.navigationService.navigate('list');
  }

  reload() {
    this.userRolesWithPermissionsQuery.refetch();
  }

  edit() {
    this.navigationService.navigate('edit', this.id());
  }

  constructor() {
    effect(() => {
      const id = this.id();

      if (id) {
        this.drawer().open();

        this.userRolesWithPermissionsQuery.query({
          variables: {
            id,
          },
        });
      }
    });
  }
}
