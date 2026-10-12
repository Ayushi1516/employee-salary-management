import { Component, input } from '@angular/core';

export type AlertType = 'error' | 'success' | 'info';

/** Inline message box: <app-alert type="error" [message]="error()" /> */
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  type = input<AlertType>('error');
  message = input.required<string>();
}
