import { DatePipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { EMPTY, catchError, switchMap, tap } from 'rxjs';
import { MESSAGES } from '../../../core/constants/message.constants';
import { currencyForCountry } from '../../../core/constants/reference-data.constants';
import { ROLES } from '../../../core/constants/role.constants';
import { APP_URLS } from '../../../core/constants/route.constants';
import { Employee } from '../../../core/models/employee.model';
import { DepartmentService } from '../../../core/services/department.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { ToastService } from '../../../core/services/toast.service';
import { getErrorMessage } from '../../../core/utils/error.util';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ConfirmClickDirective } from '../../../shared/directives/confirm-click.directive';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { CountryNamePipe } from '../../../shared/pipes/country-name.pipe';
import { DepartmentNamePipe } from '../../../shared/pipes/department-name.pipe';
import { FullNamePipe } from '../../../shared/pipes/full-name.pipe';
import { SalaryPanelComponent } from '../../salaries/components/salary-panel/salary-panel.component';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

/** Whole profile in one page: personal details (from Employee Service) + salary (from Salary Service). */
@Component({
  selector: 'app-employee-profile',
  imports: [
    RouterLink, PageHeaderComponent, AlertComponent, LoadingComponent, StatusBadgeComponent, EmployeeFormComponent,
    SalaryPanelComponent, HasRoleDirective, ConfirmClickDirective, CountryNamePipe, DepartmentNamePipe, FullNamePipe, DatePipe,
  ],
  templateUrl: './employee-profile.component.html',
})
export class EmployeeProfileComponent {
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private toast = inject(ToastService);

  departmentService = inject(DepartmentService);

  /** Route parameter ":id", delivered as an input by withComponentInputBinding(). */
  id = input.required<string>();

  roles = ROLES;
  urls = APP_URLS;
  messages = MESSAGES.employee;
  currencyForCountry = currencyForCountry;

  employee = signal<Employee | null>(null);
  loading = signal(true);
  errorMessage = signal('');
  editing = signal(false);

  constructor() {
    this.departmentService.loadOnce();

    // Reload whenever the :id in the URL changes. switchMap cancels the previous request.
    toObservable(this.id)
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.errorMessage.set('');
          this.editing.set(false);
        }),
        switchMap((id) =>
          this.employeeService.get(Number(id)).pipe(
            catchError((error: unknown) => {
              this.errorMessage.set(getErrorMessage(error));
              this.loading.set(false);
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((employee) => {
        this.employee.set(employee);
        this.loading.set(false);
      });
  }

  onSaved(employee: Employee): void {
    this.employee.set(employee);
    this.editing.set(false);
  }

  terminate(employee: Employee): void {
    this.employeeService.terminate(employee.id).subscribe({
      next: () => {
        this.toast.success(MESSAGES.employee.terminated);
        this.router.navigateByUrl(APP_URLS.employees);
      },
      error: (error: unknown) => this.toast.error(getErrorMessage(error)),
    });
  }
}
