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
import { NgModule } from '@angular/core';
import { WattIconModule } from './../../foundations/icon/icon.module';
import { WattButtonComponent } from './watt-button.component';
import { WattPrimaryButtonModule } from './primary-button/watt-primary-button.module';
import { WattSecondaryButtonModule } from './secondary-button/watt-secondary-button.module';
import { WattTextButtonModule } from './text-button/watt-text-button.module';
import { WattSpinnerModule } from '../spinner';
import { WattIconButtonModule } from './icon-button/watt-icon-button.module';
import { MatButtonModule } from '@angular/material/button';
import { WattButtonAltComponent } from './watt-button-alt.component';

@NgModule({
  declarations: [WattButtonComponent, WattButtonAltComponent],
  exports: [WattButtonComponent, WattButtonAltComponent, WattIconButtonModule],
  imports: [
    CommonModule,
    WattIconModule,
    WattSpinnerModule,
    WattTextButtonModule,
    WattSecondaryButtonModule,
    WattPrimaryButtonModule,
    MatButtonModule,
  ],
})
export class WattButtonModule {}
