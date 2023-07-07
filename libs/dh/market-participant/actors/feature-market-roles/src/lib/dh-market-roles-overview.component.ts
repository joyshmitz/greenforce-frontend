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
import { AfterViewInit, Component, inject } from '@angular/core';
import { translate, TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { take } from 'rxjs';

import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { MarketParticipantEicFunction } from '@energinet-datahub/dh/shared/domain';
import { exportCsv } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-market-roles-overview',
  styleUrls: ['dh-market-roles-overview.component.scss'],
  templateUrl: './dh-market-roles-overview.component.html',
  standalone: true,
  imports: [TranslocoModule, WattButtonComponent, WATT_TABLE, WATT_CARD],
})
export class DhMarketRolesOverviewComponent implements AfterViewInit {
  private transloco = inject(TranslocoService);

  dataSource = new WattTableDataSource<string>(Object.keys(MarketParticipantEicFunction));

  columns: WattTableColumnDef<string> = {
    name: { accessor: (value) => value },
    description: { accessor: (value) => value },
  };

  ngAfterViewInit() {
    this.dataSource.sortingDataAccessor = (data, header) =>
      header === 'name'
        ? translate('marketParticipant.marketRoles.' + data)
        : translate('marketParticipant.marketRoleDescriptions.' + data);

    if (this.dataSource.sort) {
      this.dataSource.data = this.dataSource.sortData(this.dataSource.data, this.dataSource.sort);
    }
  }

  download() {
    this.transloco
      .selectTranslateObject('marketParticipant')
      .pipe(take(1))
      .subscribe((translations) => {
        const basePath = 'marketParticipant.marketRolesOverview.columns.';

        const headers = [
          `"${translate(basePath + 'name')}"`,
          `"${translate(basePath + 'description')}"`,
        ];

        if (this.dataSource.sort) {
          const marketRoles = this.dataSource.sortData(
            this.dataSource.filteredData,
            this.dataSource.sort
          );

          const lines = marketRoles.map((x) => [
            `"${translations['marketRoles'][x]}"`,
            `"${translations['marketRoleDescriptions'][x]}"`,
          ]);

          exportCsv(headers, lines);
        }
      });
  }
}