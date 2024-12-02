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
import { Component, input } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WattCardComponent } from '@energinet-datahub/watt/card';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { DhUserRoleWithPermissions } from '@energinet-datahub/dh/admin/data-access-api';

@Component({
  selector: 'dh-role-master-data',
  standalone: true,
  templateUrl: './dh-role-master-data.component.html',
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    WattCardComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
  ],
})
export class DhRoleMasterDataComponent {
  role = input<DhUserRoleWithPermissions | null>(null);
}
