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

// TODO: Get these values from design tokens
export type Spacing = 'xs' | 's' | 'm' | 'ml' | 'l' | 'xl';
export type Fill = 'horizontal' | 'vertical' | 'both';
export type Inset = '0' | Spacing;
export type Align = 'stretch' | 'start' | 'end' | 'center' | 'baseline';
export type Direction = 'row' | 'column';
export type Justify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
