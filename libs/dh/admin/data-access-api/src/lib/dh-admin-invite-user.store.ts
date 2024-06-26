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
import { HttpErrorResponse } from '@angular/common/http';

import { ErrorState, SavingState } from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserHttp,
  MarketParticipantUserInvitationDto,
} from '@energinet-datahub/dh/shared/domain';

import { ApiErrorCollection, createApiErrorCollection } from './dh-api-error-utils';

interface State {
  readonly requestState: SavingState | ErrorState;
}

const initialState: State = {
  requestState: SavingState.INIT,
};

@Injectable()
export class DhAdminInviteUserStore extends ComponentStore<State> {
  isInit$ = this.select((state) => state.requestState === SavingState.INIT);
  isSaving$ = this.select((state) => state.requestState === SavingState.SAVING);

  constructor(private marketParticipantUserHttp: MarketParticipantUserHttp) {
    super(initialState);
  }

  readonly inviteUser = this.effect(
    (
      trigger$: Observable<{
        invitation: MarketParticipantUserInvitationDto;
        onSuccess: () => void;
        onError: (error: ApiErrorCollection) => void;
      }>
    ) =>
      trigger$.pipe(
        tap(() => {
          this.resetState();
          this.setSaving(SavingState.SAVING);
        }),
        switchMap(({ invitation, onSuccess, onError }) => {
          return this.marketParticipantUserHttp
            .v1MarketParticipantUserInviteUserPost(invitation)
            .pipe(
              tapResponse(
                () => {
                  this.setSaving(SavingState.SAVED);
                  onSuccess();
                },
                (error: HttpErrorResponse) => {
                  this.setSaving(ErrorState.GENERAL_ERROR);

                  onError(createApiErrorCollection(error));
                }
              )
            );
        })
      )
  );

  readonly reinviteUser = this.effect(
    (trigger$: Observable<{ id: string; onSuccess: () => void; onError: () => void }>) =>
      trigger$.pipe(
        tap(() => {
          this.resetState();
          this.setSaving(SavingState.SAVING);
        }),
        switchMap(({ id, onSuccess, onError }) => {
          return this.marketParticipantUserHttp.v1MarketParticipantUserReInviteUserPost(id).pipe(
            tapResponse(
              () => {
                this.setSaving(SavingState.SAVED);
                onSuccess();
              },
              () => {
                this.setSaving(ErrorState.GENERAL_ERROR);
                onError();
              }
            )
          );
        })
      )
  );

  readonly resetUser2Fa = this.effect(
    (trigger$: Observable<{ id: string; onSuccess: () => void; onError: () => void }>) =>
      trigger$.pipe(
        tap(() => {
          this.resetState();
          this.setSaving(SavingState.SAVING);
        }),
        switchMap(({ id, onSuccess, onError }) => {
          return this.marketParticipantUserHttp.v1MarketParticipantUserResetUser2FaPost(id).pipe(
            tapResponse(
              () => {
                this.setSaving(SavingState.SAVED);
                onSuccess();
              },
              () => {
                this.setSaving(ErrorState.GENERAL_ERROR);
                onError();
              }
            )
          );
        })
      )
  );

  private setSaving = this.updater(
    (state, savingState: SavingState | ErrorState): State => ({
      ...state,
      requestState: savingState,
    })
  );

  private resetState = () => this.setState(initialState);
}
