import { Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { currencyForCountry } from '../../../core/constants/reference-data.constants';
import { APP_URLS } from '../../../core/constants/route.constants';
import { Employee } from '../../../core/models/employee.model';
import { DepartmentService } from '../../../core/services/department.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { getErrorMessage } from '../../../core/utils/error.util';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { CountryNamePipe } from '../../../shared/pipes/country-name.pipe';
import { DepartmentNamePipe } from '../../../shared/pipes/department-name.pipe';
import { FullNamePipe } from '../../../shared/pipes/full-name.pipe';
import { SalaryPanelComponent } from '../components/salary-panel/salary-panel.component';

/** Salaries page: find an employee by ID, then manage their salary with the shared salary panel. */
@Component({
  selector: 'app-salaries-page',
  imports: [
    ReactiveFormsModule, RouterLink, PageHeaderComponent, AlertComponent, EmptyStateComponent, StatusBadgeComponent,
    SalaryPanelComponent, CountryNamePipe, DepartmentNamePipe, FullNamePipe,
  ],
  templateUrl: './salaries-page.component.html',
})
export class SalariesPageComponent {
  private employeeService = inject(EmployeeService);
  private fb = inject(FormBuilder);

  urls = APP_URLS;
  currencyForCountry = currencyForCountry;

  /** Optional query parameter: /salaries?employeeId=7 opens that employee directly. */
  employeeId = input<string>();

  employee = signal<Employee | null>(null);
  searching = signal(false);
  errorMessage = signal('');

  lookupForm = this.fb.group({
    employeeId: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    inject(DepartmentService).loadOnce();

    effect(() => {
      const id = this.employeeId();
      if (id) {
        this.lookupForm.patchValue({ employeeId: Number(id) });
        this.findEmployee();
      }
    });
  }

  findEmployee(): void {
    const id = this.lookupForm.controls.employeeId.value;
    if (this.lookupForm.invalid || id === null) {
      this.lookupForm.markAllAsTouched();
      return;
    }
    this.searching.set(true);
    this.errorMessage.set('');
    this.employeeService.get(id).subscribe({
      next: (employee) => {
        this.employee.set(employee);
        this.searching.set(false);
      },
      error: (error: unknown) => {
        this.employee.set(null);
        this.errorMessage.set(getErrorMessage(error));
        this.searching.set(false);
      },
    });
  }
}
