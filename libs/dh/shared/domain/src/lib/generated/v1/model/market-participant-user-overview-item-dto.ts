/**
 * DataHub BFF
 * Backend-for-frontend for DataHub
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { MarketParticipantAssignedActorDto } from './market-participant-assigned-actor-dto';
import { MarketParticipantUserStatus } from './market-participant-user-status';


export interface MarketParticipantUserOverviewItemDto { 
    id: string;
    status: MarketParticipantUserStatus;
    name: string;
    email: string;
    phoneNumber?: string | null;
    createdDate: string;
    assignedActors: Array<MarketParticipantAssignedActorDto>;
}
export namespace MarketParticipantUserOverviewItemDto {
}



