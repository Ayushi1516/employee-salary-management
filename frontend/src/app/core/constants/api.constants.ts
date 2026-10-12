/** Every backend URL in one place. All calls go through the API gateway under /api. */
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
  },
  employees: {
    base: '/api/employees',
    byId: (id: number) => `/api/employees/${id}`,
  },
  salaries: {
    base: '/api/salaries',
    byId: (id: number) => `/api/salaries/${id}`,
    byEmployee: (employeeId: number) => `/api/salaries/employee/${employeeId}`,
    analytics: '/api/salaries/analytics',
  },
  departments: {
    base: '/api/departments',
  },
};
