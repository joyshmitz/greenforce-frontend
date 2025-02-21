//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import {
  AssetType,
  CommercialRelationDto,
  ConnectionState,
  ConnectionType,
  CustomerRelation,
  DisconnectionType,
  ElectricityMarketMeteringPointType,
  MeteringPointPeriodDto,
  MeteringPointSubType,
  MeteringPointUnit,
  mockGetCommercialRelationsQuery,
  mockGetMeteringPointWithHistoryQuery,
  Product,
  SettlementMethod,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { delay, HttpResponse } from 'msw';

import { mswConfig } from '@energinet-datahub/gf/util-msw';

export function electricityMarketMocks() {
  return [getMeteringPointsQuery(), getCommercialRelationsQuery()];
}

const meteringPoints: MeteringPointPeriodDto[] = [
  {
    __typename: 'MeteringPointPeriodDto',
    id: '1',
    connectionState: ConnectionState.Connected,
    createdAt: new Date(),
    gridAreaCode: '1',
    ownedBy: '5790000000001',
    product: Product.FuelQuantity,
    resolution: 'PT15M',
    type: ElectricityMarketMeteringPointType.ActualConsumption,
    scheduledMeterReadingMonth: 1,
    subType: MeteringPointSubType.Physical,
    validFrom: new Date(),
    validTo: new Date(),
    unit: MeteringPointUnit.KWh,
    assetType: AssetType.CombustionEngineBio,
    effectuationDate: new Date(),
    transactionType: 'tbd',
    disconnectionType: DisconnectionType.ManualDisconnection,
    fuelType: 'tbd',
    fromGridAreaCode: '123',
    toGridAreaCode: '321',
    meterNumber: '138426',
    meterReadingOccurrence: 'PT15M',
    capacity: '6',
    connectionType: ConnectionType.Installation,
    netSettlementGroup: '6',
    parentMeteringPoint: null,
    powerLimitKw: '50',
    powerPlantGsrn: '1234567891234',
    productCode: 'Active Energy',
    productionObligation: 'tbd',
    scheduledMeterReading: '01-01',
    installationAddress: {
      __typename: 'InstallationAddressDto',
      id: '1',
      streetName: 'Energivej',
      cityName: 'Fredericia',
      streetCode: '0138',
      buildingNumber: '12',
      citySubDivisionName: '-',
      darReference: '4dd75991-947b-4c69-b902-8d8830bc0e6d',
      washInstruction: '-',
      countryCode: 'DA',
      floor: '1',
      room: 'th',
      postCode: '7000',
      municipalityCode: '607',
      locationDescription: '-',
    },
    calculationType: 'Flex',
    settlementMethod: SettlementMethod.NonProfiled,
  },
  {
    __typename: 'MeteringPointPeriodDto',
    id: '2',
    connectionState: ConnectionState.Disconnected,
    createdAt: new Date(),
    gridAreaCode: '2',
    ownedBy: '5790000000002',
    product: Product.EnergyActive,
    resolution: 'PT15M',
    type: ElectricityMarketMeteringPointType.CapacitySettlement,
    scheduledMeterReadingMonth: 2,
    subType: MeteringPointSubType.Physical,
    validFrom: new Date(),
    validTo: new Date(),
    unit: MeteringPointUnit.KWh,
    effectuationDate: new Date(),
    transactionType: 'tbd',
    assetType: AssetType.CombustionEngineGas,
    disconnectionType: DisconnectionType.ManualDisconnection,
    fuelType: 'tbd',
    fromGridAreaCode: '123',
    toGridAreaCode: '321',
    meterNumber: '138426',
    meterReadingOccurrence: 'PT15M',
    capacity: '6',
    connectionType: ConnectionType.Installation,
    netSettlementGroup: '6',
    parentMeteringPoint: null,
    powerLimitKw: '50',
    powerPlantGsrn: '1234567891234',
    productCode: 'Active Energy',
    productionObligation: 'tbd',
    scheduledMeterReading: '01-01',
    installationAddress: {
      __typename: 'InstallationAddressDto',
      id: '2',
      streetName: 'Energivej',
      cityName: 'Fredericia',
      streetCode: '0138',
      buildingNumber: '12',
      citySubDivisionName: '-',
      darReference: '4dd75991-947b-4c69-b902-8d8830bc0e6d',
      washInstruction: '-',
      countryCode: 'DA',
      floor: '1',
      room: 'th',
      postCode: '7000',
      municipalityCode: '607',
      locationDescription: '-',
    },
    calculationType: 'Flex',
    settlementMethod: SettlementMethod.FlexSettled,
  },
  {
    __typename: 'MeteringPointPeriodDto',
    id: '3',
    connectionState: ConnectionState.Disconnected,
    createdAt: new Date(),
    gridAreaCode: '3',
    ownedBy: '5790000000003',
    product: Product.PowerActive,
    resolution: 'PT15M',
    type: ElectricityMarketMeteringPointType.Consumption,
    scheduledMeterReadingMonth: 3,
    subType: MeteringPointSubType.Virtual,
    validFrom: new Date(),
    validTo: new Date(),
    unit: MeteringPointUnit.KWh,
    effectuationDate: new Date(),
    transactionType: 'tbd',
    assetType: AssetType.Boiler,
    disconnectionType: DisconnectionType.ManualDisconnection,
    fuelType: 'tbd',
    fromGridAreaCode: '123',
    toGridAreaCode: '321',
    meterNumber: '138426',
    meterReadingOccurrence: 'PT15M',
    capacity: '6',
    connectionType: ConnectionType.Installation,
    netSettlementGroup: '6',
    parentMeteringPoint: null,
    powerLimitKw: '50',
    powerPlantGsrn: '1234567891234',
    productCode: 'Active Energy',
    productionObligation: 'tbd',
    scheduledMeterReading: '01-01',
    installationAddress: {
      __typename: 'InstallationAddressDto',
      id: '3',
      streetName: 'Energivej',
      cityName: 'Fredericia',
      streetCode: '0138',
      buildingNumber: '12',
      citySubDivisionName: '-',
      darReference: '4dd75991-947b-4c69-b902-8d8830bc0e6d',
      washInstruction: '-',
      countryCode: 'DA',
      floor: '1',
      room: 'th',
      postCode: '7000',
      municipalityCode: '607',
      locationDescription: '-',
    },
    calculationType: 'Flex',
    settlementMethod: SettlementMethod.FlexSettled,
  },
  {
    __typename: 'MeteringPointPeriodDto',
    id: '4',
    connectionState: ConnectionState.Disconnected,
    createdAt: new Date(),
    gridAreaCode: '4',
    ownedBy: '5790000000004',
    product: Product.PowerActive,
    resolution: 'PT15M',
    type: ElectricityMarketMeteringPointType.CapacitySettlement,
    scheduledMeterReadingMonth: 4,
    subType: MeteringPointSubType.Virtual,
    validFrom: new Date(),
    validTo: new Date(),
    unit: MeteringPointUnit.KWh,
    effectuationDate: new Date(),
    transactionType: 'tbd',
    assetType: AssetType.PermanentConnectedElectricalEnergyStorageFacilities,
    disconnectionType: DisconnectionType.ManualDisconnection,
    fuelType: 'tbd',
    fromGridAreaCode: '123',
    toGridAreaCode: '321',
    meterNumber: '138426',
    meterReadingOccurrence: 'PT15M',
    capacity: '6',
    connectionType: ConnectionType.Installation,
    netSettlementGroup: '6',
    parentMeteringPoint: null,
    powerLimitKw: '50',
    powerPlantGsrn: '1234567891234',
    productCode: 'Active Energy',
    productionObligation: 'tbd',
    scheduledMeterReading: '01-01',
    installationAddress: {
      __typename: 'InstallationAddressDto',
      id: '4',
      streetName: 'Energivej',
      cityName: 'Fredericia',
      streetCode: '0138',
      buildingNumber: '12',
      citySubDivisionName: '-',
      darReference: '4dd75991-947b-4c69-b902-8d8830bc0e6d',
      washInstruction: '-',
      countryCode: 'DA',
      floor: '1',
      room: 'th',
      postCode: '7000',
      municipalityCode: '607',
      locationDescription: '-',
    },
    calculationType: 'Flex',
    settlementMethod: SettlementMethod.NonProfiled,
  },
  {
    __typename: 'MeteringPointPeriodDto',
    id: '5',
    connectionState: ConnectionState.Disconnected,
    createdAt: new Date(),
    gridAreaCode: '5',
    ownedBy: '5790000000005',
    product: Product.Tariff,
    resolution: 'PT15M',
    type: ElectricityMarketMeteringPointType.CollectiveNetConsumption,
    scheduledMeterReadingMonth: 5,
    subType: MeteringPointSubType.Virtual,
    validFrom: new Date(),
    validTo: new Date(),
    unit: MeteringPointUnit.KWh,
    effectuationDate: new Date(),
    transactionType: 'tbd',
    assetType: AssetType.CombustionEngineDiesel,
    disconnectionType: DisconnectionType.ManualDisconnection,
    fuelType: 'tbd',
    fromGridAreaCode: '123',
    toGridAreaCode: '321',
    meterNumber: '138426',
    meterReadingOccurrence: 'PT15M',
    capacity: '6',
    connectionType: ConnectionType.Direct,
    netSettlementGroup: '6',
    parentMeteringPoint: null,
    powerLimitKw: '50',
    powerPlantGsrn: '1234567891234',
    productCode: 'Active Energy',
    productionObligation: 'tbd',
    scheduledMeterReading: '01-01',
    installationAddress: {
      __typename: 'InstallationAddressDto',
      id: '5',
      streetName: 'Energivej',
      cityName: 'Fredericia',
      streetCode: '0138',
      buildingNumber: '12',
      citySubDivisionName: '-',
      darReference: '4dd75991-947b-4c69-b902-8d8830bc0e6d',
      washInstruction: '-',
      countryCode: 'DA',
      floor: '1',
      room: 'th',
      postCode: '7000',
      municipalityCode: '607',
      locationDescription: '-',
    },
    calculationType: 'Flex',
    settlementMethod: SettlementMethod.FlexSettled,
  },
  {
    __typename: 'MeteringPointPeriodDto',
    id: '6',
    connectionState: ConnectionState.Disconnected,
    createdAt: new Date(),
    gridAreaCode: '6',
    ownedBy: '5790000000006',
    product: Product.FuelQuantity,
    resolution: 'PT15M',
    type: ElectricityMarketMeteringPointType.Consumption,
    scheduledMeterReadingMonth: 6,
    subType: MeteringPointSubType.Virtual,
    validFrom: new Date(),
    validTo: new Date(),
    unit: MeteringPointUnit.KWh,
    effectuationDate: new Date(),
    transactionType: 'tbd',
    assetType: AssetType.CombustionEngineGas,
    disconnectionType: DisconnectionType.ManualDisconnection,
    fuelType: 'tbd',
    fromGridAreaCode: '123',
    toGridAreaCode: '321',
    meterNumber: '138426',
    meterReadingOccurrence: 'PT15M',
    capacity: '6',
    connectionType: ConnectionType.Installation,
    netSettlementGroup: '6',
    parentMeteringPoint: null,
    powerLimitKw: '50',
    powerPlantGsrn: '1234567891234',
    productCode: 'Active Energy',
    productionObligation: 'tbd',
    scheduledMeterReading: '01-01',
    installationAddress: {
      __typename: 'InstallationAddressDto',
      id: '6',
      streetName: 'Energivej',
      cityName: 'Fredericia',
      streetCode: '0138',
      buildingNumber: '12',
      citySubDivisionName: '-',
      darReference: '4dd75991-947b-4c69-b902-8d8830bc0e6d',
      washInstruction: '-',
      countryCode: 'DA',
      floor: '1',
      room: 'th',
      postCode: '7000',
      municipalityCode: '607',
      locationDescription: '-',
    },
    calculationType: 'Flex',
    settlementMethod: SettlementMethod.NonProfiled,
  },
  {
    __typename: 'MeteringPointPeriodDto',
    id: '7',
    connectionState: ConnectionState.Disconnected,
    createdAt: new Date(),
    gridAreaCode: '7',
    ownedBy: '5790000000007',
    product: Product.EnergyReactive,
    resolution: 'PT15M',
    type: ElectricityMarketMeteringPointType.CapacitySettlement,
    scheduledMeterReadingMonth: 7,
    subType: MeteringPointSubType.Physical,
    validFrom: new Date(),
    validTo: new Date(),
    unit: MeteringPointUnit.MWh,
    effectuationDate: new Date(),
    transactionType: 'tbd',
    assetType: AssetType.CombustionEngineDiesel,
    disconnectionType: DisconnectionType.RemoteDisconnection,
    fuelType: 'tbd',
    fromGridAreaCode: '123',
    toGridAreaCode: '321',
    meterNumber: '138426',
    meterReadingOccurrence: 'PT15M',
    capacity: '6',
    connectionType: ConnectionType.Direct,
    netSettlementGroup: '6',
    parentMeteringPoint: null,
    powerLimitKw: '50',
    powerPlantGsrn: '1234567891234',
    productCode: 'Active Energy',
    productionObligation: 'tbd',
    scheduledMeterReading: '01-01',
    installationAddress: {
      __typename: 'InstallationAddressDto',
      id: '7',
      streetName: 'Energivej',
      cityName: 'Fredericia',
      streetCode: '0138',
      buildingNumber: '12',
      citySubDivisionName: '-',
      darReference: '4dd75991-947b-4c69-b902-8d8830bc0e6d',
      washInstruction: '-',
      countryCode: 'DA',
      floor: '1',
      room: 'th',
      postCode: '7000',
      municipalityCode: '607',
      locationDescription: '-',
    },
    calculationType: 'Flex',
    settlementMethod: SettlementMethod.FlexSettled,
  },
  {
    __typename: 'MeteringPointPeriodDto',
    id: '8',
    connectionState: ConnectionState.New,
    createdAt: new Date(),
    gridAreaCode: '8',
    ownedBy: '5790000000008',
    product: Product.FuelQuantity,
    resolution: 'PT15M',
    type: ElectricityMarketMeteringPointType.ActualProduction,
    scheduledMeterReadingMonth: 8,
    subType: MeteringPointSubType.Physical,
    validFrom: new Date(),
    validTo: new Date(),
    unit: MeteringPointUnit.MvAr,
    effectuationDate: new Date(),
    transactionType: 'tbd',
    assetType: AssetType.MixedProduction,
    disconnectionType: DisconnectionType.RemoteDisconnection,
    fuelType: 'tbd',
    fromGridAreaCode: '123',
    toGridAreaCode: '321',
    meterNumber: '138426',
    meterReadingOccurrence: 'PT15M',
    capacity: '6',
    connectionType: ConnectionType.Installation,
    netSettlementGroup: '6',
    parentMeteringPoint: null,
    powerLimitKw: '50',
    powerPlantGsrn: '1234567891234',
    productCode: 'Active Energy',
    productionObligation: 'tbd',
    scheduledMeterReading: '01-01',
    installationAddress: {
      __typename: 'InstallationAddressDto',
      id: '8',
      streetName: 'Energivej',
      cityName: 'Fredericia',
      streetCode: '0138',
      buildingNumber: '12',
      citySubDivisionName: '-',
      darReference: '4dd75991-947b-4c69-b902-8d8830bc0e6d',
      washInstruction: '-',
      countryCode: 'DA',
      floor: '1',
      room: 'th',
      postCode: '7000',
      municipalityCode: '607',
      locationDescription: '-',
    },
    calculationType: 'Flex',
    settlementMethod: SettlementMethod.NonProfiled,
  },
  {
    __typename: 'MeteringPointPeriodDto',
    id: '9',
    connectionState: ConnectionState.Disconnected,
    createdAt: new Date(),
    gridAreaCode: '9',
    ownedBy: '5790000000009',
    product: Product.FuelQuantity,
    resolution: 'PT15M',
    type: ElectricityMarketMeteringPointType.CapacitySettlement,
    scheduledMeterReadingMonth: 9,
    subType: MeteringPointSubType.Physical,
    validFrom: new Date(),
    validTo: new Date(),
    unit: MeteringPointUnit.MWh,
    effectuationDate: new Date(),
    transactionType: 'tbd',
    assetType: AssetType.CombustionEngineDiesel,
    disconnectionType: DisconnectionType.RemoteDisconnection,
    fuelType: 'tbd',
    fromGridAreaCode: '123',
    toGridAreaCode: '321',
    meterNumber: '138426',
    meterReadingOccurrence: 'PT15M',
    capacity: '6',
    connectionType: ConnectionType.Installation,
    netSettlementGroup: '6',
    parentMeteringPoint: null,
    powerLimitKw: '50',
    powerPlantGsrn: '1234567891234',
    productCode: 'Active Energy',
    productionObligation: 'tbd',
    scheduledMeterReading: '01-01',
    installationAddress: {
      __typename: 'InstallationAddressDto',
      id: '9',
      streetName: 'Energivej',
      cityName: 'Fredericia',
      streetCode: '0138',
      buildingNumber: '12',
      citySubDivisionName: '-',
      darReference: '4dd75991-947b-4c69-b902-8d8830bc0e6d',
      washInstruction: '-',
      countryCode: 'DA',
      floor: '1',
      room: 'th',
      postCode: '7000',
      municipalityCode: '607',
      locationDescription: '-',
    },
    calculationType: 'Flex',
    settlementMethod: SettlementMethod.FlexSettled,
  },
  {
    __typename: 'MeteringPointPeriodDto',
    id: '10',
    connectionState: ConnectionState.Disconnected,
    createdAt: new Date(),
    gridAreaCode: '10',
    ownedBy: '5790000000010',
    product: Product.FuelQuantity,
    resolution: 'PT15M',
    type: ElectricityMarketMeteringPointType.ActualProduction,
    scheduledMeterReadingMonth: 10,
    subType: MeteringPointSubType.Physical,
    validFrom: new Date(),
    validTo: new Date(),
    unit: MeteringPointUnit.MWh,
    effectuationDate: new Date(),
    transactionType: 'tbd',
    assetType: AssetType.CombustionEngineDiesel,
    disconnectionType: DisconnectionType.RemoteDisconnection,
    fuelType: 'tbd',
    fromGridAreaCode: '123',
    toGridAreaCode: '321',
    meterNumber: '138426',
    meterReadingOccurrence: 'PT15M',
    capacity: '6',
    connectionType: ConnectionType.Installation,
    netSettlementGroup: '6',
    parentMeteringPoint: null,
    powerLimitKw: '50',
    powerPlantGsrn: '1234567891234',
    productCode: 'Active Energy',
    productionObligation: 'tbd',
    scheduledMeterReading: '01-01',
    installationAddress: {
      __typename: 'InstallationAddressDto',
      id: '10',
      streetName: 'Energivej',
      cityName: 'Fredericia',
      streetCode: '0138',
      buildingNumber: '12',
      citySubDivisionName: '-',
      darReference: '4dd75991-947b-4c69-b902-8d8830bc0e6d',
      washInstruction: '-',
      countryCode: 'DA',
      floor: '1',
      room: 'th',
      postCode: '7000',
      municipalityCode: '607',
      locationDescription: '-',
    },
    calculationType: 'Flex',
    settlementMethod: SettlementMethod.FlexSettled,
  },
  {
    __typename: 'MeteringPointPeriodDto',
    id: '11',
    connectionState: ConnectionState.Disconnected,
    createdAt: new Date(),
    gridAreaCode: '11',
    ownedBy: '5790000000011',
    product: Product.FuelQuantity,
    resolution: 'PT15M',
    type: ElectricityMarketMeteringPointType.ActualProduction,
    scheduledMeterReadingMonth: 11,
    subType: MeteringPointSubType.Physical,
    validFrom: new Date(),
    validTo: new Date(),
    unit: MeteringPointUnit.MWh,
    effectuationDate: new Date(),
    transactionType: 'tbd',
    assetType: AssetType.CombustionEngineDiesel,
    disconnectionType: DisconnectionType.RemoteDisconnection,
    fuelType: 'tbd',
    fromGridAreaCode: '123',
    toGridAreaCode: '321',
    meterNumber: '138426',
    meterReadingOccurrence: 'PT15M',
    capacity: '6',
    connectionType: ConnectionType.Installation,
    netSettlementGroup: '6',
    parentMeteringPoint: null,
    powerLimitKw: '50',
    powerPlantGsrn: '1234567891234',
    productCode: 'Active Energy',
    productionObligation: 'tbd',
    scheduledMeterReading: '01-01',
    installationAddress: {
      __typename: 'InstallationAddressDto',
      id: '11',
      streetName: 'Energivej',
      cityName: 'Fredericia',
      streetCode: '0138',
      buildingNumber: '12',
      citySubDivisionName: '-',
      darReference: '4dd75991-947b-4c69-b902-8d8830bc0e6d',
      washInstruction: '-',
      countryCode: 'DA',
      floor: '1',
      room: 'th',
      postCode: '7000',
      municipalityCode: '607',
      locationDescription: '-',
    },
    calculationType: 'Flex',
    settlementMethod: SettlementMethod.FlexSettled,
  },
];

const commercialRelations: CommercialRelationDto[] = [
  {
    __typename: 'CommercialRelationDto',
    endDate: new Date(),
    energySupplyPeriods: [
      {
        __typename: 'EnergySupplierPeriodDto',
        businessTransactionDosId: '1',
        energySupplier: '579000000',
        id: '1',
        validFrom: new Date(),
        validTo: new Date(),
        webAccessCode: '1',
        retiredAt: new Date(),
        retiredById: 2,
        contacts: [
          {
            __typename: 'ContactDto',
            id: '1',
            relationType: CustomerRelation.Legal,
            disponentName: 'Energitte Strøm',
            cvr: 'tbd',
            name: 'Energitte Strøm',
            phone: '12345678',
            mobile: '87654321',
            email: 'tbd',
            attention: 'tbd',
            isProtectedName: true,
            address: {
              __typename: 'ContactAddressDto',
              id: '1',
              streetName: 'Energivej',
              streetCode: '0138',
              buildingNumber: '12',
              cityName: 'Fredericia',
              citySubDivisionName: '-',
              darReference: '01437309-5837-400c-b349-332f5a4ca702',
              isProtectedAddress: true,
              countryCode: 'DA',
              floor: '1',
              room: 'th',
              postBox: '-',
              postCode: '7000',
              municipalityCode: '607',
            },
          },
        ],
      },
    ],
    electricalHeatingPeriods: [
      {
        __typename: 'ElectricalHeatingPeriodDto',
        businessTransactionDosId: '1',
        id: '1',
        validFrom: new Date(),
        validTo: new Date(),
        retiredAt: new Date(),
        retiredById: 2,
        transactionType: 'tbd',
      },
    ],
    energySupplier: '579000000',
    id: '1',
    meteringPointId: '1',
    modifiedAt: new Date(),
    startDate: new Date(),
  },
  {
    __typename: 'CommercialRelationDto',
    endDate: new Date(),
    energySupplyPeriods: [
      {
        __typename: 'EnergySupplierPeriodDto',
        businessTransactionDosId: '2',
        energySupplier: '579000001',
        id: '2',
        validFrom: new Date(),
        validTo: new Date(),
        webAccessCode: '2',
        retiredAt: new Date(),
        retiredById: 3,
        contacts: [
          {
            __typename: 'ContactDto',
            id: '2',
            relationType: CustomerRelation.Technical,
            disponentName: 'Energitte Strøm',
            cvr: 'tbd',
            name: 'Energitte Strøm',
            phone: '12345678',
            mobile: '87654321',
            email: 'tbd',
            attention: 'tbd',
            isProtectedName: true,
            address: {
              __typename: 'ContactAddressDto',
              id: '2',
              streetName: 'Energivej',
              streetCode: '0138',
              buildingNumber: '12',
              cityName: 'Fredericia',
              citySubDivisionName: '-',
              darReference: '01437309-5837-400c-b349-332f5a4ca702',
              isProtectedAddress: true,
              countryCode: 'DA',
              floor: '1',
              room: 'th',
              postBox: '-',
              postCode: '7000',
              municipalityCode: '607',
            },
          },
        ],
      },
    ],
    electricalHeatingPeriods: [
      {
        __typename: 'ElectricalHeatingPeriodDto',
        businessTransactionDosId: '2',
        id: '2',
        validFrom: new Date(),
        validTo: new Date(),
        retiredAt: new Date(),
        retiredById: 2,
        transactionType: 'tbd',
      },
    ],
    energySupplier: '579000001',
    id: '2',
    meteringPointId: '2',
    modifiedAt: new Date(),
    startDate: new Date(),
  },
  {
    __typename: 'CommercialRelationDto',
    endDate: new Date(),
    energySupplyPeriods: [
      {
        __typename: 'EnergySupplierPeriodDto',
        businessTransactionDosId: '3',
        energySupplier: '579000002',
        id: '3',
        validFrom: new Date(),
        validTo: new Date(),
        webAccessCode: '3',
        retiredAt: new Date(),
        retiredById: 4,
        contacts: [
          {
            __typename: 'ContactDto',
            id: '3',
            relationType: CustomerRelation.Legal,
            disponentName: 'Energitte Strøm',
            cvr: 'tbd',
            name: 'Energitte Strøm',
            phone: '12345678',
            mobile: '87654321',
            email: 'tbd',
            attention: 'tbd',
            isProtectedName: true,
            address: {
              id: '3',
              __typename: 'ContactAddressDto',
              streetName: 'Energivej',
              streetCode: '0138',
              buildingNumber: '12',
              cityName: 'Fredericia',
              citySubDivisionName: '-',
              darReference: '01437309-5837-400c-b349-332f5a4ca702',
              isProtectedAddress: true,
              countryCode: 'DA',
              floor: '1',
              room: 'th',
              postBox: '-',
              postCode: '7000',
              municipalityCode: '607',
            },
          },
        ],
      },
    ],
    electricalHeatingPeriods: [
      {
        __typename: 'ElectricalHeatingPeriodDto',
        businessTransactionDosId: '3',
        id: '3',
        validFrom: new Date(),
        validTo: new Date(),
        retiredAt: new Date(),
        retiredById: 2,
        transactionType: 'tbd',
      },
    ],
    energySupplier: '579000002',
    id: '3',
    meteringPointId: '3',
    modifiedAt: new Date(),
    startDate: new Date(),
  },
  {
    __typename: 'CommercialRelationDto',
    endDate: new Date(),
    energySupplyPeriods: [
      {
        __typename: 'EnergySupplierPeriodDto',
        businessTransactionDosId: '4',
        energySupplier: '579000003',
        id: '4',
        validFrom: new Date(),
        validTo: new Date(),
        webAccessCode: '4',
        retiredAt: new Date(),
        retiredById: 5,
        contacts: [
          {
            __typename: 'ContactDto',
            id: '4',
            relationType: CustomerRelation.Legal,
            disponentName: 'Energitte Strøm',
            cvr: 'tbd',
            name: 'Energitte Strøm',
            phone: '12345678',
            mobile: '87654321',
            email: 'tbd',
            attention: 'tbd',
            isProtectedName: true,
            address: {
              id: '4',
              __typename: 'ContactAddressDto',
              streetName: 'Energivej',
              streetCode: '0138',
              buildingNumber: '12',
              cityName: 'Fredericia',
              citySubDivisionName: '-',
              darReference: '01437309-5837-400c-b349-332f5a4ca702',
              isProtectedAddress: true,
              countryCode: 'DA',
              floor: '1',
              room: 'th',
              postBox: '-',
              postCode: '7000',
              municipalityCode: '607',
            },
          },
        ],
      },
    ],
    electricalHeatingPeriods: [
      {
        __typename: 'ElectricalHeatingPeriodDto',
        businessTransactionDosId: '4',
        id: '4',
        validFrom: new Date(),
        validTo: new Date(),
        retiredAt: new Date(),
        retiredById: 2,
        transactionType: 'tbd',
      },
    ],
    energySupplier: '579000003',
    id: '4',
    meteringPointId: '4',
    modifiedAt: new Date(),
    startDate: new Date(),
  },
  {
    __typename: 'CommercialRelationDto',
    endDate: new Date(),
    energySupplyPeriods: [
      {
        __typename: 'EnergySupplierPeriodDto',
        businessTransactionDosId: '5',
        energySupplier: '579000004',
        id: '5',
        validFrom: new Date(),
        validTo: new Date(),
        webAccessCode: '5',
        retiredAt: new Date(),
        retiredById: 6,
        contacts: [
          {
            __typename: 'ContactDto',
            id: '5',
            relationType: CustomerRelation.Technical,
            disponentName: 'Energitte Strøm',
            cvr: 'tbd',
            name: 'Energitte Strøm',
            phone: '12345678',
            mobile: '87654321',
            email: 'tbd',
            attention: 'tbd',
            isProtectedName: true,
            address: {
              __typename: 'ContactAddressDto',
              id: '5',
              streetName: 'Energivej',
              streetCode: '0138',
              buildingNumber: '12',
              cityName: 'Fredericia',
              citySubDivisionName: '-',
              darReference: '01437309-5837-400c-b349-332f5a4ca702',
              isProtectedAddress: true,
              countryCode: 'DA',
              floor: '1',
              room: 'th',
              postBox: '-',
              postCode: '7000',
              municipalityCode: '607',
            },
          },
        ],
      },
    ],
    electricalHeatingPeriods: [
      {
        __typename: 'ElectricalHeatingPeriodDto',
        businessTransactionDosId: '5',
        id: '5',
        validFrom: new Date(),
        validTo: new Date(),
        retiredAt: new Date(),
        retiredById: 2,
        transactionType: 'tbd',
      },
    ],
    energySupplier: '579000004',
    id: '5',
    meteringPointId: '5',
    modifiedAt: new Date(),
    startDate: new Date(),
  },
];

function getMeteringPointsQuery() {
  return mockGetMeteringPointWithHistoryQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPointWithHistory: {
          __typename: 'MeteringPointDto',
          id: '1',
          meteringPointId: '1',
          meteringPointPeriods: {
            __typename: 'MeteringPointPeriodsConnection',
            totalCount: meteringPoints.length,
            pageInfo: {
              __typename: 'PageInfo',
              endCursor: '11',
              startCursor: null,
            },
            nodes: meteringPoints,
          },
        },
      },
    });
  });
}

function getCommercialRelationsQuery() {
  return mockGetCommercialRelationsQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPointWithHistory: {
          __typename: 'MeteringPointDto',
          meteringPointId: '1',
          id: '1',
          commercialRelations: {
            __typename: 'CommercialRelationsConnection',
            totalCount: commercialRelations.length,
            pageInfo: {
              __typename: 'PageInfo',
              endCursor: '11',
              startCursor: null,
            },
            nodes: commercialRelations,
          },
        },
      },
    });
  });
}
