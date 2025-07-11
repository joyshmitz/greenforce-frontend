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
  afterRenderEffect,
  computed,
  Directive,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import {
  EicFunction,
  ElectricityMarketMeteringPointType as MeteringPointType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';

import { MeteringPointDetails } from '../../types';

export type PropertyName =
  | 'energy-supplier-card'
  | 'energy-supplier-name'
  | 'customer-overview-card'
  | 'private-customer-overview'
  | 'cpr'
  | 'contact-details'
  | 'actual-address'
  | 'settlement-method'
  | 'disconnection-type'
  | 'electrical-heating'
  | 'power-plant-section'
  | 'scheduled-meter-reading'
  | 'from-grid-area'
  | 'to-grid-area';

@Directive({
  selector: '[dhCanSee]',
})
export class DhCanSeeDirective {
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private actorStorage = inject(DhActorStorage);

  dhCanSee = input.required<PropertyName>();
  dhCanSeeMeteringPoint = input<MeteringPointDetails>();

  private isEnergySupplierResponsible = computed(
    () => this.dhCanSeeMeteringPoint()?.isEnergySupplier
  );

  constructor() {
    afterRenderEffect(() => {
      this.viewContainer.clear();

      const meteringPoint = this.dhCanSeeMeteringPoint();

      if (!meteringPoint) return;

      const selectedActor = this.actorStorage.getSelectedActor();

      let canSee = false;

      const marketRoles = dhWhoCanSeeWhatMap[this.dhCanSee()].marketRoles;
      canSee = marketRoles.includes(selectedActor.marketRole);

      if (canSee === false) {
        canSee = !!this.isEnergySupplierResponsible();
      }

      const mpType = meteringPoint.metadata.type;

      if (canSee && mpType) {
        canSee = dhWhoCanSeeWhatMap[this.dhCanSee()].meteringPointTypes.includes(mpType);
      }

      if (canSee) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}

const shouldAllwaysShowFor = [
  EicFunction.DataHubAdministrator,
  EicFunction.SystemOperator,
  EicFunction.DanishEnergyAgency,
];

const AllMarketRoles = [
  ...shouldAllwaysShowFor,
  EicFunction.GridAccessProvider,
  EicFunction.EnergySupplier,
];

const dhWhoCanSeeWhatMap: {
  [k in PropertyName]: {
    marketRoles: EicFunction[];
    meteringPointTypes: MeteringPointType[];
  };
} = {
  'energy-supplier-card': {
    marketRoles: shouldAllwaysShowFor,
    meteringPointTypes: [MeteringPointType.Consumption, MeteringPointType.Production],
  },
  'energy-supplier-name': {
    marketRoles: shouldAllwaysShowFor,
    meteringPointTypes: [MeteringPointType.Consumption, MeteringPointType.Production],
  },
  'customer-overview-card': {
    marketRoles: AllMarketRoles,
    meteringPointTypes: [MeteringPointType.Consumption, MeteringPointType.Production],
  },
  'private-customer-overview': {
    marketRoles: [EicFunction.GridAccessProvider, ...shouldAllwaysShowFor],
    meteringPointTypes: [MeteringPointType.Consumption, MeteringPointType.Production],
  },
  cpr: {
    marketRoles: shouldAllwaysShowFor,
    meteringPointTypes: [MeteringPointType.Consumption, MeteringPointType.Production],
  },
  'contact-details': {
    marketRoles: [EicFunction.GridAccessProvider, ...shouldAllwaysShowFor],
    meteringPointTypes: [MeteringPointType.Consumption, MeteringPointType.Production],
  },
  'actual-address': {
    marketRoles: AllMarketRoles,
    meteringPointTypes: [MeteringPointType.Consumption, MeteringPointType.Production],
  },
  'settlement-method': {
    marketRoles: AllMarketRoles,
    meteringPointTypes: [MeteringPointType.Consumption],
  },
  'disconnection-type': {
    marketRoles: AllMarketRoles,
    meteringPointTypes: [MeteringPointType.Consumption, MeteringPointType.Production],
  },
  'electrical-heating': {
    marketRoles: AllMarketRoles,
    meteringPointTypes: [MeteringPointType.Consumption],
  },
  'power-plant-section': {
    marketRoles: AllMarketRoles,
    meteringPointTypes: [MeteringPointType.Consumption, MeteringPointType.Production],
  },
  'scheduled-meter-reading': {
    marketRoles: AllMarketRoles,
    meteringPointTypes: [MeteringPointType.Consumption],
  },
  'from-grid-area': {
    marketRoles: AllMarketRoles,
    meteringPointTypes: [
      MeteringPointType.Production,
      MeteringPointType.ExchangeReactiveEnergy,
      MeteringPointType.Exchange,
    ],
  },
  'to-grid-area': {
    marketRoles: AllMarketRoles,
    meteringPointTypes: [
      MeteringPointType.Production,
      MeteringPointType.ExchangeReactiveEnergy,
      MeteringPointType.Exchange,
    ],
  },
};
