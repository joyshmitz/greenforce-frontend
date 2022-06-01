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
import { ActorStatus } from './actor-status';
import { GlobalLocationNumberDto } from './global-location-number-dto';
import { MarketParticipantMeteringPointType } from './market-participant-metering-point-type';
import { MarketRoleDto } from './market-role-dto';


export interface ActorDto { 
    actorId: string;
    externalActorId?: string | null;
    gln: GlobalLocationNumberDto;
    status: ActorStatus;
    gridAreas: Array<string>;
    marketRoles: Array<MarketRoleDto>;
    meteringPointTypes: Array<MarketParticipantMeteringPointType>;
}


