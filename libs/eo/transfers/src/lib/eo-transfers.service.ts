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
import { map } from 'rxjs';

import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';

export interface EoTransfer {
  startDate: number;
  endDate: number | null;
  receiverTin: string;
}

export interface EoListedTransfer extends EoTransfer {
  id: string;
  senderTin: string;
}

export interface EoListedTransferResponse {
  result: EoListedTransfer[];
}

@Injectable({
  providedIn: 'root',
})
export class EoTransfersService {
  #apiBase: string;

  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }

  getTransfers() {
    return this.http.get<EoListedTransferResponse>(`${this.#apiBase}/transfer-agreements`);
  }

  createAgreement(transfer: EoTransfer) {
    return this.http.post<EoListedTransfer>(`${this.#apiBase}/transfer-agreements`, transfer);
  }

  updateAgreement(transferId: string, endDate: number | null) {
    return this.http
      .patch<EoListedTransfer>(`${this.#apiBase}/transfer-agreements/${transferId}`, {
        endDate,
      })
      .pipe(
        map((transfer) => ({
          ...transfer,
          startDate: transfer.startDate * 1000,
          endDate: transfer.endDate ? transfer.endDate * 1000 : null,
        }))
      );
  }
}
