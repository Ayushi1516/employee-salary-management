import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { APP_NAME } from '../../core/constants/app.constants';
import { ROLE_LABELS } from '../../core/constants/role.constants';
import { NAV_ITEMS } from '../../core/constants/route.constants';
import { AuthService } from '../../core/services/auth.service';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';

/** App shell: sidebar on desktop, collapsible menu on mobile, and the page content on the right. */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  auth = inject(AuthService);

  appName = APP_NAME;
  navItems = NAV_ITEMS;
  roleLabels = ROLE_LABELS;
  menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
