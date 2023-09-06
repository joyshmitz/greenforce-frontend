import { InputMaybe, Scalars } from '@energinet-datahub/dh/shared/domain/graphql';

export type DhOutgoingMessagesFilters = {
  calculationTypes?: InputMaybe<string[]>;
  messageTypes?: InputMaybe<string[]>;
  gridAreas?: InputMaybe<string[]>;
  status?: InputMaybe<string[]>;
  period?: InputMaybe<Scalars['DateRange']>;
};
