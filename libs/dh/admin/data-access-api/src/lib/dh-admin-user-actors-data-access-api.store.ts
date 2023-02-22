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
import {
  ActorDto,
  MarketParticipantHttp,
  OrganizationDto,
} from '@energinet-datahub/dh/shared/domain';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  LoadingState,
  ErrorState,
} from '@energinet-datahub/dh/shared/data-access-api';
import { map, Observable, switchMap, tap } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

interface ActorsResultState {
  readonly actorResult: ActorDto[] | null;
  readonly organizationResult: OrganizationDto | null;
  readonly loadingState: LoadingState | ErrorState;
  readonly organizationLoadingState: LoadingState | ErrorState;
}

const initialState: ActorsResultState = {
  actorResult: null,
  organizationResult: null,
  loadingState: LoadingState.INIT,
  organizationLoadingState: LoadingState.INIT,
};

@Injectable()
export class DhUserActorsDataAccessApiStore extends ComponentStore<ActorsResultState> {
  isInit$ = this.select((state) => state.loadingState === LoadingState.INIT);
  isLoading$ = this.select(
    (state) => state.loadingState === LoadingState.LOADING
  );
  hasGeneralError$ = this.select(
    (state) => state.loadingState === ErrorState.GENERAL_ERROR
  );

  canChooseMultipleActors$ = this.select(
    (state) => state.actorResult || []
  ).pipe(map((actors) => actors.length > 1));

  organizationDomain$ = this.select(
    (state) => state.organizationResult?.domain
  );

  actors$ = this.select((state) => state.actorResult).pipe(
    map((actors) =>
      (actors ?? []).map((actor: ActorDto) => ({
        value: actor.actorId,
        displayValue:
          actor.name.value === ''
            ? actor.actorNumber.value
            : actor.actorNumber.value + ' - ' + actor.name.value,
      }))
    )
  );

  constructor(private httpClient: MarketParticipantHttp) {
    super(initialState);
  }

  readonly getActors = this.effect((trigger$: Observable<void>) => {
    return trigger$.pipe(
      tap(() => {
        this.setLoadState(LoadingState.LOADING);
      }),
      switchMap(() =>
        this.httpClient
          .v1MarketParticipantOrganizationGetFilteredActorsGet()
          .pipe(
            tapResponse(
              (actors) => {
                this.updateStates(actors);
              },
              (error: HttpErrorResponse) => {
                this.handleError(error);
              }
            )
          )
      )
    );
  });

  readonly getActorOrganization = this.effect(
    (trigger$: Observable<string>) => {
      return trigger$.pipe(
        tap(() => {
          this.setOrganizationLoadState(LoadingState.LOADING);
        }),
        switchMap((actorId) =>
          this.httpClient
            .v1MarketParticipantOrganizationGetActorOrganizationGet(actorId)
            .pipe(
              tapResponse(
                (organization) => {
                  this.updateOrganizationAndLoadingState(organization);
                },
                () => {
                  this.handleOrganizationError();
                }
              )
            )
        )
      );
    }
  );

  private setLoadState = this.updater(
    (state, loadState: LoadingState): ActorsResultState => ({
      ...state,
      loadingState: loadState,
    })
  );

  private setOrganizationLoadState = this.updater(
    (state, loadState: LoadingState): ActorsResultState => ({
      ...state,
      organizationLoadingState: loadState,
    })
  );

  private update = this.updater(
    (state: ActorsResultState, actors: ActorDto[]): ActorsResultState => ({
      ...state,
      actorResult: actors,
    })
  );

  private updateOrganization = this.updater(
    (
      state: ActorsResultState,
      organization: OrganizationDto | null
    ): ActorsResultState => ({
      ...state,
      organizationResult: organization,
    })
  );

  private updateOrganizationAndLoadingState = (
    organization: OrganizationDto | null
  ) => {
    this.updateOrganization(organization);

    this.patchState({
      organizationLoadingState: LoadingState.LOADED,
    });
  };

  private updateStates = (actors: ActorDto[]) => {
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

  private handleOrganizationError = () => {
    this.updateOrganization(null);
    this.patchState({ organizationLoadingState: ErrorState.GENERAL_ERROR });
  };

  readonly resetState = () => this.setState(initialState);
  readonly resetOrganizationState = () =>
    this.patchState({ organizationResult: null });
}
