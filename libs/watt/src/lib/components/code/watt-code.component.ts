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
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnInit,
  signal,
  input,
} from '@angular/core';

import { WattSpinnerComponent } from '../spinner';
import { VaterStackComponent } from '../vater';

import { createWorker } from './watt-code.worker-factory';

@Component({
  selector: 'watt-code',
  template: `
    @if (loading()) {
      <vater-stack [fill]="'horizontal'" [align]="'center'"><watt-spinner /></vater-stack>
    } @else {
      <pre>
        <code class="hljs" [innerHTML]="formattedCode()"></code>
      </pre>
    }
  `,
  styleUrls: ['./watt-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [WattSpinnerComponent, VaterStackComponent],
  standalone: true,
})
export class WattCodeComponent implements OnInit {
  code = input.required<string | null>();

  /** @ignore */
  formattedCode = signal<string>('');
  /** @ignore */
  loading = signal<boolean>(false);

  /** @ignore */
  ngOnInit(): void {
    if (this.code() === null) return;

    const worker = createWorker();

    worker.onmessage = (event) => {
      this.formattedCode.set(event.data);
      this.loading.set(false);
    };
    worker.postMessage(this.code());
    this.loading.set(true);
  }
}
