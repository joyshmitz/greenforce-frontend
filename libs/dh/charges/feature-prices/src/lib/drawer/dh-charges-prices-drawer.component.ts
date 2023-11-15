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
import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { ChargeV1Dto } from '@energinet-datahub/dh/shared/domain';
import { RxPush } from '@rx-angular/template/push';

import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { TranslocoModule } from '@ngneat/transloco';

import { DhChargeDetailsHeaderComponent } from './charge-content/details-header/dh-charge-details-header.component';
import { DhChargesPricesDrawerService } from './dh-charges-prices-drawer.service';
import { DhChargeContentComponent } from './charge-content/dh-charge-content.component';
import { DhChargePriceMessageComponent } from './charge-message/dh-charge-price-message.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    WATT_DRAWER,
    TranslocoModule,
    WattTabComponent,
    WattTabsComponent,
    WattButtonComponent,
    DhChargeDetailsHeaderComponent,
    DhChargeContentComponent,
    DhChargePriceMessageComponent,
    RxPush,
    WattIconComponent,
  ],
  selector: 'dh-charges-prices-drawer',
  templateUrl: './dh-charges-prices-drawer.component.html',
  styleUrls: ['./dh-charges-prices-drawer.component.scss'],
})
export class DhChargesPricesDrawerComponent implements OnInit {
  private dhChargesPricesDrawerService = inject(DhChargesPricesDrawerService);
  private _destroyRef = inject(DestroyRef);

  @ViewChild('drawer')
  drawer!: WattDrawerComponent;
  @ViewChild(DhChargeContentComponent)
  chargeContent!: DhChargeContentComponent;

  @Output()
  closed = new EventEmitter<void>();

  message$ = this.dhChargesPricesDrawerService.message;
  charge?: ChargeV1Dto;
  showChargeMessage = false;

  ngOnInit(): void {
    this.dhChargesPricesDrawerService.message
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((message) => {
        if (message === undefined) this.showChargeMessage = false;
        else this.showChargeMessage = true;
      });
  }

  openDrawer(charge: ChargeV1Dto) {
    this.charge = charge;
    this.drawer.open();
    setTimeout(() => this.chargeContent.load());
    this.dhChargesPricesDrawerService.removeMessage();
  }

  drawerClosed() {
    this.dhChargesPricesDrawerService.reset();
    this.closed.emit();
  }

  goToCharge() {
    this.dhChargesPricesDrawerService.removeMessage();
  }
}
