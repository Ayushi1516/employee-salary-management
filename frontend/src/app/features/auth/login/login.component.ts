import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_NAME } from '../../../core/constants/app.constants';
import { MESSAGES } from '../../../core/constants/message.constants';
import { APP_URLS } from '../../../core/constants/route.constants';
import { AuthService } from '../../../core/services/auth.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, AlertComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  appName = APP_NAME;
  loading = signal(false);
  errorMessage = signal('');

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');

    const { username, password } = this.form.getRawValue();
    this.auth.login(username, password).subscribe({
      next: () => this.router.navigateByUrl(APP_URLS.dashboard),
      error: (error: unknown) => {
        this.loading.set(false);
        const unauthorized = error instanceof HttpErrorResponse && error.status === 401;
        this.errorMessage.set(unauthorized ? MESSAGES.auth.invalidCredentials : MESSAGES.auth.unreachable);
      },
    });
  }
}
