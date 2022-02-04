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
import { ChargeType } from './charge-type';


export interface ChargeLinkDto { 
    chargeType: ChargeType;
    chargeId?: string | null;
    chargeName?: string | null;
    chargeOwnerIdentificationNumber?: string | null;
    chargeOwnerName?: string | null;
    taxIndicator: boolean;
    transparentInvoicing: boolean;
    quantity: number;
    startDate: string;
    endDate?: string | null;
}


