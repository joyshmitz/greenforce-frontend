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
import { WholesaleStatus } from './wholesale-status';


export interface WholesaleSearchBatchResponseDto { 
    batchNumber: number;
    periodStart: string;
    periodEnd: string;
    executionTimeStart: string;
    executionTimeEnd?: string | null;
    executionState: WholesaleStatus;
}


