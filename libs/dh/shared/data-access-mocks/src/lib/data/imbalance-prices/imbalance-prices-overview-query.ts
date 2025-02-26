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
  GetImbalancePricesOverviewQuery,
  ImbalancePricePeriod,
  ImbalancePriceStatus,
  PriceAreaCode,
} from '@energinet-datahub/dh/shared/domain/graphql';

const pricePeriods: ImbalancePricePeriod[] = [
  {
    __typename: 'ImbalancePricePeriod',
    name: new Date('2024-01-01T00:00+01:00'),
    priceAreaCode: PriceAreaCode.Dk1,
    status: ImbalancePriceStatus.Complete,
  },
  {
    __typename: 'ImbalancePricePeriod',
    name: new Date('2024-01-01T00:00+01:00'),
    priceAreaCode: PriceAreaCode.Dk2,
    status: ImbalancePriceStatus.InComplete,
  },
  {
    __typename: 'ImbalancePricePeriod',
    name: new Date('2023-12-01T00:00+01:00'),
    priceAreaCode: PriceAreaCode.Dk1,
    status: ImbalancePriceStatus.Complete,
  },
  {
    __typename: 'ImbalancePricePeriod',
    name: new Date('2023-12-01T00:00+01:00'),
    priceAreaCode: PriceAreaCode.Dk2,
    status: ImbalancePriceStatus.InComplete,
  },
];

export const imbalancePricesOverviewQueryMock = (apiBase: string) =>
  ({
    __typename: 'Query',
    imbalancePricesOverview: {
      __typename: 'ImbalancePricesOverview',
      uploadImbalancePricesUrl: `${apiBase}/v1/ImbalancePrices/DownloadImbalanceCSV`,
      pricePeriods,
    },
  }) as GetImbalancePricesOverviewQuery;
