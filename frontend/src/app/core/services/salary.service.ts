import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_ENDPOINTS } from '../constants/api.constants';
import { CreateSalaryInput, Salary, SalaryAnalytics } from '../models/salary.model';

@Injectable({ providedIn: 'root' })
export class SalaryService {
  private http = inject(HttpClient);

  historyOf(employeeId: number) {
    return this.http.get<Salary[]>(API_ENDPOINTS.salaries.byEmployee(employeeId));
  }

  /** Records a new salary (a raise). The server closes the previous row. */
  create(input: CreateSalaryInput) {
    return this.http.post<Salary>(API_ENDPOINTS.salaries.base, input);
  }

  /** Fixes a typo in an existing row. Use create() for a real raise. */
  correct(id: number, amount: number, currency: string) {
    return this.http.put<Salary>(API_ENDPOINTS.salaries.byId(id), { amount, currency });
  }

  remove(id: number) {
    return this.http.delete<void>(API_ENDPOINTS.salaries.byId(id));
  }

  analytics() {
    return this.http.get<SalaryAnalytics>(API_ENDPOINTS.salaries.analytics);
  }
}
