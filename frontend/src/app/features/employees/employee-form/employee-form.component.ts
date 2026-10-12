import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MESSAGES } from '../../../core/constants/message.constants';
import { COUNTRIES, EMPLOYEE_STATUSES } from '../../../core/constants/reference-data.constants';
import { Employee, EmployeeInput, EmployeeStatus } from '../../../core/models/employee.model';
import { DepartmentService } from '../../../core/services/department.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { ToastService } from '../../../core/services/toast.service';
import { todayIso } from '../../../core/utils/date.util';
import { getErrorMessage } from '../../../core/utils/error.util';

/**
 * Create / edit form for one employee. Pass an employee to edit, or nothing to create.
 *   <app-employee-form [employee]="employee()" (saved)="..." (cancelled)="..." />
 */
@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
})
export class EmployeeFormComponent {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private toast = inject(ToastService);

  departmentService = inject(DepartmentService);

  employee = input<Employee | null>(null);
  saved = output<Employee>();
  cancelled = output<void>();

  countries = COUNTRIES;
  statuses = EMPLOYEE_STATUSES;
  saving = signal(false);

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(80)]],
    lastName: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
    jobTitle: ['', [Validators.required, Validators.maxLength(120)]],
    departmentId: [0, [Validators.required, Validators.min(1)]],
    countryCode: ['', Validators.required],
    hireDate: [todayIso(), Validators.required],
    status: ['ACTIVE' as EmployeeStatus, Validators.required],
  });

  constructor() {
    this.departmentService.loadOnce();

    // Fill the form whenever the employee to edit changes (or reset it for "create").
    effect(() => {
      const current = this.employee();
      if (current) {
        this.form.reset(current);
      } else {
        this.form.reset({ firstName: '', lastName: '', email: '', jobTitle: '', departmentId: 0, countryCode: '', hireDate: todayIso(), status: 'ACTIVE' });
      }
    });
  }

  /** True when a field should show its error message (it was touched or edited and is invalid). */
  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const input: EmployeeInput = this.form.getRawValue();
    const current = this.employee();
    const request = current ? this.employeeService.update(current.id, input) : this.employeeService.create(input);

    this.saving.set(true);
    request.subscribe({
      next: (employee) => {
        this.saving.set(false);
        this.toast.success(current ? MESSAGES.employee.updated : MESSAGES.employee.created);
        this.saved.emit(employee);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.toast.error(getErrorMessage(error));
      },
    });
  }
}
