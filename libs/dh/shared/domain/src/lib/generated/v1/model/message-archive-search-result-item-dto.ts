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
import { MessageArchiveSearchResultItemErrorDto } from './message-archive-search-result-item-error-dto';


export interface MessageArchiveSearchResultItemDto { 
    messageId?: string | null;
    messageType?: string | null;
    processType?: string | null;
    businessSectorType?: string | null;
    reasonCode?: string | null;
    createdDate?: string | null;
    logCreatedDate?: string | null;
    senderGln?: string | null;
    senderGlnMarketRoleType?: string | null;
    receiverGln?: string | null;
    receiverGlnMarketRoleType?: string | null;
    blobContentUri: string;
    httpData?: string | null;
    invocationId?: string | null;
    functionName?: string | null;
    traceId?: string | null;
    traceParent?: string | null;
    responseStatus?: string | null;
    originalTransactionIDReferenceId?: string | null;
    rsmName?: string | null;
    haveBodyContent?: boolean | null;
    data?: { [key: string]: string; } | null;
    errors?: Array<MessageArchiveSearchResultItemErrorDto> | null;
}


