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
import { tapResponse } from '@ngrx/operators';
import { Observable, switchMap, tap } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

import { Actor, MessageArchiveHttp } from '@energinet-datahub/dh/shared/domain';
import { LoadingState, ErrorState } from '@energinet-datahub/dh/shared/data-access-api';

interface ActorsResultState {
  readonly actorResult: Actor[] | null;
  readonly loadingState: LoadingState | ErrorState;
}

const initialState: ActorsResultState = {
  actorResult: null,
  loadingState: LoadingState.INIT,
};

@Injectable()
export class DhMessageArchiveActorDataAccessApiStore extends ComponentStore<ActorsResultState> {
  isInit$ = this.select((state) => state.loadingState === LoadingState.INIT);
  isLoading$ = this.select((state) => state.loadingState === LoadingState.LOADING);
  hasGeneralError$ = this.select((state) => state.loadingState === ErrorState.GENERAL_ERROR);

  actors$ = this.select((state) =>
    (state.actorResult ?? []).flatMap((actor: Actor) => ({
      value: actor.actorNumber.value,
      displayValue: actor.name.value === '' ? actor.actorNumber.value : actor.name.value,
    }))
  );

  constructor(private httpClient: MessageArchiveHttp) {
    super(initialState);
  }

  readonly getActors = this.effect((trigger$: Observable<void>) => {
    return trigger$.pipe(
      tap(() => {
        this.resetState();
        this.setLoadState(LoadingState.LOADING);
      }),
      switchMap(() =>
        this.httpClient.v1MessageArchiveActorsGet().pipe(
          tapResponse(
            (actors) => {
              this.updateStates(actors);
            },
            (error: HttpErrorResponse) => {
              this.setLoadState(LoadingState.LOADED);
              this.handleError(error);
            }
          )
        )
      )
    );
  });

  private setLoadState = this.updater(
    (state, loadState: LoadingState): ActorsResultState => ({
      ...state,
      loadingState: loadState,
    })
  );

  private update = this.updater(
    (state: ActorsResultState, actors: Actor[]): ActorsResultState => ({
      ...state,
      actorResult: actors,
    })
  );

  private updateStates = (actors: Actor[]) => {
    this.update(actors);

    if (actors.length == 0) {
      this.patchState({ loadingState: ErrorState.NOT_FOUND_ERROR });
    } else {
      this.patchState({ loadingState: LoadingState.LOADED });
    }
  };

  private handleError = (error: HttpErrorResponse) => {
    this.update([]);

    const requestError =
      error.status === HttpStatusCode.NotFound
        ? ErrorState.NOT_FOUND_ERROR
        : ErrorState.GENERAL_ERROR;

    this.patchState({ loadingState: requestError });
  };

  readonly resetState = () => this.setState(initialState);
}
