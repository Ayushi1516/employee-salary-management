import { Routes } from '@angular/router';
import { ROUTE_PATHS } from './core/constants/route.constants';
import { authGuard, guestGuard } from './core/guards/auth.guard';

/** Every area is lazy-loaded, so the login page ships without any dashboard or table code. */
export const routes: Routes = [
  {
    path: ROUTE_PATHS.login,
    title: 'Sign in',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: ROUTE_PATHS.dashboard },
      {
        path: ROUTE_PATHS.dashboard,
        title: 'Dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: ROUTE_PATHS.employees,
        loadChildren: () => import('./features/employees/employees.routes').then((m) => m.EMPLOYEE_ROUTES),
      },
      {
        path: ROUTE_PATHS.salaries,
        loadChildren: () => import('./features/salaries/salaries.routes').then((m) => m.SALARY_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
