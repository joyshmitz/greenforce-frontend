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
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { switchMap } from 'rxjs';
import { EoAuthStore } from '../auth/auth.store';

export interface AuthTermsResponse {
  /**
   * A single line of raw text
   */
  readonly headline: string;
  /**
   * A string containing safe HTML
   */
  readonly terms: string;
  /**
   * A string: I.eg: "0.1"
   */
  readonly version: string;
}

@Injectable({
  providedIn: 'root',
})
export class EoTermsService {
  #apiBase: string;
  constructor(
    private http: HttpClient,
    private authStore: EoAuthStore,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }

  acceptTerms() {
    return this.authStore.getTermsVersion$.pipe(
      switchMap((version) => this.http.put(`${this.#apiBase}/terms/accept`, { version }))
    );
  }
}