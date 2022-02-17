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
import { Pipe, PipeTransform } from '@angular/core';
import { formatInTimeZone } from 'date-fns-tz';

export type TValue = string | null | undefined;
export const pipeName = 'dhDate';

const danishTimeZoneIdentifier = 'Europe/Copenhagen';
const dateFormat = 'dd-MM-yyyy';
const dateTimeFormat = 'dd-MM-yyyy hh:mm:ss';

@Pipe({
  name: pipeName,
})
export class DhDatePipe implements PipeTransform {
  /**
   *
   * @param maybeIso8601DateTime Date time in ISO 8601 format (e.g. 2021-12-01T23:00:00Z)
   * @returns
   */
  transform(maybeIso8601DateTime: TValue, includeTime = true): string | null {
    if (maybeIso8601DateTime == null) {
      return null;
    }

    return formatInTimeZone(
      maybeIso8601DateTime,
      danishTimeZoneIdentifier,
      dateTimeFormat ? dateTimeFormat : dateFormat
    );
  }
}
