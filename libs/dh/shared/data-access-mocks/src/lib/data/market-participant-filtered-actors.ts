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
import { Actor, ActorStatus, EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';

export const filteredActors: Actor[] = [
  {
    __typename: 'Actor',
    id: '00000000-0000-0000-0000-000000000001',
    glnOrEicNumber: '5790001330583',
    name: 'Energinet DataHub A/S',
    status: ActorStatus.Active,
    userRoles: [],
    gridAreas: [],
    marketRole: EicFunction.DataHubAdministrator,
    displayName: 'Energinet DataHub A/S • DataHubAdministrator',
    organization: {
      id: '00000000-0000-0000-0000-000000000031',
      name: 'Energinet DataHub A/S',
      businessRegisterIdentifier: '5790001330583',
      domains: ['energinet.dk'],
      status: 'Active',
      __typename: 'Organization',
      address: {
        __typename: 'AddressDto',
        country: 'DK',
      },
    },
  },
  {
    __typename: 'Actor',
    id: '00000000-0000-0000-0000-000000000002',
    glnOrEicNumber: '5790001330583',
    name: 'Sort Størm A/S',
    status: ActorStatus.Active,
    userRoles: [],
    gridAreas: [],
    marketRole: EicFunction.EnergySupplier,
    displayName: 'Sort Størm A/S • EnergySupplier',
    organization: {
      id: '00000000-0000-0000-0000-000000000033',
      name: 'Sort Størm A/S',
      businessRegisterIdentifier: '5790001330583',
      domains: ['sort.dk', 'hvid.dk'],
      status: 'Active',
      __typename: 'Organization',
      address: {
        __typename: 'AddressDto',
        country: 'DK',
      },
    },
  },
];
