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
import { MeteringPointsProcessStatus } from './metering-points-process-status';
import { MeteringPointsProcessDetailError } from './metering-points-process-detail-error';


export interface MeteringPointsProcessDetail { 
    id: string;
    processId: string;
    name: string;
    sender: string;
    receiver: string;
    createdDate: string;
    effectiveDate?: string | null;
    status: MeteringPointsProcessStatus;
    errors: Array<MeteringPointsProcessDetailError>;
}


