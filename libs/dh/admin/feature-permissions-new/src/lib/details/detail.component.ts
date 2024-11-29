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
  input,
  inject,
  effect,
  computed,
  viewChild,
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';

import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { WattCardComponent } from '@energinet-datahub/watt/card';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { WattTabsComponent, WattTabComponent } from '@energinet-datahub/watt/tabs';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { GetPermissionDetailsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhAdminPermissionRolesComponent } from './tabs/admin-permission-roles.component';
import { DhPermissionAuditLogsComponent } from './tabs/audit-logs.component';
import { DhAdminPermissionMarketRolesComponent } from './tabs/market-roles.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'dh-permission-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detail.component.html',
  imports: [
    RouterOutlet,
    TranslocoPipe,
    TranslocoDirective,

    WATT_DRAWER,
    WattTabComponent,
    WattCardComponent,
    WattTabsComponent,
    WattButtonComponent,
    WattEmptyStateComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,

    VaterFlexComponent,

    DhPermissionRequiredDirective,
    DhPermissionAuditLogsComponent,
    DhAdminPermissionRolesComponent,
    DhAdminPermissionMarketRolesComponent,
  ],
})
export class DhPermissionDetailComponent {
  private navigationService = inject(DhNavigationService);
  private query = lazyQuery(GetPermissionDetailsDocument);

  drawer = viewChild.required(WattDrawerComponent);

  // param id
  id = input.required<string>();

  permission = computed(() => this.query.data()?.permissionById);

  isLoading = this.query.loading;
  hasError = this.query.hasError;

  constructor() {
    effect(() => {
      this.query.query({ variables: { id: parseInt(this.id()) } });
      this.drawer().open();
    });
  }

  onClose(): void {
    this.navigationService.navigate('list');
  }

  edit() {
    this.navigationService.navigate('edit', this.id());
  }
}
