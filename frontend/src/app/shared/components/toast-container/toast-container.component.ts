import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

/** Renders the pop-up messages from ToastService. Placed once, in the main layout. */
@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
