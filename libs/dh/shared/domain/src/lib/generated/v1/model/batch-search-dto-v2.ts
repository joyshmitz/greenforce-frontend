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
import { BatchState } from './batch-state';


export interface BatchSearchDtoV2 { 
    filterByGridAreaCodes?: Array<string> | null;
    filterByExecutionState: BatchState;
    minExecutionTime?: string | null;
    maxExecutionTime?: string | null;
    periodStart?: string | null;
    periodEnd?: string | null;
}


