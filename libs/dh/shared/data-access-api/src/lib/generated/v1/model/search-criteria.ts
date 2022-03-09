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


export interface SearchCriteria { 
    messageId?: string | null;
    messageType?: string | null;
    processType?: string | null;
    dateTimeFrom?: string | null;
    dateTimeTo?: string | null;
    senderId?: string | null;
    receiverId?: string | null;
    senderRoleType?: string | null;
    receiverRoleType?: string | null;
    businessSectorType?: string | null;
    reasonCode?: string | null;
    invocationId?: string | null;
    functionName?: string | null;
    traceId?: string | null;
    includeRelated: boolean;
    rsmName?: string | null;
}


