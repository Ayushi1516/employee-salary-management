import { Routes } from '@angular/router';
import { ROUTE_PATHS } from '../../core/constants/route.constants';

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    title: 'Employees',
    loadComponent: () => import('./employee-list/employee-list.component').then((m) => m.EmployeeListComponent),
  },
  // "new" must come before ":id", otherwise "new" would be read as an id.
  {
    path: ROUTE_PATHS.employeeNew,
    title: 'New employee',
    loadComponent: () => import('./employee-create/employee-create.component').then((m) => m.EmployeeCreateComponent),
  },
  {
    path: ':id',
    title: 'Employee profile',
    loadComponent: () => import('./employee-profile/employee-profile.component').then((m) => m.EmployeeProfileComponent),
  },
];
