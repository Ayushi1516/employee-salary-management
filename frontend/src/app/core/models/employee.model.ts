export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  departmentId: number;
  countryCode: string;
  hireDate: string;
  status: EmployeeStatus;
}

/** What the create/update form sends (no id). */
export type EmployeeInput = Omit<Employee, 'id'>;

export interface EmployeeFilters {
  q?: string;
  departmentId?: number | null;
  countryCode?: string;
  page?: number;
  size?: number;
}
