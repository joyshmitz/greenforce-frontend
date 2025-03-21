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
import { Component } from '@angular/core';

@Component({
  selector: 'watt-empty-state-explore',
  template: `
    <svg viewBox="0 0 96 98" fill="none">
      <path
        fill="currentColor"
        d="M59.4473 60.5798c-.2445.1864-.503.3517-.7317.5628a34.937 34.937 0 0 1-17.0602 8.5072 34.4744 34.4744 0 0 1-7.8055.591A35.139 35.139 0 0 1 1.4442 45.2255 33.1081 33.1081 0 0 1 .081 37.7788c-.663-10.7585 2.7613-20.015 10.3769-27.6464C15.4248 5.141 21.4574 2.0226 28.3747.656a33.4635 33.4635 0 0 1 7.6807-.6366c8.9962.3324 16.8105 3.5474 23.3356 9.7612 5.25 4.9932 8.5899 11.098 10.1007 18.1842a33.6296 33.6296 0 0 1 .6719 9.1457c-.5417 8.6262-3.7896 16.0818-9.7437 22.3665a6.0972 6.0972 0 0 0-.4045.5276l-.5681.5752Zm9.2494-25.4269c0-18.5657-15.0358-33.5928-33.5928-33.607C16.7263 1.5303 1.511 16.4255 1.511 35.1548c.0158 18.7803 15.2593 33.417 33.2921 33.57 18.3794.1583 33.8514-14.6806 33.8866-33.5718h.007Z"
      />
      <path
        fill="currentColor"
        d="m59.4473 60.5797.5751-.5751c.2515-.1882.2586-.1935.4714.0211.5822.5909 1.159 1.1871 1.7377 1.7816l15.7447 16.1809 16.4183 16.8703c.4414.4537.8794.9058 1.3243 1.3595.1073.1108.2094.2251.2885.3096l-1.043 1.1203-35.7861-36.7587.2691-.3095ZM60.4444 35.8792h-1.4897c-.1196-6.3316-2.3199-11.8331-6.8083-16.3286-4.4884-4.4954-9.9864-6.7045-16.3427-6.8364v-1.4475c12.563-.3887 24.755 10.4508 24.6407 24.6125Z"
      />
    </svg>
  `,
})
export class WattEmptyStateExploreComponent {}
