import { Directive, input, output } from '@angular/core';

/**
 * Asks "Are you sure?" before running an action, so every destructive button behaves the same.
 *   <button [appConfirmClick]="'Delete this?'" (confirmed)="delete()">Delete</button>
 */
@Directive({
  selector: '[appConfirmClick]',
  host: { '(click)': 'onClick()' },
})
export class ConfirmClickDirective {
  appConfirmClick = input.required<string>();
  confirmed = output<void>();

  onClick(): void {
    if (window.confirm(this.appConfirmClick())) this.confirmed.emit();
  }
}
