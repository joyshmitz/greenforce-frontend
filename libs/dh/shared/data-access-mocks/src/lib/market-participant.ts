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
import { http, delay, HttpResponse } from 'msw';

import {
  Actor,
  GetActorEditableFieldsQuery,
  Organization,
  mockGetActorByIdQuery,
  mockGetActorEditableFieldsQuery,
  mockGetActorsByOrganizationIdQuery,
  mockGetActorsQuery,
  mockGetOrganizationByIdQuery,
  mockGetOrganizationsQuery,
  mockUpdateOrganizationMutation,
  UpdateOrganizationMutation,
  mockGetAuditLogByOrganizationIdQuery,
  mockGetAuditLogByActorIdQuery,
  mockGetGridAreaOverviewQuery,
  mockCreateMarketParticipantMutation,
  mockGetAssociatedActorsQuery,
  OrganizationAuditedChangeAuditLogDto,
  OrganizationAuditedChange,
  mockUpdateActorMutation,
  UpdateActorMutation,
  mockGetOrganizationFromCvrQuery,
  mockGetDelegationsForActorQuery,
  mockGetDelegatesQuery,
  mockCreateDelegationForActorMutation,
  CreateDelegationForActorMutation,
  mockStopDelegationsMutation,
  StopDelegationsMutation,
  mockGetActorsForEicFunctionQuery,
  mockGetBalanceResponsibleRelationQuery,
  mockGetActorCredentialsQuery,
  mockAddTokenToDownloadUrlMutation,
  mockCheckDomainExistsQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { mswConfig } from '@energinet-datahub/gf/util-msw';

import { actorData } from './data/market-participant-actor';
import { marketParticipantActors } from './data/market-participant-actors';
import { getOrganizationsQueryMock } from './data/market-participant-organizations';
import { getActorAuditLogsMock } from './data/get-actor-audit-logs';
import { getGridAreaOverviewMock } from './data/get-grid-area-overview';

import { getDelegationsForActorMock } from './data/get-delegations-for-actor';
import { actors } from './data/get-actors-by-organizationId';
import { balanceResponsibleAgreements } from './data/balance-responsible-agreements';

export function marketParticipantMocks(apiBase: string) {
  return [
    getActor(apiBase),
    getActors(),
    getActorById(),
    getActorEditableFields(),
    getOrganizations_GrahpQL(),
    getOrganizationById(),
    getOrganizationFromCvr(),
    getActorByOrganizationId(),
    updateOrganization(),
    updateActor(),
    getAuditLogByOrganizationId(),
    getAuditLogByActorId(),
    getActorCredentials(apiBase),
    marketParticipantActorAssignCertificateCredentials(apiBase),
    marketParticipantActorRemoveActorCredentials(apiBase),
    getGridAreaOverview(),
    createMarketParticipant(),
    getAssociatedActors(),
    getDelegationsForActor(),
    getDelegates(),
    createDelegation(),
    stopDelegation(),
    getActorsForEicFunction(),
    getBalanceResponsibleRelation(),
    addTokenToDownloadUrl(),
    checkDomainExists(),
  ];
}

function getActor(apiBase: string) {
  return http.get(`${apiBase}/v1/MarketParticipant/Organization/GetActor`, async ({ params }) => {
    const { actorId } = params;
    const actorDataWithUpdatedId = {
      ...actorData,
      actorId,
    };
    await delay(mswConfig.delay);
    return HttpResponse.json(actorDataWithUpdatedId);
  });
}

function getActors() {
  return mockGetActorsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: { __typename: 'Query', actors: marketParticipantActors },
    });
  });
}

function getActorById() {
  return mockGetActorByIdQuery(async ({ variables }) => {
    const { id } = variables;

    const actorById = marketParticipantActors.find((a) => a.id === id) as Actor;

    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: { __typename: 'Query', actorById },
    });
  });
}

function getActorEditableFields() {
  return mockGetActorEditableFieldsQuery(async () => {
    await delay(mswConfig.delay);

    const query: GetActorEditableFieldsQuery = {
      __typename: 'Query',
      actorById: {
        id: '00000000-0000-0000-0000-000000000005',
        __typename: 'Actor',
        name: 'Test Actor 1',
        organization: {
          __typename: 'Organization',
          id: 'organization-id-1',
          domains: ['fake-domain.dk', 'test.dk'],
        },
        contact: {
          __typename: 'ActorContactDto',
          name: 'Test Department',
          email: 'test-actor@fake-domain.dk',
          phone: '+45 22334455',
        },
      },
    };

    return HttpResponse.json({
      data: query,
    });
  });
}

function getOrganizations_GrahpQL() {
  return mockGetOrganizationsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: getOrganizationsQueryMock,
    });
  });
}

function getOrganizationById() {
  return mockGetOrganizationByIdQuery(async ({ variables }) => {
    const { id } = variables;

    const organizationById = {
      ...getOrganizationsQueryMock.organizations.find((a) => a.id === id),
      address: {
        __typename: 'AddressDto',
        country: 'DK',
      },
    } as Organization;
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: { __typename: 'Query', organizationById },
    });
  });
}

function getOrganizationFromCvr() {
  return mockGetOrganizationFromCvrQuery(async ({ variables }) => {
    const noResultCVR = '00000000';

    const { cvr } = variables;

    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        searchOrganizationInCVR: {
          __typename: 'CVROrganizationResult',
          name: noResultCVR === cvr ? '' : 'Test Organization',
          hasResult: noResultCVR !== cvr,
        },
      },
    });
  });
}

function getDelegates() {
  return mockGetDelegatesQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        actorsForEicFunction: [
          {
            __typename: 'Actor',
            id: '00000000-0000-0000-0000-000000000002',
            name: 'Test Actor 2',
            glnOrEicNumber: '22222222',
          },
          {
            __typename: 'Actor',
            id: '00000000-0000-0000-0000-000000000003',
            name: 'Test Actor 3',
            glnOrEicNumber: '33333333',
          },
          {
            __typename: 'Actor',
            id: '00000000-0000-0000-0000-000000000004',
            name: 'Test Actor 4',
            glnOrEicNumber: '44444444444',
          },
        ],
      },
    });
  });
}

function getActorByOrganizationId() {
  return mockGetActorsByOrganizationIdQuery(async ({ variables }) => {
    const { organizationId } = variables;

    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: { __typename: 'Query', actorsByOrganizationId: actors(organizationId) },
    });
  });
}

function createDelegation() {
  return mockCreateDelegationForActorMutation(async (request) => {
    await delay(mswConfig.delay);
    const mockError = request.variables.input.actorId === marketParticipantActors[0].id;

    const response: CreateDelegationForActorMutation = {
      __typename: 'Mutation',
      createDelegationsForActor: {
        __typename: 'CreateDelegationsForActorPayload',
        success: !mockError,
        errors: mockError
          ? [
              {
                __typename: 'ApiError',
                apiErrors: [
                  {
                    __typename: 'ApiErrorDescriptor',
                    code: 'market_participant.validation.message_delegation.actors_from_or_to_inactive',
                    message: 'mock fail',
                    args: [],
                  },
                ],
              },
            ]
          : [],
      },
    };
    return HttpResponse.json({
      data: response,
    });
  });
}

function stopDelegation() {
  return mockStopDelegationsMutation(async (request) => {
    const mockError =
      request.variables.input.stopDelegationPeriods[0].stopPeriod.periodId ===
      getDelegationsForActorMock.delegationsForActor[0].periodId;
    await delay(mswConfig.delay);
    const response: StopDelegationsMutation = {
      __typename: 'Mutation',
      stopDelegation: {
        __typename: 'StopDelegationPayload',
        success: !mockError,
        errors: mockError
          ? [
              {
                __typename: 'ApiError',
                apiErrors: [
                  {
                    __typename: 'ApiErrorDescriptor',
                    code: 'test',
                    message: 'mock fail',
                    args: [],
                  },
                ],
              },
            ]
          : [],
      },
    };
    return HttpResponse.json({
      data: response,
    });
  });
}

function updateOrganization() {
  return mockUpdateOrganizationMutation(async () => {
    const response: UpdateOrganizationMutation = {
      __typename: 'Mutation',
      updateOrganization: {
        __typename: 'UpdateOrganizationPayload',
        errors: null,
        boolean: true,
      },
    };

    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: response,
    });
  });
}

function updateActor() {
  return mockUpdateActorMutation(async () => {
    const response: UpdateActorMutation = {
      __typename: 'Mutation',
      updateActor: {
        __typename: 'UpdateActorPayload',
        errors: null,
        boolean: true,
      },
    };

    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: response,
    });
  });
}

function getAuditLogByOrganizationId() {
  return mockGetAuditLogByOrganizationIdQuery(async () => {
    const auditLog: OrganizationAuditedChangeAuditLogDto[] = [
      {
        __typename: 'OrganizationAuditedChangeAuditLogDto',
        auditedBy: 'Jane Doe',
        isInitialAssignment: false,
        currentValue: 'energinet.dk',
        previousValue: null,
        change: OrganizationAuditedChange.Domain,
        timestamp: new Date('2021-09-05T10:00:00'),
      },
      {
        __typename: 'OrganizationAuditedChangeAuditLogDto',
        auditedBy: 'Jane Doe',
        isInitialAssignment: false,
        currentValue: 'Grøn Strøm',
        previousValue: null,
        change: OrganizationAuditedChange.Name,
        timestamp: new Date('2021-09-06T10:00:00'),
      },
    ];

    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: { __typename: 'Query', organizationAuditLogs: auditLog },
    });
  });
}

function getAuditLogByActorId() {
  return mockGetAuditLogByActorIdQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: getActorAuditLogsMock,
    });
  });
}

function getActorCredentials(apiBase: string) {
  return mockGetActorCredentialsQuery(async ({ variables: { actorId } }) => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        actorById: {
          __typename: 'Actor',
          id: actorId,
          credentials: {
            __typename: 'ActorCredentialsDto',
            certificateCredentials: null,
            assignCertificateCredentialsUrl: `${apiBase}/v1/MarketParticipantActor/AssignCertificateCredentials`,
            removeActorCredentialsUrl: `${apiBase}/v1/MarketParticipantActor/RemoveActorCredentials`,
            clientSecretCredentials: {
              __typename: 'ActorClientSecretCredentialsDto',
              clientSecretIdentifier: 'random-secret-XEi33WhFi8qwnCzrnlf',
              expirationDate: new Date('2022-09-01'),
            },
          },
        },
      },
    });
  });
}

function marketParticipantActorAssignCertificateCredentials(apiBase: string) {
  return http.post(
    `${apiBase}/v1/MarketParticipantActor/AssignCertificateCredentials`,
    async () => {
      await delay(mswConfig.delay);
      return new HttpResponse(null, { status: 200 });
    }
  );
}

function marketParticipantActorRemoveActorCredentials(apiBase: string) {
  return http.delete(`${apiBase}/v1/MarketParticipantActor/RemoveActorCredentials`, async () => {
    await delay(mswConfig.delay);
    return new HttpResponse(null, { status: 200 });
  });
}

function getGridAreaOverview() {
  return mockGetGridAreaOverviewQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: getGridAreaOverviewMock,
    });
  });
}

function createMarketParticipant() {
  return mockCreateMarketParticipantMutation(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        createMarketParticipant: {
          __typename: 'CreateMarketParticipantPayload',
          success: true,
          errors: [],
        },
      },
    });
  });
}

function getAssociatedActors() {
  return mockGetAssociatedActorsQuery(async ({ variables }) => {
    const email = variables.email;
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        associatedActors: {
          __typename: 'AssociatedActors',
          email: email,
          actors: email === 'testuser1@test.dk' ? ['00000000-0000-0000-0000-000000000001'] : [],
        },
      },
    });
  });
}

function getDelegationsForActor() {
  return mockGetDelegationsForActorQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: getDelegationsForActorMock,
    });
  });
}

function getActorsForEicFunction() {
  return mockGetActorsForEicFunctionQuery(async ({ variables }) => {
    const { eicFunctions } = variables;
    await delay(mswConfig.delay);

    const actorsForEicFunction = marketParticipantActors.filter(
      (x) => eicFunctions && x.marketRole && eicFunctions.includes(x.marketRole)
    );

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        actorsForEicFunction,
      },
    });
  });
}

function getBalanceResponsibleRelation() {
  return mockGetBalanceResponsibleRelationQuery(async ({ variables }) => {
    const { id } = variables;
    await delay(mswConfig.delay);

    if (id === 'efad0fee-9d7c-49c6-7c20-08da5f28ddb1') {
      if (Math.random() > 0.5) {
        return HttpResponse.json({
          errors: [
            {
              message: 'Failed to fetch balance responsible agreements',
              extensions: { code: '500', details: 'test' },
            },
          ],
          data: null,
        });
      }

      return HttpResponse.json({
        data: {
          __typename: 'Query',
          actorById: {
            id: 'efad0fee-9d7c-49c6-7c20-08da5f28ddb1',
            __typename: 'Actor',
            balanceResponsibleAgreements: [],
          },
        },
      });
    }

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        actorById: {
          id: '00000000-0000-0000-0000-000000000006',
          __typename: 'Actor',
          balanceResponsibleAgreements,
        },
      },
    });
  });
}

function addTokenToDownloadUrl() {
  return mockAddTokenToDownloadUrlMutation(async ({ variables }) => {
    const { url } = variables;
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        addTokenToDownloadUrl: {
          __typename: 'AddTokenToDownloadUrlPayload',
          downloadUrlWithToken: `${url}?token=12345`,
        },
      },
    });
  });
}

function checkDomainExists() {
  return mockCheckDomainExistsQuery(async ({ variables }) => {
    const { email } = variables;
    const domain = email.split('@')[1];
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        domainExists: ['test.dk', 'datahub.dk', 'energinet.dk'].includes(domain),
      },
    });
  });
}
