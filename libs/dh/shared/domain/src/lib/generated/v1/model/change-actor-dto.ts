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
import { GlobalLocationNumberDto } from './global-location-number-dto';
import { MarketRoleDto } from './market-role-dto';


export interface ChangeActorDto { 
    gln: GlobalLocationNumberDto;
    status: string;
    marketRoles: Array<MarketRoleDto>;
}


