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
  AfterViewInit,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

const customValueAccessor = {
  multi: true,
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => WattDropdownComponent),
};

export interface WattDropdownOption {
  value: string;
  displayValue: string;
}

@Component({
  selector: 'watt-dropdown',
  templateUrl: './watt-dropdown.component.html',
  styleUrls: ['./watt-dropdown.component.scss'],
  providers: [customValueAccessor],
  encapsulation: ViewEncapsulation.None
})
export class WattDropdownComponent
  implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy
{
  /** Subject that emits when the component has been destroyed. */
  private destroy$ = new Subject<void>();

  /**
   * @ignore
   */
  matSelectControl = new FormControl();

  /**
   * Control for the MatSelect filter keyword
   *
   * @ignore
   */
  filterControl = new FormControl();

  /**
   * List of options filtered by search keyword
   *
   * @ignore
   */
  filteredOptions = new ReplaySubject<WattDropdownOption[]>(1);

  @ViewChild('matSelect', { static: true }) matSelect?: MatSelect;

  /**
   *
   * Sets the options for the dropdown.
   */
  @Input() options: WattDropdownOption[] = [];

  /**
   * Sets support for selecting multiple dropdown options.
   */
  @Input() multiple = false;

  /**
   * Sets the placeholder for the dropdown.
   *
   * @required
   */
  @Input() placeholder = '';

  /**
   * Sets the placeholder for the filter input.
   *
   * @required
   */
  @Input() placeholderLabel = '';

  /**
   * Label to be shown when no entries are found.
   *
   * @required
   */
  @Input() noEntriesFoundLabel = '';

  /**
   * @ignore
   */
  writeValue(value: WattDropdownOption | WattDropdownOption[] | null): void {
    this.matSelectControl.setValue(value);
  }

  /**
   * @ignore
   */
  registerOnChange(onChangeFn: (value: WattDropdownOption) => void) {
    this.onChange = onChangeFn;
  }

  /**
   * @ignore
   */
  registerOnTouched(onTouchFn: () => void) {
    this.onTouched = onTouchFn;
  }

  /**
   * @ignore
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (value: WattDropdownOption) => {
    // Intentionally left empty
  };

  /**
   * @ignore
   */
  onTouched = () => {
    // Intentionally left empty
  };

  ngOnInit() {
    this.unsetMaterialXOffset();

    // load the initial list of options
    this.filteredOptions.next(this.options.slice());

    // listen for search field value changes
    this.filterControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.filterOptions();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
    this.onMatSelectValueChange();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private unsetMaterialXOffset() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const select: any = this.matSelect;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    select._positioningSettled = () => {};
  }

  private onMatSelectValueChange() {
    this.matSelectControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: WattDropdownOption) => {
        this.onTouched();
        this.onChange(value);
      });
  }

  /**
   * Sets the initial value after the filteredOptions are loaded initially
   */
  private setInitialValue() {
    this.filteredOptions
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredOptions are loaded initially
        // and after the mat-option elements are available
        if (this.matSelect) {
          this.matSelect.compareWith = (
            a: WattDropdownOption,
            b: WattDropdownOption
          ) => a && b && a.value === b.value;
        }
      });
  }

  private filterOptions() {
    if (!this.options) {
      return;
    }

    // get the search keyword
    let search = this.filterControl.value;

    if (!search) {
      this.filteredOptions.next(this.options.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    // filter the options
    this.filteredOptions.next(
      this.options.filter(
        (option) => option.displayValue.toLowerCase().indexOf(search) > -1
      )
    );
  }
}
