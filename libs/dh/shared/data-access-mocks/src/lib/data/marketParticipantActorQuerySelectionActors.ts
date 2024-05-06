import { MarketParticipantSelectionActorDto } from '@energinet-datahub/dh/shared/domain';

export const actorQuerySelection = [
  {
    id: '3ec41d91-fc6d-4364-ade6-b85576a91d04',
    gln: '5799999933317',
    actorName: 'Energinet DataHub A/S',
    organizationName: 'Test organization 12',
    marketRole: 'DataHubAdministrator',
  },
  {
    id: 'f73d05cd-cb00-4be3-89b2-115c8425b837',
    gln: '5799999933318',
    actorName: 'Test Actor',
    organizationName: 'Test organization 22',
    marketRole: 'BalanceResponsibleParty',
  },
] as MarketParticipantSelectionActorDto[];
