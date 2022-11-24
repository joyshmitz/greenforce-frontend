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
import { ProcessType } from './process-type';


export interface BatchRequestDto { 
    processType: ProcessType;
    gridAreaCodes: Array<string>;
    startDate: string;
    endDate: string;
}


