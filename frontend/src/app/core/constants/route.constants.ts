/** Route path segments, used in route configs. */
export const ROUTE_PATHS = {
  login: 'login',
  dashboard: 'dashboard',
  employees: 'employees',
  employeeNew: 'new',
  salaries: 'salaries',
};

/** Full URLs, used for navigation and links. */
export const APP_URLS = {
  login: '/login',
  dashboard: '/dashboard',
  employees: '/employees',
  employeeNew: '/employees/new',
  salaries: '/salaries',
  employeeProfile: (id: number) => `/employees/${id}`,
};

export const NAV_ITEMS = [
  { label: 'Dashboard', url: APP_URLS.dashboard },
  { label: 'Employees', url: APP_URLS.employees },
  { label: 'Salaries', url: APP_URLS.salaries },
];
