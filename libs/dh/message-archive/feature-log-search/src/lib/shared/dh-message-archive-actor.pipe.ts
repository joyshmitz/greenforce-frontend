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
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

@Pipe({ name: 'actorName', standalone: true })
export class ActorNamePipe implements PipeTransform {
  transform(
    actorId: string | null | undefined,
    actors: WattDropdownOptions | null
  ): string | undefined {
    if (!actorId) return 'N/A';
    const actor = actors?.find((x) => x.value === actorId);
    return actor?.displayValue === actor?.value ? 'N/A' : actor?.displayValue;
  }
}
