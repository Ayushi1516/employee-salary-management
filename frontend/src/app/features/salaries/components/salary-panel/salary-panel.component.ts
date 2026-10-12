import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, EMPTY, catchError, combineLatest, switchMap, tap } from 'rxjs';
import { MESSAGES } from '../../../../core/constants/message.constants';
import { CURRENCIES } from '../../../../core/constants/reference-data.constants';
import { ROLES } from '../../../../core/constants/role.constants';
import { Salary } from '../../../../core/models/salary.model';
import { SalaryService } from '../../../../core/services/salary.service';
import { ToastService } from '../../../../core/services/toast.service';
import { todayIso } from '../../../../core/utils/date.util';
import { getErrorMessage } from '../../../../core/utils/error.util';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ConfirmClickDirective } from '../../../../shared/directives/confirm-click.directive';
import { HasRoleDirective } from '../../../../shared/directives/has-role.directive';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';

/**
 * Salary history of ONE employee, with add / correct / delete.
 * Used on both the Employee profile and the Salaries page, so both screens
 * read and write the same data through the Salary Service (salary_db).
 */
@Component({
  selector: 'app-salary-panel',
  imports: [ReactiveFormsModule, AlertComponent, LoadingComponent, EmptyStateComponent, HasRoleDirective, ConfirmClickDirective, MoneyPipe, DatePipe],
  templateUrl: './salary-panel.component.html',
})
export class SalaryPanelComponent {
  private salaryService = inject(SalaryService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  employeeId = input.required<number>();
  defaultCurrency = input('USD');

  roles = ROLES;
  currencies = CURRENCIES;
  messages = MESSAGES.salary;

  history = signal<Salary[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  saving = signal(false);
  correctingId = signal<number | null>(null);

  /** The row with no end date is the salary in force today. */
  currentSalary = computed(() => this.history().find((s) => s.effectiveTo === null) ?? null);

  newSalaryForm = this.fb.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
    currency: ['USD', Validators.required],
    effectiveFrom: [todayIso(), Validators.required],
  });
  correctionAmount = new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]);

  /** Emit to reload the history after a change. */
  private reload = new BehaviorSubject<void>(undefined);

  constructor() {
    // Load whenever the employee changes OR a reload is requested.
    combineLatest([toObservable(this.employeeId), this.reload])
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.errorMessage.set('');
          this.correctingId.set(null);
        }),
        switchMap(([employeeId]) =>
          this.salaryService.historyOf(employeeId).pipe(
            catchError((error: unknown) => {
              this.errorMessage.set(getErrorMessage(error));
              this.loading.set(false);
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((history) => {
        this.history.set(history);
        this.loading.set(false);
      });

    // Pre-select the currency of the employee's country in the "new salary" form.
    toObservable(this.defaultCurrency)
      .pipe(takeUntilDestroyed())
      .subscribe((currency) => this.newSalaryForm.patchValue({ currency }));
  }

  addSalary(): void {
    if (this.newSalaryForm.invalid) {
      this.newSalaryForm.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.salaryService.create({ employeeId: this.employeeId(), ...this.newSalaryForm.getRawValue() }).subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(MESSAGES.salary.created);
        this.newSalaryForm.patchValue({ amount: 0 });
        this.newSalaryForm.markAsUntouched();
        this.reload.next();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.toast.error(getErrorMessage(error));
      },
    });
  }

  startCorrection(salary: Salary): void {
    this.correctionAmount.setValue(salary.amount);
    this.correctingId.set(salary.id);
  }

  cancelCorrection(): void {
    this.correctingId.set(null);
  }

  saveCorrection(salary: Salary): void {
    const amount = this.correctionAmount.value;
    if (this.correctionAmount.invalid || amount === null) {
      this.correctionAmount.markAsTouched();
      return;
    }
    this.salaryService.correct(salary.id, amount, salary.currency).subscribe({
      next: () => {
        this.toast.success(MESSAGES.salary.corrected);
        this.reload.next();
      },
      error: (error: unknown) => this.toast.error(getErrorMessage(error)),
    });
  }

  deleteSalary(salary: Salary): void {
    this.salaryService.remove(salary.id).subscribe({
      next: () => {
        this.toast.success(MESSAGES.salary.deleted);
        this.reload.next();
      },
      error: (error: unknown) => this.toast.error(getErrorMessage(error)),
    });
  }
}
