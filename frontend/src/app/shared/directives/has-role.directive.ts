import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { Role } from '../../core/constants/role.constants';
import { AuthService } from '../../core/services/auth.service';

/**
 * Shows an element only for the given role(s). It reacts when the session changes.
 *   <button *appHasRole="roles.ADMIN">Edit</button>
 * This is a UI convenience only. The API gateway is what actually blocks forbidden calls.
 */
@Directive({ selector: '[appHasRole]' })
export class HasRoleDirective {
  private auth = inject(AuthService);
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private visible = false;

  appHasRole = input.required<Role | Role[]>();

  constructor() {
    effect(() => {
      const wanted = this.appHasRole();
      const allowed = this.auth.hasAnyRole(Array.isArray(wanted) ? wanted : [wanted]);
      if (allowed && !this.visible) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.visible = true;
      } else if (!allowed && this.visible) {
        this.viewContainer.clear();
        this.visible = false;
      }
    });
  }
}
