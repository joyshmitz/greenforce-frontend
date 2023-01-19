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
import { EicFunction } from './eic-function';
import { UserRoleStatus } from './user-role-status';


export interface UserRoleDto { 
    id: string;
    name: string;
    description: string;
    eicFunction: EicFunction;
    status: UserRoleStatus;
}


