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
import { MarketParticipantUserOverviewItemDto } from './market-participant-user-overview-item-dto';


export interface MarketParticipantGetUserOverviewResponse { 
    users: Array<MarketParticipantUserOverviewItemDto>;
    totalUserCount: number;
}


