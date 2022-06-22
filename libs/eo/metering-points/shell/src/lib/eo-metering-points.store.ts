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
import { ComponentStore } from '@ngrx/component-store';
import { take } from 'rxjs';
import { EoMeteringPointsService } from './eo-metering-points.service';

export interface MeteringPoint {
  /** Unique ID of the metering point - Global Service Relation Number */
  gsrn: string;
  /** Name of the area the metering point is registered in */
  gridArea: string;
  address: string;
  cityName: string;
  floor: string;
  room: string;
  postCode: string;
}

interface EoMeteringPointsState {
  loadingDone: boolean;
  meteringPoints: MeteringPoint[];
}

@Injectable()
export class EoMeteringPointsStore extends ComponentStore<EoMeteringPointsState> {
  constructor(private service: EoMeteringPointsService) {
    super({
      loadingDone: false,
      meteringPoints: [
        {
          gsrn: '578546923392822641',
          gridArea: 'DK1',
          address: 'address',
          cityName: 'city',
          floor: 'floor',
          room: 'room',
          postCode: 'postcode',
        },
      ],
    });

    this.loadData();
  }

  readonly loadingDone$ = this.select((state) => state.loadingDone);
  readonly meteringPoints$ = this.select((state) => state.meteringPoints);

  readonly setLoadingDone = this.updater(
    (state, loadingDone: boolean): EoMeteringPointsState => ({
      ...state,
      loadingDone,
    })
  );

  readonly setEnergySources = this.updater(
    (state, meteringPoints: MeteringPoint[]): EoMeteringPointsState => ({
      ...state,
      meteringPoints,
    })
  );

  loadData() {
    this.service
      .getMeteringPoints()
      .pipe(take(1))
      .subscribe((response) => {
        this.setEnergySources(response.meteringPoints);
        this.setLoadingDone(true);
      });
  }
}
