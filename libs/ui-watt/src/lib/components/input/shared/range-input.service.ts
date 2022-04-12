import { Injectable, OnDestroy } from '@angular/core';
import {
  combineLatest,
  distinctUntilChanged,
  fromEvent,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

export interface WattRangeInputConfig {
  startInput: {
    element: HTMLInputElement;
    initialValue?: string;
    mask: Inputmask.Instance;
  };
  endInput: {
    element: HTMLInputElement;
    initialValue?: string;
    mask: Inputmask.Instance;
  };
}

@Injectable()
export class WattRangeInputService implements OnDestroy {
  private destroy$: Subject<void> = new Subject();
  onChange$?: Observable<[unknown, unknown]>;

  init(config: WattRangeInputConfig) {
    const { startInput, endInput } = config;

    const startInputElementOnInput$ = fromEvent<InputEvent>(
      startInput.element,
      'input'
    ).pipe(
      tap((event: InputEvent) =>
        this.jumpToEndInput(event, startInput.mask, endInput.element)
      ),
      map((event: InputEvent) => (event.target as HTMLInputElement).value)
    );

    const endInputElementOnInput$ = fromEvent<InputEvent>(
      endInput.element,
      'input'
    ).pipe(map((event) => (event.target as HTMLInputElement).value));

    const startInputElementOnComplete$ = startInputElementOnInput$.pipe(
      startWith(startInput.initialValue || ''),
      map((val) => (startInput.mask.isComplete() ? val : ''))
    );

    const endInputElementOnComplete$ = endInputElementOnInput$.pipe(
      startWith(endInput.initialValue || ''),
      map((val) => (endInput.mask.isComplete() ? val : ''))
    );

    this.onChange$ = combineLatest([
      startInputElementOnComplete$,
      endInputElementOnComplete$,
    ]).pipe(
      // Note: A custom comparator function is necessary
      // because RxJS' built-in comparator function checks
      // the current and previous values for strict equality.
      // In our case this will always return `false` since RxJS
      // emits arrays and arrays are strictly equal only by reference.
      distinctUntilChanged(this.customComparator),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private customComparator(
    [prevStart, prevEnd]: [string, string],
    [currStart, currEnd]: [string, string]
  ): boolean {
    return prevStart === currStart && prevEnd === currEnd;
  }

  private jumpToEndInput(
    event: InputEvent | KeyboardEvent,
    inputmask: Inputmask.Instance,
    endInputElement: HTMLInputElement
  ) {
    if (
      inputmask.isComplete() &&
      (event.target as HTMLInputElement).value.length ===
        inputmask.getemptymask().length
    ) {
      endInputElement.focus();
    }
  }
}
