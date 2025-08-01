//#region License
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
//#endregion
import { DhAppEnvironment } from '@energinet-datahub/dh/shared/environments';

export type DhFeatureFlag = {
  created: string;
  disabledEnvironments: DhAppEnvironment[];
};

export type FeatureFlagConfig = Record<string, DhFeatureFlag>;

const latestBump = '01-07-2025';

/**
 * Feature flag example:
 *
 * 'example-feature-flag': {
 *   created: '01-01-2022',
 *   disabledEnvironments: [DhAppEnvironment.prod],
 * },
 */
export const dhFeatureFlagsConfig = {
  // This feature flag should be removed in favor of injected environment variables
  // from terraform, whenever the new web application setup is ready (outlaws).
  'quarterly-resolution-transition-datetime-override': {
    created: latestBump,
    disabledEnvironments: [DhAppEnvironment.preprod, DhAppEnvironment.prod],
  },
  'metering-point-debug': {
    created: latestBump,
    disabledEnvironments: [DhAppEnvironment.test_002],
  },
  'metering-points-debug': {
    created: latestBump,
    disabledEnvironments: [],
  },
  'dev-examples': {
    created: latestBump,
    disabledEnvironments: [
      DhAppEnvironment.dev_001,
      DhAppEnvironment.test_001,
      DhAppEnvironment.test_002,
      DhAppEnvironment.preprod,
      DhAppEnvironment.prod,
    ],
  },
  'metering-points-master-data-upload': {
    created: latestBump,
    disabledEnvironments: [DhAppEnvironment.test_001, DhAppEnvironment.prod],
  },
  'acknowledgement-archived-messages': {
    created: latestBump,
    disabledEnvironments: [DhAppEnvironment.prod],
  },
  'missing-measurements-log': {
    created: latestBump,
    disabledEnvironments: [DhAppEnvironment.prod],
  },
  'new-security-model': {
    created: latestBump,
    disabledEnvironments: [
      DhAppEnvironment.local,
      DhAppEnvironment.test_002,
      DhAppEnvironment.preprod,
      DhAppEnvironment.prod,
    ],
  },
} satisfies FeatureFlagConfig;

export type DhFeatureFlags = keyof typeof dhFeatureFlagsConfig;
