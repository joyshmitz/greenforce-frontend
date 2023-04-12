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
import { MarketParticipantOrganizationStatus } from './market-participant-organization-status';
import { MarketParticipantAddressDto } from './market-participant-address-dto';


export interface MarketParticipantChangeOrganizationDto { 
    name: string;
    businessRegisterIdentifier: string;
    address: MarketParticipantAddressDto;
    comment?: string | null;
    status: MarketParticipantOrganizationStatus;
}
export namespace MarketParticipantChangeOrganizationDto {
}



