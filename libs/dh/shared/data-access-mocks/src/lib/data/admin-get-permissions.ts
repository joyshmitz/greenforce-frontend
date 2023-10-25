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
import { graphql } from '@energinet-datahub/dh/shared/domain';
import parseISO from 'date-fns/parseISO';

export const adminPermissionsMock: graphql.GetPermissionsQuery = {
  __typename: 'Query',
  permissions: [
    {
      __typename: 'Permission',
      id: 1,
      name: 'organizations:view',
      description: 'Description for OrganizationView',
      created: parseISO('2023-03-07T00:00:00+00:00'),
    },
    {
      __typename: 'Permission',
      id: 2,
      name: 'organizations:manage',
      description: 'Description for OrganizationManage',
      created: parseISO('2023-03-07T00:00:00+00:00'),
    },
  ],
};