import { Routes } from '@angular/router';

export const SALARY_ROUTES: Routes = [
  {
    path: '',
    title: 'Salaries',
    loadComponent: () => import('./salaries-page/salaries-page.component').then((m) => m.SalariesPageComponent),
  },
];
