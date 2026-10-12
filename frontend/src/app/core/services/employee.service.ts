import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_ENDPOINTS } from '../constants/api.constants';
import { PAGINATION } from '../constants/app.constants';
import { Employee, EmployeeFilters, EmployeeInput } from '../models/employee.model';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private http = inject(HttpClient);

  /** Server-side search + paging. Only filters that have a value are sent. */
  search(filters: EmployeeFilters) {
    let params = new HttpParams()
      .set('page', filters.page ?? 0)
      .set('size', filters.size ?? PAGINATION.defaultSize);
    if (filters.q?.trim()) params = params.set('q', filters.q.trim());
    if (filters.departmentId) params = params.set('departmentId', filters.departmentId);
    if (filters.countryCode) params = params.set('countryCode', filters.countryCode);
    return this.http.get<Page<Employee>>(API_ENDPOINTS.employees.base, { params });
  }

  get(id: number) {
    return this.http.get<Employee>(API_ENDPOINTS.employees.byId(id));
  }

  create(input: EmployeeInput) {
    return this.http.post<Employee>(API_ENDPOINTS.employees.base, input);
  }

  update(id: number, input: EmployeeInput) {
    return this.http.put<Employee>(API_ENDPOINTS.employees.byId(id), input);
  }

  /** Soft delete on the server: status becomes TERMINATED. */
  terminate(id: number) {
    return this.http.delete<void>(API_ENDPOINTS.employees.byId(id));
  }
}
