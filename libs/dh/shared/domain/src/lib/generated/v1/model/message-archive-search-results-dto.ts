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
import { MessageArchiveSearchResultItemDto } from './message-archive-search-result-item-dto';


export interface MessageArchiveSearchResultsDto { 
    result: Array<MessageArchiveSearchResultItemDto>;
    continuationToken?: string | null;
}


