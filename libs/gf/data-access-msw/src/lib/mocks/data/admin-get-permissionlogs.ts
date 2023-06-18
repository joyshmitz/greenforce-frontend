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

export const adminPermissionPermissionLogsMock: graphql.PermissionAuditLog[] = [
  {
    __typename: 'PermissionAuditLog',
    permissionId: 1,
    changedByUserId: '1',
    changedByUserName: 'datahub',
    permissionAuditLogType: graphql.PermissionAuditLogType.Created,
    timestamp: '2023-03-17',
    value: 'val1',
  },
  {
    __typename: 'PermissionAuditLog',
    permissionId: 1,
    changedByUserId: '1',
    changedByUserName: 'datahub',
    permissionAuditLogType: graphql.PermissionAuditLogType.DescriptionChange,
    timestamp: '2023-03-18',
    value: 'val2',
  },
  {
    __typename: 'PermissionAuditLog',
    permissionId: 2,
    changedByUserId: '1',
    changedByUserName: 'datahub',
    permissionAuditLogType: graphql.PermissionAuditLogType.Created,
    timestamp: '2023-03-17',
    value: 'val3',
  },
];
