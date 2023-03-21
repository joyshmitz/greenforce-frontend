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
import { asyncScheduler, firstValueFrom, Observable, of, scheduled } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

import {
  MarketParticipantEicFunction,
  MarketParticipantUserRoleHttp,
  MarketParticipantUserRoleAuditLogDto,
  MarketParticipantUserRoleAuditLogsDto,
  MarketParticipantUserRoleChangeType,
  MarketParticipantUserRoleStatus,
} from '@energinet-datahub/dh/shared/domain';

import {
  DhAdminUserRoleAuditLogsDataAccessApiStore,
  DhRoleAuditLogEntry,
} from './dh-admin-user-role-audit-logs-data-access-api.store';

const testUserRoleId = 'ff029a48-b06f-4300-8ec0-84d121a4b83f';
const changeDescriptionJsonMock = {
  Name: 'New name',
  Description: 'New description',
  MarketParticipantEicFunction: MarketParticipantEicFunction.BalanceResponsibleParty,
  Status: MarketParticipantUserRoleStatus.Inactive,
  Permissions: [3, 4],
};

function generateUserRoleAuditLog(
  userRoleChangeType: MarketParticipantUserRoleChangeType,
  changeDescriptionJson: string
): MarketParticipantUserRoleAuditLogDto {
  return {
    userRoleId: '',
    changedByUserId: '',
    changedByUserName: '',
    timestamp: '',
    userRoleChangeType,
    changeDescriptionJson,
  };
}

function generateMockResponse(): MarketParticipantUserRoleAuditLogsDto {
  return {
    auditLogs: [
      generateUserRoleAuditLog('Created', JSON.stringify(changeDescriptionJsonMock)),
      generateUserRoleAuditLog(
        'NameChange',
        JSON.stringify({ Name: changeDescriptionJsonMock.Name })
      ),
      generateUserRoleAuditLog(
        'DescriptionChange',
        JSON.stringify({ Description: changeDescriptionJsonMock.Description })
      ),
      generateUserRoleAuditLog(
        'EicFunctionChange',
        JSON.stringify({
          MarketParticipantEicFunction: changeDescriptionJsonMock.MarketParticipantEicFunction,
        })
      ),
      generateUserRoleAuditLog(
        'StatusChange',
        JSON.stringify({ Status: changeDescriptionJsonMock.Status })
      ),
      generateUserRoleAuditLog(
        'PermissionsChange',
        JSON.stringify({ Permissions: changeDescriptionJsonMock.Permissions })
      ),
    ],
  };
}

const scheduleObservable = (value: Observable<MarketParticipantUserRoleAuditLogsDto>) => {
  return scheduled(value, asyncScheduler);
};

describe(DhAdminUserRoleAuditLogsDataAccessApiStore.name, () => {
  it('calls the API with correct param', () => {
    const httpClient = {
      v1MarketParticipantUserRoleGetUserRoleAuditLogsGet: jest.fn(() =>
        scheduleObservable(of({ auditLogs: [] }))
      ),
    } as unknown as MarketParticipantUserRoleHttp;

    const store = new DhAdminUserRoleAuditLogsDataAccessApiStore(httpClient);
    store.getAuditLogs(of(testUserRoleId));

    expect(httpClient.v1MarketParticipantUserRoleGetUserRoleAuditLogsGet).toHaveBeenCalledWith(
      testUserRoleId
    );
  });

  test('`auditLogs$` returns a mapped response', fakeAsync(async () => {
    const mockResponse = generateMockResponse();

    const httpClient = {
      v1MarketParticipantUserRoleGetUserRoleAuditLogsGet: jest.fn(() =>
        scheduleObservable(of(mockResponse))
      ),
    } as unknown as MarketParticipantUserRoleHttp;

    const store = new DhAdminUserRoleAuditLogsDataAccessApiStore(httpClient);
    store.getAuditLogs(of(testUserRoleId));

    tick();

    const expectedValue: DhRoleAuditLogEntry[] = [
      {
        timestamp: '',
        entry: {
          ...mockResponse.auditLogs[0],
          userRoleChangeType: MarketParticipantUserRoleChangeType.Created,
          changedValueTo: '',
        },
      },
      {
        timestamp: '',
        entry: {
          ...mockResponse.auditLogs[1],
          userRoleChangeType: MarketParticipantUserRoleChangeType.NameChange,
          changedValueTo: changeDescriptionJsonMock.Name,
        },
      },
      {
        timestamp: '',
        entry: {
          ...mockResponse.auditLogs[2],
          userRoleChangeType: MarketParticipantUserRoleChangeType.DescriptionChange,
          changedValueTo: changeDescriptionJsonMock.Description,
        },
      },
      {
        timestamp: '',
        entry: {
          ...mockResponse.auditLogs[3],
          userRoleChangeType: MarketParticipantUserRoleChangeType.EicFunctionChange,
          changedValueTo: changeDescriptionJsonMock.MarketParticipantEicFunction,
        },
      },
      {
        timestamp: '',
        entry: {
          ...mockResponse.auditLogs[4],
          userRoleChangeType: MarketParticipantUserRoleChangeType.StatusChange,
          changedValueTo: changeDescriptionJsonMock.Status,
        },
      },
      {
        timestamp: '',
        entry: {
          ...mockResponse.auditLogs[5],
          userRoleChangeType: MarketParticipantUserRoleChangeType.PermissionsChange,
          changedValueTo: `${changeDescriptionJsonMock.Permissions[0]}, ${changeDescriptionJsonMock.Permissions[1]}`,
        },
      },
    ];
    const actualValue = await firstValueFrom(store.auditLogs$);

    expect(actualValue).toStrictEqual(expectedValue);
    expect(httpClient.v1MarketParticipantUserRoleGetUserRoleAuditLogsGet).toHaveBeenCalled();
  }));
});
