import { Component, computed, input } from '@angular/core';
import { EMPLOYEE_STATUSES } from '../../../core/constants/reference-data.constants';
import { EmployeeStatus } from '../../../core/models/employee.model';

/** Coloured pill for an employee status: <app-status-badge [status]="employee.status" /> */
@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
})
export class StatusBadgeComponent {
  status = input.required<EmployeeStatus>();

  option = computed(() => EMPLOYEE_STATUSES.find((s) => s.value === this.status()));
}
