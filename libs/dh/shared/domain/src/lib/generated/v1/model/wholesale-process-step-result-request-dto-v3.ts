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
import { WholesaleTimeSeriesType } from './wholesale-time-series-type';


export interface WholesaleProcessStepResultRequestDtoV3 { 
    batchId: string;
    gridAreaCode: string;
    timeSeriesType: WholesaleTimeSeriesType;
    energySupplierGln?: string | null;
    balanceResponsiblePartyGln?: string | null;
}


