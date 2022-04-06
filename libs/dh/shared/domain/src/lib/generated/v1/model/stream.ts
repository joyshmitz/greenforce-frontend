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


export interface Stream { 
    readonly canRead: boolean;
    readonly canWrite: boolean;
    readonly canSeek: boolean;
    readonly canTimeout: boolean;
    readonly length: number;
    position: number;
    readTimeout: number;
    writeTimeout: number;
}


