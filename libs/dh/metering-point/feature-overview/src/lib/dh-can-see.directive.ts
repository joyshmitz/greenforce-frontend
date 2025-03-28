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
  ElectricityMarketMeteringPointType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';

import { MeteringPointDetails } from './types';

export type PropertyName =
  | 'energy-supplier-card'
  | 'energy-supplier-name'
  | 'customer-overview-card'
  | 'cpr'
  | 'contact-details'
  | 'actual-address'
  | 'settlement-method'
  | 'disconnection-type'
  | 'electrical-heating'
  | 'power-plant-section'
  | 'scheduled-meter-reading';
const AllMarketRoles = 'AllMarketRoles';

@Directive({
  selector: '[dhCanSee]',
})
export class DhCanSeeDirective {
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private actorStorage = inject(DhActorStorage);

  dhCanSee = input.required<PropertyName>();
  dhCanSeeMeteringPointDetails = input<MeteringPointDetails>();

  private isEnergySupplierResponsible = computed(
    () => this.dhCanSeeMeteringPointDetails()?.isEnergySupplier
  );

  constructor() {
    afterRenderEffect(() => {
      const mpDetails = this.dhCanSeeMeteringPointDetails();

      if (!mpDetails) return;

      const selectedActor = this.actorStorage.getSelectedActor();

      let canSee = false;

      if (selectedActor) {
        const marketRoles = dhWhoCanSeeWhatMap[this.dhCanSee()].marketRoles;

        canSee = marketRoles === AllMarketRoles || marketRoles.includes(selectedActor.marketRole);
      }

      if (canSee === false) {
        canSee = !!this.isEnergySupplierResponsible();
      }

      const mpType = mpDetails?.metadata.type;

      if (canSee && mpType) {
        canSee = dhWhoCanSeeWhatMap[this.dhCanSee()].meteringPointTypes.includes(mpType);
      }

      if (canSee) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}

const dhWhoCanSeeWhatMap: {
  [k in PropertyName]: {
    marketRoles: EicFunction[] | typeof AllMarketRoles;
    meteringPointTypes: ElectricityMarketMeteringPointType[];
  };
} = {
  'energy-supplier-card': {
    marketRoles: [EicFunction.DataHubAdministrator],
    meteringPointTypes: [
      ElectricityMarketMeteringPointType.Consumption,
      ElectricityMarketMeteringPointType.Production,
    ],
  },
  'energy-supplier-name': {
    marketRoles: [EicFunction.DataHubAdministrator],
    meteringPointTypes: [
      ElectricityMarketMeteringPointType.Consumption,
      ElectricityMarketMeteringPointType.Production,
    ],
  },
  'customer-overview-card': {
    marketRoles: AllMarketRoles,
    meteringPointTypes: [
      ElectricityMarketMeteringPointType.Consumption,
      ElectricityMarketMeteringPointType.Production,
    ],
  },
  cpr: {
    marketRoles: [EicFunction.DataHubAdministrator],
    meteringPointTypes: [
      ElectricityMarketMeteringPointType.Consumption,
      ElectricityMarketMeteringPointType.Production,
    ],
  },
  'contact-details': {
    marketRoles: [EicFunction.DataHubAdministrator, EicFunction.GridAccessProvider],
    meteringPointTypes: [
      ElectricityMarketMeteringPointType.Consumption,
      ElectricityMarketMeteringPointType.Production,
    ],
  },
  'actual-address': {
    marketRoles: AllMarketRoles,
    meteringPointTypes: [
      ElectricityMarketMeteringPointType.Consumption,
      ElectricityMarketMeteringPointType.Production,
    ],
  },
  'settlement-method': {
    marketRoles: AllMarketRoles,
    meteringPointTypes: [ElectricityMarketMeteringPointType.Consumption],
  },
  'disconnection-type': {
    marketRoles: AllMarketRoles,
    meteringPointTypes: [
      ElectricityMarketMeteringPointType.Consumption,
      ElectricityMarketMeteringPointType.Production,
    ],
  },
  'electrical-heating': {
    marketRoles: AllMarketRoles,
    meteringPointTypes: [ElectricityMarketMeteringPointType.Consumption],
  },
  'power-plant-section': {
    marketRoles: AllMarketRoles,
    meteringPointTypes: [
      ElectricityMarketMeteringPointType.Consumption,
      ElectricityMarketMeteringPointType.Production,
    ],
  },
  'scheduled-meter-reading': {
    marketRoles: AllMarketRoles,
    meteringPointTypes: [ElectricityMarketMeteringPointType.Consumption],
  },
};
