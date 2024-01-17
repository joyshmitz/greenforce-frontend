import { Routes } from '@angular/router';
import { EovShellComponent } from './eov-shell.component';
import { EovCoreFeatureHelpComponent } from 'libs/eov/core/feature-help/src';

export const eovShellRoutes: Routes = [
  {
    path: '',
    component: EovShellComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
        import('@energinet-datahub/eov/landing-page/shell').then(
          (esModule) => esModule.eovLandingPageRoutes
        ),
      },
      {
        path: 'overview',
        loadChildren: () =>
          import('@energinet-datahub/eov/overview/shell').then(
            (esModule) => esModule.eovOverviewRoutes
          ),
      },
      {
        path: 'help',
        component: EovCoreFeatureHelpComponent
      },
    ]
  },
  { path: '**', redirectTo: '' }, // Catch-all that can be used for 404 redirects in the future
];
