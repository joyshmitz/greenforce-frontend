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
import { dayjs } from '@energinet-datahub/watt/date';
import type { ResultOf } from '@graphql-typed-document-node/core';
import { GetCalculationsDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { ExtractNodeType } from '@energinet-datahub/dh/shared/util-apollo';
import {
  GetCalculationByIdDocument,
  WholesaleAndEnergyCalculationType,
} from '@energinet-datahub/dh/shared/domain/graphql';

export type Calculation = ExtractNodeType<GetCalculationsDataSource>;

export type CalculationGridArea = Extract<
  ResultOf<typeof GetCalculationByIdDocument>['calculationById'],
  { __typename: 'WholesaleAndEnergyCalculation' }
>['gridAreas'][number];

export const wholesaleCalculationTypes = [
  WholesaleAndEnergyCalculationType.WholesaleFixing,
  WholesaleAndEnergyCalculationType.FirstCorrectionSettlement,
  WholesaleAndEnergyCalculationType.SecondCorrectionSettlement,
  WholesaleAndEnergyCalculationType.ThirdCorrectionSettlement,
];

export const aggregationCalculationTypes = [
  WholesaleAndEnergyCalculationType.Aggregation,
  WholesaleAndEnergyCalculationType.BalanceFixing,
];

export const getMinDate = () => dayjs().startOf('month').subtract(38, 'months').toDate();
export const getMaxDate = () => dayjs().startOf('month').subtract(1, 'ms').toDate();

export enum RequestType {
  AggregatedMeasureData,
  WholesaleSettlement,
}

export const toRequestType = (type: WholesaleAndEnergyCalculationType) =>
  wholesaleCalculationTypes.includes(type)
    ? RequestType.WholesaleSettlement
    : RequestType.AggregatedMeasureData;
