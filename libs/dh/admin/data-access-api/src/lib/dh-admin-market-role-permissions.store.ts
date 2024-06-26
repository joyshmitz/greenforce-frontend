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
import { Observable, switchMap, tap } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';

import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserRoleHttp,
  MarketParticipantPermissionDetailsDto,
  MarketParticipantEicFunction,
} from '@energinet-datahub/dh/shared/domain';

interface DhMarketRolePermissionsState {
  readonly requestState: LoadingState | ErrorState;
  readonly permissions: MarketParticipantPermissionDetailsDto[];
}

const initialState: DhMarketRolePermissionsState = {
  requestState: LoadingState.INIT,
  permissions: [],
};

@Injectable()
export class DhAdminMarketRolePermissionsStore extends ComponentStore<DhMarketRolePermissionsState> {
  isLoading$ = this.select((state) => state.requestState === LoadingState.LOADING);
  hasGeneralError$ = this.select((state) => state.requestState === ErrorState.GENERAL_ERROR);

  permissions$ = this.select((state) => state.permissions);

  constructor(private httpClientUserRole: MarketParticipantUserRoleHttp) {
    super(initialState);
  }

  public readonly getPermissions = this.effect(
    (trigger$: Observable<MarketParticipantEicFunction>) =>
      trigger$.pipe(
        tap(() => {
          this.resetState();
          this.setLoading(LoadingState.LOADING);
        }),
        switchMap((eicFunction) =>
          this.httpClientUserRole.v1MarketParticipantUserRolePermissionsGet(eicFunction).pipe(
            tapResponse(
              (response) => {
                this.setLoading(LoadingState.LOADED);
                this.updatePermissions(response);
              },
              () => {
                this.setLoading(LoadingState.LOADED);
                this.updatePermissions([]);
                this.handleError();
              }
            )
          )
        )
      )
  );

  private updatePermissions = this.updater(
    (
      state: DhMarketRolePermissionsState,
      permissions: MarketParticipantPermissionDetailsDto[]
    ): DhMarketRolePermissionsState => ({
      ...state,
      permissions,
    })
  );

  private setLoading = this.updater(
    (state, requestState: LoadingState | ErrorState): DhMarketRolePermissionsState => ({
      ...state,
      requestState,
    })
  );

  private handleError = () => {
    this.patchState({ requestState: ErrorState.GENERAL_ERROR });
  };

  private resetState = () => this.setState(initialState);
}
