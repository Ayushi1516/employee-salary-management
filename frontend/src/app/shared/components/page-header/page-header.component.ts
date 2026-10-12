import { Component, input } from '@angular/core';

/** Page title + optional subtitle, with action buttons projected on the right. */
@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
  heading = input.required<string>();
  subtitle = input<string>('');
}
