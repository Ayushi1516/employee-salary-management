import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EMPTY, Subject, catchError, merge, switchMap, tap } from 'rxjs';
import { PAGINATION } from '../../../core/constants/app.constants';
import { MESSAGES } from '../../../core/constants/message.constants';
import { COUNTRIES } from '../../../core/constants/reference-data.constants';
import { ROLES } from '../../../core/constants/role.constants';
import { APP_URLS } from '../../../core/constants/route.constants';
import { Employee } from '../../../core/models/employee.model';
import { Page } from '../../../core/models/page.model';
import { DepartmentService } from '../../../core/services/department.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { ToastService } from '../../../core/services/toast.service';
import { getErrorMessage } from '../../../core/utils/error.util';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ConfirmClickDirective } from '../../../shared/directives/confirm-click.directive';
import { DebounceInputDirective } from '../../../shared/directives/debounce-input.directive';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { CountryNamePipe } from '../../../shared/pipes/country-name.pipe';
import { DepartmentNamePipe } from '../../../shared/pipes/department-name.pipe';
import { FullNamePipe } from '../../../shared/pipes/full-name.pipe';

@Component({
  selector: 'app-employee-list',
  imports: [
    ReactiveFormsModule, RouterLink, PageHeaderComponent, AlertComponent, LoadingComponent, EmptyStateComponent,
    PaginationComponent, StatusBadgeComponent, HasRoleDirective, DebounceInputDirective, ConfirmClickDirective,
    CountryNamePipe, DepartmentNamePipe, FullNamePipe, DatePipe,
  ],
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent {
  private employeeService = inject(EmployeeService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  departmentService = inject(DepartmentService);

  // constants used by the template
  roles = ROLES;
  urls = APP_URLS;
  countries = COUNTRIES;
  messages = MESSAGES.employee;

  // screen state
  employees = signal<Page<Employee> | null>(null);
  loading = signal(true);
  errorMessage = signal('');
  pageSize = signal(PAGINATION.defaultSize);

  filterForm = this.fb.group({
    q: [''],
    departmentId: [null as number | null],
    countryCode: [''],
  });

  /** Each emission is a page number to load. switchMap cancels the previous request if a new one starts. */
  private loadRequests = new Subject<number>();

  constructor() {
    this.departmentService.loadOnce();

    this.loadRequests
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.errorMessage.set('');
        }),
        switchMap((page) => {
          const { q, departmentId, countryCode } = this.filterForm.getRawValue();
          return this.employeeService.search({ q: q ?? '', departmentId, countryCode: countryCode ?? '', page, size: this.pageSize() }).pipe(
            catchError((error: unknown) => {
              this.errorMessage.set(getErrorMessage(error));
              this.loading.set(false);
              return EMPTY;
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((page) => {
        this.employees.set(page);
        this.loading.set(false);
      });

    // Dropdown filters search immediately (the text box uses the debounce directive instead).
    const { departmentId, countryCode } = this.filterForm.controls;
    merge(departmentId.valueChanges, countryCode.valueChanges)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.search());

    this.loadPage(0);
  }

  loadPage(page: number): void {
    this.loadRequests.next(page);
  }

  search(): void {
    this.loadPage(0);
  }

  clearFilters(): void {
    this.filterForm.reset({ q: '', departmentId: null, countryCode: '' });
    this.loadPage(0);
  }

  terminate(employee: Employee): void {
    this.employeeService.terminate(employee.id).subscribe({
      next: () => {
        this.toast.success(MESSAGES.employee.terminated);
        this.loadPage(this.employees()?.page ?? 0);
      },
      error: (error: unknown) => this.toast.error(getErrorMessage(error)),
    });
  }
}
