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
import { DestroyRef, Directive, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@ngneat/transloco';

import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';

@Directive({
  standalone: true,
  selector: '[dhDropdownTranslator]',
})
export class DhDropdownTranslatorDirective implements OnInit {
  private translocoService = inject(TranslocoService);
  private host = inject(WattDropdownComponent);
  private destroyRef = inject(DestroyRef);

  @Input({ required: true }) translate = '';

  ngOnInit(): void {
    this.translocoService
      .selectTranslateObject<object>(this.translate)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (keys) => {
          this.setTranslation(keys);
        },
      });
  }

  private setTranslation(keys: object): void {
    const translatedOptions = this.host.options.map((option) => ({
      ...option,
      displayValue: keys[option.value as keyof typeof keys],
    }));

    this.host.options = this.host.sortDirection
      ? this.host.sortOptions(translatedOptions)
      : translatedOptions;
  }
}
