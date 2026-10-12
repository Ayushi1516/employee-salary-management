import { Component, input } from '@angular/core';

/** "Nothing here" message for empty tables and lists. */
@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  title = input('Nothing to show');
  message = input('');
}
