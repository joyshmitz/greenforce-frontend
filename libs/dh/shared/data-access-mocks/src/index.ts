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
import { chargesMocks } from './lib/charges';
import { meteringPointMocks } from './lib/metering-point';
import { wholesaleMocks } from './lib/wholesale';
import { marketParticipantMocks } from './lib/marketParticipant';
import { messageArchiveMocks } from './lib/messageArchive';
import { adminMocks } from './lib/admin';
import { marketParticipantUserMocks } from './lib/marketParticipantUser';
import { marketParticipantUserRoleMocks } from './lib/marketParticipantUserRole';
import { tokenMocks } from './lib/token';
import { eSettMocks } from './lib/esett-mocks';

export const mocks = [
  chargesMocks,
  meteringPointMocks,
  wholesaleMocks,
  marketParticipantMocks,
  messageArchiveMocks,
  adminMocks,
  marketParticipantUserMocks,
  marketParticipantUserRoleMocks,
  tokenMocks,
  eSettMocks,
];

export * from './lib/metering-point';