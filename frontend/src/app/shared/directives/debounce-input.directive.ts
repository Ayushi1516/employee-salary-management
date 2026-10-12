import { DestroyRef, Directive, inject, input, output } from '@angular/core';
import { UI } from '../../core/constants/app.constants';

/**
 * Emits the input's value only after the user stops typing, so a search box does not call the API on every key.
 *   <input appDebounceInput (debounced)="search($event)" />
 */
@Directive({
  selector: 'input[appDebounceInput]',
  host: { '(input)': 'onInput($event)' },
})
export class DebounceInputDirective {
  private timer?: ReturnType<typeof setTimeout>;

  debounceMs = input(UI.searchDebounceMs);
  debounced = output<string>();

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  onInput(event: Event): void {
    clearTimeout(this.timer);
    const value = (event.target as HTMLInputElement).value;
    this.timer = setTimeout(() => this.debounced.emit(value), this.debounceMs());
  }
}
