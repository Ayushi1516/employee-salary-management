import { Pipe, PipeTransform, inject } from '@angular/core';
import { DepartmentService } from '../../core/services/department.service';

/**
 * {{ employee.departmentId | departmentName }} -> "Engineering"
 * Impure on purpose: the department list arrives after the first render, and the pipe must pick it up.
 */
@Pipe({ name: 'departmentName', pure: false })
export class DepartmentNamePipe implements PipeTransform {
  private departments = inject(DepartmentService);

  transform(id: number | null | undefined): string {
    return id === null || id === undefined ? '--' : this.departments.nameOf(id);
  }
}
