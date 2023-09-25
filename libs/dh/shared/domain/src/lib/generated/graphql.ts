/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { graphql, ResponseResolver, GraphQLRequest, GraphQLContext } from 'msw'
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateRange: { input: { start: Date, end: Date }; output: { start: Date, end: Date }; }
  UUID: { input: any; output: any; }
  DateTime: { input: Date; output: Date; }
  Long: { input: any; output: any; }
};

export enum ActorStatus {
  New = 'New',
  Active = 'Active',
  Inactive = 'Inactive',
  Passive = 'Passive'
}

export type Actor = {
  __typename: 'Actor';
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  glnOrEicNumber: Scalars['String']['output'];
  marketRole?: Maybe<EicFunction>;
  gridAreas: Array<GridAreaDto>;
  organization: OrganizationDto;
  externalActorId?: Maybe<Scalars['UUID']['output']>;
  status: ActorStatus;
};

export type BalanceResponsibleType = {
  __typename: 'BalanceResponsibleType';
  gridArea: GridAreaDto;
  id: Scalars['String']['output'];
  receivedDateTime: Scalars['DateTime']['output'];
  supplier: ActorNumber;
  balanceResponsible: ActorNumber;
  meteringPointType: TimeSeriesType;
  validFromDate: Scalars['DateTime']['output'];
  validToDate: Scalars['DateTime']['output'];
};

/** An immutable calculation. */
export type Calculation = {
  __typename: 'Calculation';
  id: Scalars['UUID']['output'];
  period: Scalars['DateRange']['output'];
  createdByUserName?: Maybe<Scalars['String']['output']>;
  gridAreas: Array<GridAreaDto>;
  statusType: ProcessStatus;
  runId?: Maybe<Scalars['Long']['output']>;
  resolution?: Maybe<Scalars['String']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
  executionTimeStart?: Maybe<Scalars['DateTime']['output']>;
  executionTimeEnd?: Maybe<Scalars['DateTime']['output']>;
  executionState: BatchState;
  areSettlementReportsCreated: Scalars['Boolean']['output'];
  processType: ProcessType;
};

export enum EicFunction {
  BalanceResponsibleParty = 'BalanceResponsibleParty',
  BillingAgent = 'BillingAgent',
  EnergySupplier = 'EnergySupplier',
  GridAccessProvider = 'GridAccessProvider',
  ImbalanceSettlementResponsible = 'ImbalanceSettlementResponsible',
  MeteredDataAdministrator = 'MeteredDataAdministrator',
  MeteredDataResponsible = 'MeteredDataResponsible',
  MeteringPointAdministrator = 'MeteringPointAdministrator',
  SystemOperator = 'SystemOperator',
  DanishEnergyAgency = 'DanishEnergyAgency',
  ElOverblik = 'ElOverblik',
  DataHubAdministrator = 'DataHubAdministrator',
  IndependentAggregator = 'IndependentAggregator',
  SerialEnergyTrader = 'SerialEnergyTrader'
}

export type EsettOutgoingMessage = {
  __typename: 'EsettOutgoingMessage';
  gridArea: GridAreaDto;
  getResponseDocumentLink?: Maybe<Scalars['String']['output']>;
  getDispatchDocumentLink?: Maybe<Scalars['String']['output']>;
  documentId: Scalars['String']['output'];
  created: Scalars['DateTime']['output'];
  processType: ExchangeEventProcessType;
  timeSeriesType: TimeSeriesType;
  periodFrom: Scalars['DateTime']['output'];
  periodTo: Scalars['DateTime']['output'];
  documentStatus: DocumentStatus;
};

export enum ExchangeEventProcessType {
  BalanceFixing = 'BALANCE_FIXING',
  Aggregation = 'AGGREGATION'
}

export type Permission = {
  __typename: 'Permission';
  userRoles: Array<UserRoleDto>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  created: Scalars['DateTime']['output'];
  assignableTo: Array<EicFunction>;
};

export enum ProcessStatus {
  Warning = 'warning',
  Success = 'success',
  Danger = 'danger',
  Info = 'info'
}

export enum ApplyPolicy {
  BeforeResolver = 'BEFORE_RESOLVER',
  AfterResolver = 'AFTER_RESOLVER',
  Validation = 'VALIDATION'
}

export type Query = {
  __typename: 'Query';
  permissionById: Permission;
  permissions: Array<Permission>;
  permissionLogs: Array<PermissionLog>;
  userRoleById: UserRoleWithPermissionsDto;
  organizationById: OrganizationDto;
  organizations: Array<OrganizationDto>;
  gridAreas: Array<GridAreaDto>;
  calculationById: Calculation;
  calculations: Array<Calculation>;
  settlementReports: Array<SettlementReport>;
  actorById: Actor;
  actors: Array<Actor>;
  esettOutgoingMessageById: EsettOutgoingMessage;
  esettExchangeEvents: ExchangeEventSearchResponse;
  searchEsettBalanceResponsible: BalanceResponsibleSearchResponse;
};


export type QueryPermissionByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryPermissionsArgs = {
  searchTerm: Scalars['String']['input'];
};


export type QueryPermissionLogsArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUserRoleByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryOrganizationByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryCalculationByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryCalculationsArgs = {
  executionTime?: InputMaybe<Scalars['DateRange']['input']>;
  executionStates?: InputMaybe<Array<BatchState>>;
  processTypes?: InputMaybe<Array<ProcessType>>;
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  period?: InputMaybe<Scalars['DateRange']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySettlementReportsArgs = {
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  period?: InputMaybe<Scalars['DateRange']['input']>;
  executionTime?: InputMaybe<Scalars['DateRange']['input']>;
};


export type QueryActorByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryActorsArgs = {
  eicFunctions?: InputMaybe<Array<EicFunction>>;
};


export type QueryEsettOutgoingMessageByIdArgs = {
  documentId: Scalars['String']['input'];
};


export type QueryEsettExchangeEventsArgs = {
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  periodFrom?: InputMaybe<Scalars['DateTime']['input']>;
  periodTo?: InputMaybe<Scalars['DateTime']['input']>;
  gridAreaCode?: InputMaybe<Scalars['String']['input']>;
  processType?: InputMaybe<ExchangeEventProcessType>;
  documentStatus?: InputMaybe<DocumentStatus>;
  timeSeriesType?: InputMaybe<TimeSeriesType>;
};


export type QuerySearchEsettBalanceResponsibleArgs = {
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  searchText: Scalars['String']['input'];
};

export type Mutation = {
  __typename: 'Mutation';
  updatePermission: Permission;
  createCalculation: CreateCalculationPayload;
};


export type MutationUpdatePermissionArgs = {
  input: UpdatePermissionDtoInput;
};


export type MutationCreateCalculationArgs = {
  input: CreateCalculationInput;
};

export type GridAreaDto = {
  __typename: 'GridAreaDto';
  id: Scalars['UUID']['output'];
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  priceAreaCode: PriceAreaCode;
  validFrom: Scalars['DateTime']['output'];
  validTo?: Maybe<Scalars['DateTime']['output']>;
};

export type OrganizationDto = {
  __typename: 'OrganizationDto';
  organizationId: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  businessRegisterIdentifier: Scalars['String']['output'];
  domain: Scalars['String']['output'];
  comment: Scalars['String']['output'];
  status: OrganizationStatus;
  address: AddressDto;
};

export type ActorNumber = {
  __typename: 'ActorNumber';
  value: Scalars['String']['output'];
};

export enum TimeSeriesType {
  MgaExchange = 'MGA_EXCHANGE',
  Production = 'PRODUCTION',
  Consumption = 'CONSUMPTION'
}

export enum BatchState {
  Pending = 'PENDING',
  Executing = 'EXECUTING',
  Completed = 'COMPLETED',
  Failed = 'FAILED'
}

/** Defines the wholesale process type */
export enum ProcessType {
  BalanceFixing = 'BALANCE_FIXING',
  Aggregation = 'AGGREGATION',
  WholesaleFixing = 'WHOLESALE_FIXING',
  FirstCorrectionSettlement = 'FIRST_CORRECTION_SETTLEMENT',
  SecondCorrectionSettlement = 'SECOND_CORRECTION_SETTLEMENT',
  ThirdCorrectionSettlement = 'THIRD_CORRECTION_SETTLEMENT'
}

export enum DocumentStatus {
  Received = 'RECEIVED',
  AwaitingDispatch = 'AWAITING_DISPATCH',
  AwaitingReply = 'AWAITING_REPLY',
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED'
}

export type UserRoleDto = {
  __typename: 'UserRoleDto';
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  eicFunction: EicFunction;
  status: UserRoleStatus;
};

export enum UserRoleStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export type AddressDto = {
  __typename: 'AddressDto';
  streetName?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['String']['output']>;
  zipCode?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country: Scalars['String']['output'];
};

export enum OrganizationStatus {
  New = 'NEW',
  Active = 'ACTIVE',
  Blocked = 'BLOCKED',
  Deleted = 'DELETED'
}

export enum PriceAreaCode {
  Dk1 = 'DK1',
  Dk2 = 'DK2'
}

export type UpdatePermissionDtoInput = {
  id: Scalars['Int']['input'];
  description: Scalars['String']['input'];
};

export type BalanceResponsibleSearchResponse = {
  __typename: 'BalanceResponsibleSearchResponse';
  items: Array<BalanceResponsibleType>;
  totalCount: Scalars['Int']['output'];
};

export type ExchangeEventSearchResponse = {
  __typename: 'ExchangeEventSearchResponse';
  items: Array<ExchangeEventSearchResult>;
  totalCount: Scalars['Int']['output'];
};

export type SettlementReport = {
  __typename: 'SettlementReport';
  batchNumber: Scalars['UUID']['output'];
  processType: ProcessType;
  gridArea: GridAreaDto;
  period: Scalars['DateRange']['output'];
  executionTime?: Maybe<Scalars['DateTime']['output']>;
};

export type UserRoleWithPermissionsDto = {
  __typename: 'UserRoleWithPermissionsDto';
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  eicFunction: EicFunction;
  status: UserRoleStatus;
  permissions: Array<Permission>;
};

export type PermissionLog = {
  __typename: 'PermissionLog';
  changedByUserName: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['DateTime']['output'];
  type: PermissionAuditLogType;
};

export enum PermissionAuditLogType {
  Unknown = 'UNKNOWN',
  DescriptionChange = 'DESCRIPTION_CHANGE',
  Created = 'CREATED'
}

export type ExchangeEventSearchResult = {
  __typename: 'ExchangeEventSearchResult';
  documentId: Scalars['String']['output'];
  gridAreaCode: Scalars['String']['output'];
  created: Scalars['DateTime']['output'];
  processType: ExchangeEventProcessType;
  timeSeriesType: TimeSeriesType;
  documentStatus: DocumentStatus;
};

export type CreateCalculationInput = {
  period: Scalars['DateRange']['input'];
  gridAreaCodes: Array<Scalars['String']['input']>;
  processType: ProcessType;
};

export type CreateCalculationPayload = {
  __typename: 'CreateCalculationPayload';
  calculation?: Maybe<Calculation>;
};

export type GetPermissionDetailsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetPermissionDetailsQuery = { __typename: 'Query', permissionById: { __typename: 'Permission', id: number, name: string, description: string, created: Date, assignableTo: Array<EicFunction>, userRoles: Array<{ __typename: 'UserRoleDto', id: any, name: string, description: string, eicFunction: EicFunction, status: UserRoleStatus }> } };

export type GetOutgoingMessagesQueryVariables = Exact<{
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  periodFrom?: InputMaybe<Scalars['DateTime']['input']>;
  periodTo?: InputMaybe<Scalars['DateTime']['input']>;
  gridAreaCode?: InputMaybe<Scalars['String']['input']>;
  processType?: InputMaybe<ExchangeEventProcessType>;
  documentStatus?: InputMaybe<DocumentStatus>;
  timeSeriesType?: InputMaybe<TimeSeriesType>;
}>;


export type GetOutgoingMessagesQuery = { __typename: 'Query', esettExchangeEvents: { __typename: 'ExchangeEventSearchResponse', totalCount: number, items: Array<{ __typename: 'ExchangeEventSearchResult', created: Date, documentId: string, gridAreaCode: string, processType: ExchangeEventProcessType, documentStatus: DocumentStatus, timeSeriesType: TimeSeriesType }> } };

export type GetPermissionsQueryVariables = Exact<{
  searchTerm: Scalars['String']['input'];
}>;


export type GetPermissionsQuery = { __typename: 'Query', permissions: Array<{ __typename: 'Permission', id: number, name: string, description: string, created: Date }> };

export type GetPermissionLogsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetPermissionLogsQuery = { __typename: 'Query', permissionLogs: Array<{ __typename: 'PermissionLog', changedByUserName: string, type: PermissionAuditLogType, timestamp: Date, value?: string | null }> };

export type CreateCalculationMutationVariables = Exact<{
  input: CreateCalculationInput;
}>;


export type CreateCalculationMutation = { __typename: 'Mutation', createCalculation: { __typename: 'CreateCalculationPayload', calculation?: { __typename: 'Calculation', id: any } | null } };

export type GetActorFilterQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActorFilterQuery = { __typename: 'Query', actors: Array<{ __typename: 'Actor', value: any, displayValue: string, gridAreas: Array<{ __typename: 'GridAreaDto', code: string }> }> };

export type GetActorsForSettlementReportQueryVariables = Exact<{
  eicFunctions?: InputMaybe<Array<EicFunction> | EicFunction>;
}>;


export type GetActorsForSettlementReportQuery = { __typename: 'Query', actors: Array<{ __typename: 'Actor', value: string, displayValue: string, gridAreas: Array<{ __typename: 'GridAreaDto', code: string }> }> };

export type GetCalculationByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetCalculationByIdQuery = { __typename: 'Query', calculationById: { __typename: 'Calculation', id: any, executionState: BatchState, executionTimeEnd?: Date | null, executionTimeStart?: Date | null, period: { start: Date, end: Date }, statusType: ProcessStatus, processType: ProcessType, createdByUserName?: string | null, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string, id: any, priceAreaCode: PriceAreaCode, validFrom: Date }> } };

export type GetGridAreasQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGridAreasQuery = { __typename: 'Query', gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string, validTo?: Date | null, validFrom: Date }> };

export type GetLatestBalanceFixingQueryVariables = Exact<{
  period?: InputMaybe<Scalars['DateRange']['input']>;
}>;


export type GetLatestBalanceFixingQuery = { __typename: 'Query', calculations: Array<{ __typename: 'Calculation', period: { start: Date, end: Date } }> };

export type GetCalculationsQueryVariables = Exact<{
  executionTime?: InputMaybe<Scalars['DateRange']['input']>;
  period?: InputMaybe<Scalars['DateRange']['input']>;
  processTypes?: InputMaybe<Array<ProcessType> | ProcessType>;
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  executionStates?: InputMaybe<Array<BatchState> | BatchState>;
}>;


export type GetCalculationsQuery = { __typename: 'Query', calculations: Array<{ __typename: 'Calculation', id: any, executionState: BatchState, executionTimeEnd?: Date | null, executionTimeStart?: Date | null, period: { start: Date, end: Date }, statusType: ProcessStatus, processType: ProcessType, createdByUserName?: string | null, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string }> }> };

export type GetActorByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetActorByIdQuery = { __typename: 'Query', actorById: { __typename: 'Actor', id: any, glnOrEicNumber: string, name: string, marketRole?: EicFunction | null, status: ActorStatus, gridAreas: Array<{ __typename: 'GridAreaDto', code: string }>, organization: { __typename: 'OrganizationDto', name: string } } };

export type GetOutgoingMessageByIdQueryVariables = Exact<{
  documentId: Scalars['String']['input'];
}>;


export type GetOutgoingMessageByIdQuery = { __typename: 'Query', esettOutgoingMessageById: { __typename: 'EsettOutgoingMessage', documentId: string, processType: ExchangeEventProcessType, created: Date, periodFrom: Date, periodTo: Date, documentStatus: DocumentStatus, getDispatchDocumentLink?: string | null, getResponseDocumentLink?: string | null, timeSeriesType: TimeSeriesType, gridArea: { __typename: 'GridAreaDto', code: string, name: string } } };

export type GetSettlementReportsQueryVariables = Exact<{
  period?: InputMaybe<Scalars['DateRange']['input']>;
  executionTime?: InputMaybe<Scalars['DateRange']['input']>;
}>;


export type GetSettlementReportsQuery = { __typename: 'Query', settlementReports: Array<{ __typename: 'SettlementReport', batchNumber: any, processType: ProcessType, period: { start: Date, end: Date }, executionTime?: Date | null, gridArea: { __typename: 'GridAreaDto', code: string, name: string } }> };

export type GetActorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActorsQuery = { __typename: 'Query', actors: Array<{ __typename: 'Actor', id: any, glnOrEicNumber: string, name: string, marketRole?: EicFunction | null, status: ActorStatus }> };


export const GetPermissionDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"assignableTo"}},{"kind":"Field","name":{"kind":"Name","value":"userRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eicFunction"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetPermissionDetailsQuery, GetPermissionDetailsQueryVariables>;
export const GetOutgoingMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOutgoingMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodFrom"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodTo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"processType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ExchangeEventProcessType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeSeriesType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TimeSeriesType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettExchangeEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"periodFrom"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodFrom"}}},{"kind":"Argument","name":{"kind":"Name","value":"periodTo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"processType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"processType"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"timeSeriesType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeSeriesType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"processType"}},{"kind":"Field","name":{"kind":"Name","value":"documentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"timeSeriesType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetOutgoingMessagesQuery, GetOutgoingMessagesQueryVariables>;
export const GetPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchTerm"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}}]}}]} as unknown as DocumentNode<GetPermissionsQuery, GetPermissionsQueryVariables>;
export const GetPermissionLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changedByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<GetPermissionLogsQuery, GetPermissionLogsQueryVariables>;
export const CreateCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCalculationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCalculation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCalculationMutation, CreateCalculationMutationVariables>;
export const GetActorFilterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorFilter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"displayValue"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorFilterQuery, GetActorFilterQueryVariables>;
export const GetActorsForSettlementReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorsForSettlementReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","alias":{"kind":"Name","value":"displayValue"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorsForSettlementReportQuery, GetActorsForSettlementReportQueryVariables>;
export const GetCalculationByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCalculationById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"executionState"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeEnd"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeStart"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}},{"kind":"Field","name":{"kind":"Name","value":"processType"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"priceAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}}]}}]}}]}}]} as unknown as DocumentNode<GetCalculationByIdQuery, GetCalculationByIdQueryVariables>;
export const GetGridAreasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"validTo"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}}]}}]}}]} as unknown as DocumentNode<GetGridAreasQuery, GetGridAreasQueryVariables>;
export const GetLatestBalanceFixingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLatestBalanceFixing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}},{"kind":"Argument","name":{"kind":"Name","value":"processTypes"},"value":{"kind":"EnumValue","value":"BALANCE_FIXING"}},{"kind":"Argument","name":{"kind":"Name","value":"executionStates"},"value":{"kind":"EnumValue","value":"COMPLETED"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}}]}}]}}]} as unknown as DocumentNode<GetLatestBalanceFixingQuery, GetLatestBalanceFixingQueryVariables>;
export const GetCalculationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCalculations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"processTypes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProcessType"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCodes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionStates"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BatchState"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"executionTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}}},{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}},{"kind":"Argument","name":{"kind":"Name","value":"processTypes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"processTypes"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCodes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCodes"}}},{"kind":"Argument","name":{"kind":"Name","value":"executionStates"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionStates"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"executionState"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeEnd"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeStart"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}},{"kind":"Field","name":{"kind":"Name","value":"processType"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetCalculationsQuery, GetCalculationsQueryVariables>;
export const GetActorByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorByIdQuery, GetActorByIdQueryVariables>;
export const GetOutgoingMessageByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOutgoingMessageById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettOutgoingMessageById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"processType"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"periodFrom"}},{"kind":"Field","name":{"kind":"Name","value":"periodTo"}},{"kind":"Field","name":{"kind":"Name","value":"documentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getDispatchDocumentLink"}},{"kind":"Field","name":{"kind":"Name","value":"getResponseDocumentLink"}},{"kind":"Field","name":{"kind":"Name","value":"timeSeriesType"}}]}}]}}]} as unknown as DocumentNode<GetOutgoingMessageByIdQuery, GetOutgoingMessageByIdQueryVariables>;
export const GetSettlementReportsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSettlementReports"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settlementReports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}},{"kind":"Argument","name":{"kind":"Name","value":"executionTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batchNumber"}},{"kind":"Field","name":{"kind":"Name","value":"processType"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"executionTime"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetSettlementReportsQuery, GetSettlementReportsQueryVariables>;
export const GetActorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetActorsQuery, GetActorsQueryVariables>;

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPermissionDetailsQuery((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ permissionById })
 *   )
 * })
 */
export const mockGetPermissionDetailsQuery = (resolver: ResponseResolver<GraphQLRequest<GetPermissionDetailsQueryVariables>, GraphQLContext<GetPermissionDetailsQuery>, any>) =>
  graphql.query<GetPermissionDetailsQuery, GetPermissionDetailsQueryVariables>(
    'GetPermissionDetails',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetOutgoingMessagesQuery((req, res, ctx) => {
 *   const { pageNumber, pageSize, periodFrom, periodTo, gridAreaCode, processType, documentStatus, timeSeriesType } = req.variables;
 *   return res(
 *     ctx.data({ esettExchangeEvents })
 *   )
 * })
 */
export const mockGetOutgoingMessagesQuery = (resolver: ResponseResolver<GraphQLRequest<GetOutgoingMessagesQueryVariables>, GraphQLContext<GetOutgoingMessagesQuery>, any>) =>
  graphql.query<GetOutgoingMessagesQuery, GetOutgoingMessagesQueryVariables>(
    'getOutgoingMessages',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPermissionsQuery((req, res, ctx) => {
 *   const { searchTerm } = req.variables;
 *   return res(
 *     ctx.data({ permissions })
 *   )
 * })
 */
export const mockGetPermissionsQuery = (resolver: ResponseResolver<GraphQLRequest<GetPermissionsQueryVariables>, GraphQLContext<GetPermissionsQuery>, any>) =>
  graphql.query<GetPermissionsQuery, GetPermissionsQueryVariables>(
    'GetPermissions',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPermissionLogsQuery((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ permissionLogs })
 *   )
 * })
 */
export const mockGetPermissionLogsQuery = (resolver: ResponseResolver<GraphQLRequest<GetPermissionLogsQueryVariables>, GraphQLContext<GetPermissionLogsQuery>, any>) =>
  graphql.query<GetPermissionLogsQuery, GetPermissionLogsQueryVariables>(
    'GetPermissionLogs',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateCalculationMutation((req, res, ctx) => {
 *   const { input } = req.variables;
 *   return res(
 *     ctx.data({ createCalculation })
 *   )
 * })
 */
export const mockCreateCalculationMutation = (resolver: ResponseResolver<GraphQLRequest<CreateCalculationMutationVariables>, GraphQLContext<CreateCalculationMutation>, any>) =>
  graphql.mutation<CreateCalculationMutation, CreateCalculationMutationVariables>(
    'CreateCalculation',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorFilterQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ actors })
 *   )
 * })
 */
export const mockGetActorFilterQuery = (resolver: ResponseResolver<GraphQLRequest<GetActorFilterQueryVariables>, GraphQLContext<GetActorFilterQuery>, any>) =>
  graphql.query<GetActorFilterQuery, GetActorFilterQueryVariables>(
    'GetActorFilter',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorsForSettlementReportQuery((req, res, ctx) => {
 *   const { eicFunctions } = req.variables;
 *   return res(
 *     ctx.data({ actors })
 *   )
 * })
 */
export const mockGetActorsForSettlementReportQuery = (resolver: ResponseResolver<GraphQLRequest<GetActorsForSettlementReportQueryVariables>, GraphQLContext<GetActorsForSettlementReportQuery>, any>) =>
  graphql.query<GetActorsForSettlementReportQuery, GetActorsForSettlementReportQueryVariables>(
    'GetActorsForSettlementReport',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetCalculationByIdQuery((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ calculationById })
 *   )
 * })
 */
export const mockGetCalculationByIdQuery = (resolver: ResponseResolver<GraphQLRequest<GetCalculationByIdQueryVariables>, GraphQLContext<GetCalculationByIdQuery>, any>) =>
  graphql.query<GetCalculationByIdQuery, GetCalculationByIdQueryVariables>(
    'GetCalculationById',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetGridAreasQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ gridAreas })
 *   )
 * })
 */
export const mockGetGridAreasQuery = (resolver: ResponseResolver<GraphQLRequest<GetGridAreasQueryVariables>, GraphQLContext<GetGridAreasQuery>, any>) =>
  graphql.query<GetGridAreasQuery, GetGridAreasQueryVariables>(
    'GetGridAreas',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetLatestBalanceFixingQuery((req, res, ctx) => {
 *   const { period } = req.variables;
 *   return res(
 *     ctx.data({ calculations })
 *   )
 * })
 */
export const mockGetLatestBalanceFixingQuery = (resolver: ResponseResolver<GraphQLRequest<GetLatestBalanceFixingQueryVariables>, GraphQLContext<GetLatestBalanceFixingQuery>, any>) =>
  graphql.query<GetLatestBalanceFixingQuery, GetLatestBalanceFixingQueryVariables>(
    'GetLatestBalanceFixing',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetCalculationsQuery((req, res, ctx) => {
 *   const { executionTime, period, processTypes, gridAreaCodes, executionStates } = req.variables;
 *   return res(
 *     ctx.data({ calculations })
 *   )
 * })
 */
export const mockGetCalculationsQuery = (resolver: ResponseResolver<GraphQLRequest<GetCalculationsQueryVariables>, GraphQLContext<GetCalculationsQuery>, any>) =>
  graphql.query<GetCalculationsQuery, GetCalculationsQueryVariables>(
    'GetCalculations',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorByIdQuery((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ actorById })
 *   )
 * })
 */
export const mockGetActorByIdQuery = (resolver: ResponseResolver<GraphQLRequest<GetActorByIdQueryVariables>, GraphQLContext<GetActorByIdQuery>, any>) =>
  graphql.query<GetActorByIdQuery, GetActorByIdQueryVariables>(
    'GetActorById',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetOutgoingMessageByIdQuery((req, res, ctx) => {
 *   const { documentId } = req.variables;
 *   return res(
 *     ctx.data({ esettOutgoingMessageById })
 *   )
 * })
 */
export const mockGetOutgoingMessageByIdQuery = (resolver: ResponseResolver<GraphQLRequest<GetOutgoingMessageByIdQueryVariables>, GraphQLContext<GetOutgoingMessageByIdQuery>, any>) =>
  graphql.query<GetOutgoingMessageByIdQuery, GetOutgoingMessageByIdQueryVariables>(
    'GetOutgoingMessageById',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetSettlementReportsQuery((req, res, ctx) => {
 *   const { period, executionTime } = req.variables;
 *   return res(
 *     ctx.data({ settlementReports })
 *   )
 * })
 */
export const mockGetSettlementReportsQuery = (resolver: ResponseResolver<GraphQLRequest<GetSettlementReportsQueryVariables>, GraphQLContext<GetSettlementReportsQuery>, any>) =>
  graphql.query<GetSettlementReportsQuery, GetSettlementReportsQueryVariables>(
    'GetSettlementReports',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorsQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ actors })
 *   )
 * })
 */
export const mockGetActorsQuery = (resolver: ResponseResolver<GraphQLRequest<GetActorsQueryVariables>, GraphQLContext<GetActorsQuery>, any>) =>
  graphql.query<GetActorsQuery, GetActorsQueryVariables>(
    'GetActors',
    resolver
  )

import { dateRangeTypePolicy, dateTypePolicy } from "libs/dh/shared/domain/src/lib/type-policies";

export const scalarTypePolicies = {
  BalanceResponsibleType: {
    fields: { receivedDateTime: dateTypePolicy, validFromDate: dateTypePolicy, validToDate: dateTypePolicy },
  },
  Calculation: {
    fields: { period: dateRangeTypePolicy, executionTimeStart: dateTypePolicy, executionTimeEnd: dateTypePolicy },
  },
  EsettOutgoingMessage: { fields: { created: dateTypePolicy, periodFrom: dateTypePolicy, periodTo: dateTypePolicy } },
  Permission: { fields: { created: dateTypePolicy } },
  GridAreaDto: { fields: { validFrom: dateTypePolicy, validTo: dateTypePolicy } },
  SettlementReport: { fields: { period: dateRangeTypePolicy, executionTime: dateTypePolicy } },
  PermissionLog: { fields: { timestamp: dateTypePolicy } },
  ExchangeEventSearchResult: { fields: { created: dateTypePolicy } },
};
