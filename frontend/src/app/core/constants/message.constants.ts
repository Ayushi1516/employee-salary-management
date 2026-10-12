/** User-facing text in one place, so wording is consistent and easy to change. */
export const MESSAGES = {
  employee: {
    created: 'Employee created.',
    updated: 'Employee details saved.',
    terminated: 'Employee terminated. Salary history is kept.',
    confirmTerminate: (name: string) => `Terminate ${name}? Their salary history is kept.`,
  },
  salary: {
    created: 'Salary saved.',
    corrected: 'Salary corrected.',
    deleted: 'Salary record deleted.',
    confirmDelete: 'Delete this salary record? This cannot be undone.',
  },
  auth: {
    invalidCredentials: 'Username or password is incorrect.',
    unreachable: 'Cannot reach the server. Please try again.',
  },
  errors: {
    generic: 'Something went wrong. Please try again.',
    readOnly: 'Your role is read-only. Ask an HR admin to make this change.',
    unavailable: 'A backend service is temporarily unavailable. Please retry in a moment.',
    notFound: 'The requested record was not found.',
  },
};
