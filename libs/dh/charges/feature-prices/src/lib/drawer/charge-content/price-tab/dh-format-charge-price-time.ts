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
  ChargePriceV1Dto,
  Resolution,
} from '@energinet-datahub/dh/shared/domain';
import { getHours } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const timeFormat = 'HH:mm';
const danishTimeZoneIdentifier = 'Europe/Copenhagen';

export function getFromDateTime(
  price: ChargePriceV1Dto,
  resolution: Resolution
) {
  const fromDateTime = new Date(price.fromDateTime);

  if (resolution == Resolution.PT1H) return formatHours(fromDateTime, 0);

  return formatInTimeZone(fromDateTime, danishTimeZoneIdentifier, timeFormat);
}

export function getToDateTime(price: ChargePriceV1Dto, resolution: Resolution) {
  const toDateTime = new Date(price.toDateTime);

  if (resolution == Resolution.PT1H) {
    const fromDateTime = new Date(price.fromDateTime);

    // If fromDateTime is winter and toDateTime is summer, remove 1 hour from ToDateTime
    if (fromDateTime.getTimezoneOffset() > toDateTime.getTimezoneOffset())
      return formatHours(toDateTime, -1);

    // If fromDateTime is summer and toDateTime is winter, add 1 hour to ToDateTime
    if (fromDateTime.getTimezoneOffset() < toDateTime.getTimezoneOffset())
      return formatHours(toDateTime, 1);

    return formatHours(toDateTime, 0);
  }

  return formatInTimeZone(toDateTime, danishTimeZoneIdentifier, timeFormat);
}

function formatHours(date: Date, hoursToAdd: number) {
  const hours = getHours(date) + hoursToAdd;
  return addLeadingZeros(hours, 2);
}

function addLeadingZeros(number: number, totalLength: number): string {
  return String(number).padStart(totalLength, '0');
}
