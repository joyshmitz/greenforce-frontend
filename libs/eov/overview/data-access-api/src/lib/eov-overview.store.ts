import { Injectable } from '@angular/core';
import { MeteringPointDto } from '@energinet-datahub/eov/shared/domain';
import { ComponentStore } from '@ngrx/component-store';
import { EovOverviewService } from './eov-overview.service';

// Note: Remove the comment on the next line once the interface has properties
// eslint-disable-next-line @typescript-eslint/no-empty-interface
type OverviewState = {
  loading: boolean;
  meteringPoints: MeteringPointDto[];
  meteringPointError?: string | null;
}

const initialState: OverviewState = {
  loading: true,
  meteringPoints: [],
};

@Injectable({
  providedIn: 'root',
})
export class EovOverviewStore extends ComponentStore<OverviewState> {
  constructor(
    private service: EovOverviewService
  ) {
    super(initialState);
  }

  readonly loading$ = this.select((state) => state.loading);
  private readonly setLoading = this.updater(
    (state, loading: boolean): OverviewState => ({ ...state, loading })
  );

  readonly meteringPoints$ = this.select((state) => state.meteringPoints);

  loadMeteringPoints() {
    this.setLoading(true);
    this.service.getMeteringPoints().subscribe({
      next: (meteringPointsResponse) => {
        this.setLoading(false);
        this.setMeteringPoints(meteringPointsResponse);
      },
      error: (error) => {
        this.setLoading(false);
        this.patchState({ meteringPointError: error });
      },
    });
  }

  private readonly setMeteringPoints = this.updater(
    (state, meteringPoints: MeteringPointDto[]): OverviewState => ({
      ...state,
      meteringPoints,
      meteringPointError: null,
    })
  );
}