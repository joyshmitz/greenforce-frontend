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
import { ProcessDetail } from './process-detail';
import { ProcessStatus } from './process-status';


export interface Process { 
    id: string;
    meteringPointGsrn: string;
    name: string;
    createdDate: string;
    effectiveDate?: string | null;
    status: ProcessStatus;
    details: Array<ProcessDetail>;
}


