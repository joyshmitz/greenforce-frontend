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
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { EoAuthStore } from '@energinet-datahub/eo/shared/services';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EoAuthenticationGuard implements CanActivate {
  constructor(private router: Router, private authStore: EoAuthStore) {}

  canActivate() {
    return this.authStore.getScope$.pipe(
      map((scope) => {
        if (scope.includes('not-accepted-terms')) this.router.navigate(['/terms']);
        if (!this.authStore.token.getValue()) this.router.navigate(['']);

        return !!scope.includes('accepted-terms');
      })
    );
  }
}
