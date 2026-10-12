import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { Department } from '../models/department.model';

/** Departments change rarely, so they are loaded once and shared by every screen. */
@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private http = inject(HttpClient);
  private requested = false;

  departments = signal<Department[]>([]);

  list() {
    return this.http
      .get<Department[]>(API_ENDPOINTS.departments.base)
      .pipe(tap((list) => this.departments.set(list)));
  }

  /** Call from any component that needs department names; only the first call hits the server. */
  loadOnce(): void {
    if (this.requested) return;
    this.requested = true;
    this.list().subscribe({ error: () => (this.requested = false) });
  }

  nameOf(id: number): string {
    return this.departments().find((d) => d.id === id)?.name ?? `Department ${id}`;
  }
}
