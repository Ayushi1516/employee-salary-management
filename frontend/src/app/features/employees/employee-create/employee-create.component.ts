import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { APP_URLS } from '../../../core/constants/route.constants';
import { Employee } from '../../../core/models/employee.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

/** "Add employee" page. After saving, it opens the new profile so HR can add a salary right away. */
@Component({
  selector: 'app-employee-create',
  imports: [RouterLink, PageHeaderComponent, EmployeeFormComponent],
  templateUrl: './employee-create.component.html',
})
export class EmployeeCreateComponent {
  private router = inject(Router);

  urls = APP_URLS;

  onSaved(employee: Employee): void {
    this.router.navigateByUrl(APP_URLS.employeeProfile(employee.id));
  }

  onCancelled(): void {
    this.router.navigateByUrl(APP_URLS.employees);
  }
}
