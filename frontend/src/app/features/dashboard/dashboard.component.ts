import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { SalaryAnalytics } from '../../core/models/salary.model';
import { DepartmentService } from '../../core/services/department.service';
import { SalaryService } from '../../core/services/salary.service';
import { getErrorMessage } from '../../core/utils/error.util';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { CompactUsdPipe } from '../../shared/pipes/compact-usd.pipe';
import { CountryNamePipe } from '../../shared/pipes/country-name.pipe';
import { MoneyPipe } from '../../shared/pipes/money.pipe';

/** One row of the "payroll by department" table. */
interface DepartmentRow {
  id: number;
  name: string;
  employees: number;
  averageUsd: number;
  totalUsd: number;
  sharePercent: number; // length of the bar, relative to the biggest department
}

@Component({
  selector: 'app-dashboard',
  imports: [PageHeaderComponent, AlertComponent, LoadingComponent, EmptyStateComponent, CompactUsdPipe, MoneyPipe, CountryNamePipe, DecimalPipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private salaryService = inject(SalaryService);
  private departmentService = inject(DepartmentService);

  analytics = signal<SalaryAnalytics | null>(null);
  loading = signal(true);
  errorMessage = signal('');

  /** Joins analytics (keyed by department id) with department names; the biggest cost comes first. */
  departmentRows = computed<DepartmentRow[]>(() => {
    const stats = this.analytics()?.byDepartment ?? [];
    const largest = Math.max(1, ...stats.map((s) => s.totalUsd));
    return stats
      .map((s) => ({
        id: Number(s.key),
        name: this.departmentService.nameOf(Number(s.key)),
        employees: s.employees,
        averageUsd: s.avgUsd,
        totalUsd: s.totalUsd,
        sharePercent: (s.totalUsd / largest) * 100,
      }))
      .sort((a, b) => b.totalUsd - a.totalUsd);
  });

  constructor() {
    forkJoin({ analytics: this.salaryService.analytics(), departments: this.departmentService.list() }).subscribe({
      next: ({ analytics }) => {
        this.analytics.set(analytics);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.errorMessage.set(getErrorMessage(error));
        this.loading.set(false);
      },
    });
  }
}
